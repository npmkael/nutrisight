import { CameraTabButton } from "@/components/CameraTabButton";
import { HapticTab } from "@/components/HapticTab";
import { icons } from "@/constants";
import { Tabs } from "expo-router";
import { memo } from "react";
import { Image } from "react-native";

const TabIcon = ({
  iconFill,
  iconOutline,
  focused,
  className,
}: {
  iconFill: any;
  iconOutline: any;
  focused: boolean;
  className?: string;
}) => {
  return (
    <Image
      source={focused ? iconFill : iconOutline}
      className={className}
      resizeMode="contain"
    />
  );
};

function Layout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#000",
        tabBarInactiveTintColor: "#898989",
        tabBarStyle: {
          height: 80,
          borderWidth: 1,
          borderColor: "rgba(0, 0, 0, 0.3)",
        },
        animation: "fade",
        tabBarButton: HapticTab,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarLabel: "Home",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon
              iconFill={icons.homeFill}
              iconOutline={icons.homeOutline}
              focused={focused}
              className="w-6 h-6"
            />
          ),
          tabBarLabelStyle: {
            fontSize: 12,
          },
        }}
      />
      <Tabs.Screen
        name="meals"
        options={{
          tabBarLabel: "Meal",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon
              iconFill={icons.forkFill}
              iconOutline={icons.forkOutline}
              focused={focused}
              className="w-7 h-7"
            />
          ),
          tabBarLabelStyle: {
            fontSize: 12,
          },
        }}
      />
      {/* Custom Tab */}
      <Tabs.Screen
        name="camera"
        options={{
          tabBarButton: CameraTabButton,
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          tabBarLabel: "Progress",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon
              iconFill={icons.progressFill}
              iconOutline={icons.progressOutline}
              focused={focused}
              className="w-7 h-7"
            />
          ),
          tabBarLabelStyle: {
            fontSize: 12,
          },
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          tabBarLabel: "Settings",
          tabBarIcon: ({ focused }) => (
            <TabIcon
              iconFill={icons.settingsFill}
              iconOutline={icons.settingsOutline}
              focused={focused}
              className="w-7 h-7"
            />
          ),
          tabBarLabelStyle: {
            fontSize: 12,
          },
        }}
      />
    </Tabs>
  );
}

export default memo(Layout);
