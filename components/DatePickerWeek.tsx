import React, { useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";

interface DatePickerWeekProps {
  onDateChange?: (selectedDate: Date) => void;
  initialDate?: Date;
}

interface DayItem {
  date: Date;
  dayName: string;
  dayNumber: string;
  isToday: boolean;
}

export default function DatePickerWeek({
  onDateChange,
  initialDate,
}: DatePickerWeekProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(
    initialDate || new Date()
  );

  // Generate 7 days starting from current date
  const generateWeekDays = (): DayItem[] => {
    const today = new Date();
    const startDate = new Date(today);
    const days: DayItem[] = [];

    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);

      const dayName = currentDate.toLocaleDateString("en-US", {
        weekday: "short",
      });
      const dayNumber = currentDate.getDate().toString();
      const isToday = currentDate.toDateString() === today.toDateString();

      days.push({
        date: currentDate,
        dayName,
        dayNumber,
        isToday,
      });
    }

    return days;
  };

  const weekDays = generateWeekDays();

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    onDateChange?.(date);
  };

  const renderDayItem = ({ item }: { item: DayItem }) => {
    const isSelected = item.date.toDateString() === selectedDate.toDateString();

    return (
      <TouchableOpacity
        onPress={() => handleDateSelect(item.date)}
        className={`
          flex-col
          px-1 py-2
          items-center justify-center rounded-full w-[40px]
          ${isSelected ? "bg-[#FCA251]" : "bg-transparent"}
        `}
        activeOpacity={0.7}
      >
        <Text
          className={`
            text-sm font-PoppinsMedium mb-1
            ${isSelected ? "text-white" : "text-gray-600"}
          `}
        >
          {item.dayName}
        </Text>
        <View className="flex items-center">
          <Text
            className={`
              text-lg font-PoppinsSemiBold
              ${isSelected ? "text-white" : "text-gray-600"}
            `}
          >
            {item.dayNumber}
          </Text>
          {item.isToday && (
            <View className="w-2 h-2 bg-[#FCA251] rounded-full" />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View className="bg-white py-4 border-b border-gray-200 shadow-sm">
      <FlatList
        data={weekDays}
        renderItem={renderDayItem}
        keyExtractor={(item) => item.date.toISOString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 30,
          justifyContent: "space-between",
          flex: 1,
        }}
        scrollEnabled={false} // Disable scrolling since we only show 7 days
      />
    </View>
  );
}
