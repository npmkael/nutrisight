import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

const KEY_PREFIX = "mealNotif"; // mealNotif:YYYY-MM-DD:breakfast -> notificationId

function dateKey(date: Date, meal: string) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${KEY_PREFIX}:${y}-${m}-${d}:${meal}`;
}

export async function ensurePermissions(): Promise<boolean> {
  const { status: existing } = await Notifications.getPermissionsAsync();
  let final = existing;
  if (existing !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    final = status;
  }
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("meals", {
      name: "Meal reminders",
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }
  return Device.isDevice && final === "granted";
}

export async function scheduleMealNotificationForDate(
  meal: "breakfast" | "lunch" | "dinner",
  date: Date,
  hour: number,
  minute = 0,
  title = "Meal reminder",
  body = "You haven't logged your meal yet"
) {
  const ok = await ensurePermissions();
  if (!ok) return null;

  const triggerDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    hour,
    minute,
    0,
    0
  );
  if (triggerDate.getTime() <= Date.now()) return null;

  // build a proper DateTriggerInput so TS matches expo-notifications types
  const dateTrigger: Notifications.DateTriggerInput = {
    type: Notifications.SchedulableTriggerInputTypes.DATE,
    date: triggerDate,
  };

  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data: { meal, date: triggerDate.toISOString(), __Type: "meal-reminder" },
    },
    trigger: dateTrigger,
  });

  await AsyncStorage.setItem(dateKey(date, meal), id);
  return id;
}

export async function cancelMealNotificationForDate(
  meal: "breakfast" | "lunch" | "dinner",
  date: Date
) {
  const key = dateKey(date, meal);
  try {
    const id = await AsyncStorage.getItem(key);
    if (id) {
      await Notifications.cancelScheduledNotificationAsync(id);
      await AsyncStorage.removeItem(key);
      return true;
    }
  } catch (e) {
    console.warn("cancelMealNotificationForDate error", e);
  }
  return false;
}

/**
 * Ensure a notification exists for meal/date if userHasLogged === false.
 * If userHasLogged === true, cancel any existing scheduled notification for that meal/date.
 */
export async function ensureMealNotificationState(
  meal: "breakfast" | "lunch" | "dinner",
  date: Date,
  hour: number,
  minute: number,
  userHasLogged: boolean,
  title?: string,
  body?: string
) {
  if (userHasLogged) {
    await cancelMealNotificationForDate(meal, date);
    return null;
  }
  // schedule only if none exists
  const key = dateKey(date, meal);
  const existing = await AsyncStorage.getItem(key);
  if (existing) return existing;
  return scheduleMealNotificationForDate(
    meal,
    date,
    hour,
    minute,
    title ?? `${meal} reminder`,
    body ?? `You haven't logged ${meal} yet`
  );
}

// ...existing code...
/**
 * Schedule one-shot reminders for the next `days` days (including today).
 * Uses scheduleMealNotificationForDate and returns array of created ids (null entries may appear).
 */
export async function scheduleNextNDaysReminders(
  meal: "breakfast" | "lunch" | "dinner",
  days = 7,
  hour = 8,
  minute = 0,
  title?: string,
  body?: string
) {
  const today = new Date();
  const ids: (string | null)[] = [];
  for (let i = 0; i < days; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    // scheduleMealNotificationForDate will skip past times for today (returns null)
    // we attempt scheduling for each day and collect ids (or null)
    const scheduledId = await scheduleMealNotificationForDate(
      meal,
      d,
      hour,
      minute,
      title ?? `${meal} reminder`,
      body ?? `You haven't logged ${meal} yet`
    );
    ids.push(scheduledId);
  }
  return ids;
}

/**
 * Maintain a rolling window of scheduled one-shot notifications for `meal`.
 * Ensures at least `minDays` are scheduled ahead and never schedules more than `maxDays`.
 * - minDays minimal future scheduled notifications (default 3)
 * - maxDays maximal window size (default 7)
 * If existing scheduled count < minDays, schedules additional future days (up to maxDays).
 * Returns an object with counts and newly created ids.
 */
export async function ensureRollingScheduledReminders(
  meal: "breakfast" | "lunch" | "dinner",
  hour = 8,
  minute = 0,
  minDays = 3,
  maxDays = 7,
  title?: string,
  body?: string
) {
  // clamp sensible bounds
  const minD = Math.max(1, Math.min(minDays, maxDays));
  const maxD = Math.max(minD, maxDays);

  const today = new Date();
  const existing: { date: Date; id: string }[] = [];
  const missingDates: Date[] = [];

  // check next maxD days for existing scheduled ids
  for (let i = 0; i < maxD; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const k = dateKey(d, meal);
    const storedId = await AsyncStorage.getItem(k);
    if (storedId) {
      existing.push({ date: d, id: storedId });
    } else {
      missingDates.push(d);
    }
  }

  const existingCount = existing.length;
  const needToCreate = Math.max(0, minD - existingCount);
  const createdIds: (string | null)[] = [];

  if (needToCreate > 0) {
    // schedule missingDates in chronological order until needToCreate satisfied
    for (
      let i = 0;
      i < missingDates.length && createdIds.length < needToCreate;
      i++
    ) {
      const d = missingDates[i];
      const id = await scheduleMealNotificationForDate(
        meal,
        d,
        hour,
        minute,
        title ?? `${meal} reminder`,
        body ?? `You haven't logged ${meal} yet`
      );
      if (id) createdIds.push(id);
    }
  }

  return {
    existingCount,
    createdCount: createdIds.length,
    createdIds,
  };
}
