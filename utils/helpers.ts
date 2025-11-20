import { ScanResultType } from "@/app/(root)/main-camera";
import { LoggedWeight } from "@/context/AuthContext";
import { MealEntry } from "./types";

export function scanForAllergen(
  userAllergens: string[],
  ingredients: string
): string[] {
  if (!userAllergens.length || !ingredients) return []; // early return if no allergens or ingredients

  // normalize ingredients string
  // lowercase
  // replace hyphens with spaces
  // replace punctuation and extra whitespace with single spaces
  const normalizedIngredients = ingredients
    .toLowerCase()
    .replace(/-/g, " ")
    .replace(/[\s,():.]+/g, " ");

  // create Set for (O)1 lookup performance
  const ingredientsSet = new Set(
    normalizedIngredients.split(" ").filter(Boolean)
  );

  const allergensDetected: string[] = [];

  // check each allergen against the normalized ingredients
  for (const allergen of userAllergens) {
    // normalize allergen
    // lowercase and replace hyphens with spaces
    const allergenNormalized = allergen.toLowerCase().replace(/-/g, " ");

    // check for phrase match (substring) or single-word match (Set)
    if (
      normalizedIngredients.includes(allergenNormalized) || // phrase/substring match
      ingredientsSet.has(allergenNormalized) // single-word match
    ) {
      allergensDetected.push(allergen); // add to detected allergens
    }
  }
  // return detected allergens
  return allergensDetected;
}

export function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function replaceUnderscoreWithSpace(str: string) {
  return str.replace(/_/g, " ");
}

// Chunk into groups of 6 for the slider
export function chunkArray(array: any[], size: number) {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}

// Example usage:
// const date = new Date("1995-12-25");
// const formatted = formatDateToMMDDYYYY(date); // "12-25-1995"
export function formatDateToMMDDYYYY(date: Date): string {
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const yyyy = date.getFullYear();
  return `${mm}-${dd}-${yyyy}`;
}

// const date = parseMMDDYYYYToDate("12-25-1995"); // Date object for December 25, 1995
export function parseMMDDYYYYToDate(dateStr: string): Date | null {
  // Expects dateStr in "MM-DD-YYYY" format
  const [mm, dd, yyyy] = dateStr.split("-");
  if (!mm || !dd || !yyyy) return null;
  // Note: Months are 0-based in JS Date
  return new Date(Number(yyyy), Number(mm) - 1, Number(dd));
}

export function getAgeFromDOB(dob: Date): number {
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return age;
}

export function cmToFeetAndInches(cm: number) {
  const totalInches = cm / 2.54;
  const feet = Math.floor(totalInches / 12);
  const inches = +(totalInches % 12).toFixed(2);
  return { feet, inches };
}

// Convert lbs to kg
export function lbsToKg(lbs: number) {
  return +(lbs * 0.45359237).toFixed(2);
}

export function removeDuplicateTriggeredAllergens(
  triggeredAllergens: { allergen: string; ingredient: string }[]
) {
  const seen = new Set<string>();
  const unique: string[] = [];
  for (const i of triggeredAllergens) {
    const allergenLower = i.allergen.toLowerCase();
    if (!seen.has(allergenLower)) {
      seen.add(allergenLower);
      unique.push(i.allergen); // keep original casing if you want
    }
  }
  return unique;
}

export function calorieSum(
  mealRecords: (ScanResultType & { quantity: number })[]
) {
  let sum = 0;
  for (const m of mealRecords) {
    const calorieItem = (m.nutritionData || [])
      .flatMap((n) => n.items || [])
      .find((i) => {
        const name = String(i.name ?? "").toLowerCase();
        const unit = String(i.unit ?? "").toLowerCase();
        return (
          name.includes("energy") ||
          name.includes("calorie") ||
          name.includes("kcal") ||
          unit.includes("kcal")
        );
      });

    const value = calorieItem ? Number(calorieItem.value || 0) : 0;
    sum += value * (m.quantity || 1);
  }

  return sum;
}

export const getDateString = (date: Date | string) =>
  new Date(date).toISOString().slice(0, 10);
// "YYYY-MM-DD"

export const processWeeklyData = (
  data: { day_of_week: number; total: number }[]
) => {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  let barData = days.map((label) => ({
    label,
    value: 0,
    frontColor: "#d1d5db",
    gradientColor: "#d1d5db",
  }));

  data.forEach((item) => {
    const dayIndex = item.day_of_week;

    if (dayIndex >= 0 && dayIndex < 7) {
      barData[dayIndex].value = item.total;
      // Update colors based on positive/negative values
      barData[dayIndex].frontColor = item.total >= 0 ? "#10b981" : "#ef4444";
      barData[dayIndex].gradientColor = item.total >= 0 ? "#065f46" : "#991b1b";
    }
  });

  return barData;
};

export interface WeeklyWeightItem {
  day_of_week: number; // 0 = Sunday .. 6 = Saturday
  total: number; // weight in kg (0 if missing)
}

/**
 * Convert loggedWeights -> 7-day array (oldest -> newest).
 * If there are multiple entries for the same date the last one wins.
 */
export function convertLoggedWeightsToWeekly(
  loggedWeights: LoggedWeight[] | undefined,
  days = 7
): WeeklyWeightItem[] {
  const pad = (n: number) => String(n).padStart(2, "0");

  // helpers to produce/parse local YYYY-MM-DD keys (avoid UTC shift)
  const toLocalDateKey = (d: Date) =>
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

  const parseToLocalDate = (s: string) => {
    // accept "YYYY-MM-DD" or full ISO
    const iso = s.split("T")[0];
    const [y, m, d] = iso.split("-").map((x) => Number(x));
    return new Date(y, (m || 1) - 1, d || 1);
  };

  // build map dateKey -> value (last entry wins)
  const map = new Map<string, number>();
  if (Array.isArray(loggedWeights)) {
    for (const entry of loggedWeights) {
      try {
        const dt = parseToLocalDate(entry.date);
        const key = toLocalDateKey(dt);
        map.set(key, Number(entry.value) || 0);
      } catch {
        // ignore malformed dates
      }
    }
  }

  const result: WeeklyWeightItem[] = [];
  const today = new Date();
  // start days-1 days ago up to today
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = toLocalDateKey(d);
    const val = map.has(key) ? map.get(key)! : 0;
    result.push({
      day_of_week: d.getDay(),
      total: val,
    });
  }

  return result;
}

export function getProgress(value: number, total: number) {
  const v = Number(value) || 0;
  const t = Number(total);
  if (!isFinite(t) || t <= 0) return 0; // avoid divide-by-zero / invalid totals
  const pct = (v / t) * 100;
  return Math.max(0, Math.min(100, pct)); // clamp 0..100
}

export function getPartOfDay(
  hour: number
): "morning" | "afternoon" | "evening" {
  // use whole-hour boundaries, normalize input to 0-23
  const h = Math.floor(Number(hour) || 0);
  const hourNorm = ((h % 24) + 24) % 24;

  // 04:00 - 10:59 -> morning (hours 4..10)
  if (hourNorm >= 4 && hourNorm <= 10) return "morning";

  // 11:00 - 18:59 -> afternoon (hours 11..18)
  if (hourNorm >= 11 && hourNorm <= 18) return "afternoon";

  // everything else -> evening (hours 19..23 and 0..3)
  return "evening";
}

export function getCaloriesFromMealEntry(meal?: MealEntry): number {
  if (!meal) return 0;
  if (typeof meal.calorie !== "undefined") return Number(meal.calorie) || 0;

  const categories = meal.nutritionData ?? [];
  for (const cat of categories) {
    const items = cat.items ?? [];
    for (const item of items) {
      const name = String(item.name ?? "").toLowerCase();
      const unit = String(item.unit ?? "").toLowerCase();
      if (
        name.includes("calorie") ||
        name.includes("energy") ||
        name.includes("kcal") ||
        unit.includes("kcal")
      ) {
        const value = item.value ?? item.calorie ?? 0;
        return Number(value) || 0;
      }
    }
  }

  return 0;
}

export function setPrecisionIfNotInteger(num: number, precision = 2) {
  return Number.isInteger(num) ? num : Number(num.toFixed(precision));
}

export function getRandomItems<T>(array: T[], maxItems: number = 3): T[] {
  if (array.length <= maxItems) {
    return array;
  }

  const shuffled = [...array].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, maxItems);
}

export const getMacroValue = (
  macroName: string,
  searchKeys: string[],
  result: ScanResultType | null
) => {
  console.log("Searching for macro:", macroName, "with keys:", searchKeys);
  const macroItem = result?.nutritionData
    .flatMap((category) => category.items)
    .find((item) =>
      searchKeys.some((key) =>
        (item.name as string).toLowerCase().includes(key)
      )
    );

  return macroItem
    ? Number(macroItem.value) % 1 === 0
      ? Number(macroItem.value).toFixed(0)
      : Number(macroItem.value).toFixed(2)
    : "0";
};
