import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { Center } from "@/components/ui/center";
import { Text } from "@/components/ui/text";
import { usePathname, router } from "expo-router";
import { Upload, SquareActivity, HeartPlus, Calendar, List } from "lucide-react-native";


export default function CustomNavBar() {
  const pathname = usePathname();

  const tabs: Array<{ name: "upload" | "services" | "home" | "visits" | "profile"; icon: any }> = [
    { name: "upload", icon: Upload },
    { name: "services", icon: SquareActivity },
    { name: "home", icon: HeartPlus },
    { name: "visits", icon: Calendar },
    { name: "profile", icon: List },
  ];

  

  return (
    <Box  style={{ backgroundColor: '#0a7ea4' }} className="absolute bottom-6 left-4 right-4 p-4 rounded-3xl shadow-lg">
      <HStack className="justify-between items-center">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = pathname.includes(tab.name);

          return (
            <Center
              key={tab.name}
              className="flex-1"
              onTouchStart={() => router.push(`/tabs/${tab.name}` as any)}
            >
              <Icon
                size={24}
                color={active ? "#c1bfbfff" : "#ffffffff"}
              />
              {/* Optional label */}
              <Text className={`mt-1 text-xs ${active ? "text-gray-300" : "text-white"}`}>
                {tab.name}
              </Text>
            </Center>
          );
        })}
      </HStack>
    </Box>
  );
}
