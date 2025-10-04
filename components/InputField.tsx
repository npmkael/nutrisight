import { InputFieldProps } from "@/types/type";
import { Eye, EyeOff } from "lucide-react-native";
import { memo, useState } from "react";
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

const InputField = ({
  label,
  labelStyle,
  icon,
  secureTextEntry = false,
  containerStyle,
  inputStyle,
  iconStyle,
  className,
  ...props
}: InputFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="my-2 w-full">
          <Text className={`text-lg font-PoppinsSemiBold mb-3 ${labelStyle}`}>
            {label}
          </Text>
          <View
            className={`flex flex-row justify-start items-center relative bg-neutral-100 rounded-lg border border-neutral-100 focus:border-primary-500 ${containerStyle}`}
          >
            {icon && (
              <Image source={icon} className={`w-6 h-6 ml-4 ${iconStyle}`} />
            )}
            <TextInput
              className={`rounded-lg p-4 font-Poppins text-[15px] flex-1 ${inputStyle} text-left text-black`}
              secureTextEntry={secureTextEntry && !showPassword}
              {...props}
              placeholderTextColor="#a0a0a0"
            />
            {secureTextEntry && (
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                className="pr-4"
              >
                {showPassword ? (
                  <Eye size={22} color="#a0a0a0" />
                ) : (
                  <EyeOff size={22} color="#a0a0a0" />
                )}
              </TouchableOpacity>
            )}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default memo(InputField);
