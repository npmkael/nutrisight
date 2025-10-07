import { InputFieldProps } from "@/types/type";
import { Eye, EyeOff } from "lucide-react-native";
import { memo, useState } from "react";
import {
    Image,
    Text,
    TextInput,
    TouchableOpacity,
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
  error,
  isValid,
  showValidation = false,
  ...props
}: InputFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);

  // Determine border color based on validation state
  const getBorderColor = () => {
    if (!showValidation) return "border-neutral-100";
    if (error) return "border-red-500";
    return "border-neutral-100";
  };

  return (
    <View className="my-2 w-full">
          <Text className={`text-lg font-PoppinsSemiBold mb-3 ${labelStyle}`}>
            {label}
          </Text>
          <View
            className={`flex flex-row justify-start items-center relative bg-neutral-100 rounded-lg border-2 ${getBorderColor()} ${containerStyle}`}
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
          {/* Always reserve space for error message to prevent layout shift */}
          <View className="h-5 mt-1 ml-1">
            {error && showValidation && (
              <Text className="text-red-500 text-sm font-Poppins">
                {error}
              </Text>
            )}
          </View>
    </View>
  );
};

export default memo(InputField);
