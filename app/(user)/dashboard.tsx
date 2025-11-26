// app/(user)/dashboard.tsx
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";

export default function UserDashboard() {
  return (
    <Box className="flex-1 justify-center items-center bg-background-100">
      <Text className="text-3xl font-bold">User Dashboard</Text>
    </Box>
  );
}
