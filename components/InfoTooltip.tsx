import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Dimensions,
  Modal,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Typo from "./Typo";

interface InfoTooltipProps {
  title: string;
  content: string;
  size?: number;
  color?: string;
}

export default function InfoTooltip({
  title,
  content,
  size = 20,
  color = "#007AFF",
}: InfoTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const { width } = Dimensions.get("window");

  const showTooltip = () => {
    setIsVisible(true);
  };

  const hideTooltip = () => {
    setIsVisible(false);
  };

  return (
    <>
      <TouchableOpacity onPress={showTooltip} activeOpacity={0.7}>
        <Ionicons name="information-circle-outline" size={size} color={color} />
      </TouchableOpacity>

      <Modal
        visible={isVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={hideTooltip}
      >
        <TouchableWithoutFeedback onPress={hideTooltip}>
          <View className="flex-1 bg-black/50 justify-center items-center px-6">
            <TouchableWithoutFeedback>
              <View
                className="bg-white rounded-2xl p-6 shadow-xl max-w-full"
                style={{ width: width * 0.85, maxWidth: 400 }}
              >
                {/* Header */}
                <View className="flex-row justify-between items-center mb-4">
                  <Typo size={18} className="font-PoppinsSemiBold flex-1 pr-2">
                    {title}
                  </Typo>
                  <TouchableOpacity
                    onPress={hideTooltip}
                    className="p-1"
                    activeOpacity={0.7}
                  >
                    <Ionicons name="close" size={24} color="#666" />
                  </TouchableOpacity>
                </View>

                {/* Content */}
                <View className="mb-6">
                  <Text className="text-gray-700 font-Poppins text-base leading-6">
                    {content}
                  </Text>
                </View>

                {/* Close Button */}
                <TouchableOpacity
                  onPress={hideTooltip}
                  className="bg-primary rounded-xl py-3 px-6 items-center"
                  activeOpacity={0.8}
                >
                  <Text className="text-white font-PoppinsSemiBold text-base">
                    Got it!
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
}
