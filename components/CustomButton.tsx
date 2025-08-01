import { ButtonProps } from "@/types/type";
import { Text, TouchableOpacity } from "react-native";
import Loading from "./Loading";

// Utility function
const getBgVariant = (variant: ButtonProps["bgVariant"]) => {
  switch (variant) {
    case "secondary":
      return "bg-gray-500";
    case "danger":
      return "bg-red-500";
    case "success":
      return "bg-green-500";
    case "outline":
      return "bg-transparent border-neutral-300 border-[0.5px]";
    default:
      return "bg-[#2D3644]";
  }
};

const getTextVariantStyle = (variant: ButtonProps["textVariant"]) => {
  switch (variant) {
    case "primary":
      return "text-black";
    case "secondary":
      return "text-gray-100";
    case "danger":
      return "text-red-100";
    case "success":
      return "text-green-100";
    default:
      return "text-white";
  }
};

const CustomButton = ({
  onPress,
  title,
  bgVariant = "primary",
  textVariant = "default",
  IconLeft,
  IconRight,
  className,
  loading = false,
  ...props
}: ButtonProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={loading}
      className={`w-full rounded-full p-4 flex-row justify-center items-center shadow-md shadow-neutral-400/70 ${loading ? "opacity-70" : ""} ${getBgVariant(
        bgVariant
      )} ${className}`}
      {...props}
    >
      {loading ? (
        <Loading size="small" />
      ) : (
        <>
          {IconLeft && <IconLeft />}
          <Text
            className={`text-lg font-PoppinsSemiBold ${getTextVariantStyle(textVariant)}`}
          >
            {title}
          </Text>
          {IconRight && <IconRight />}
        </>
      )}
    </TouchableOpacity>
  );
};
export default CustomButton;
