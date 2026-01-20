// app/(doctor)/dashboard.tsx
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';

export default function DoctorDashboard() {
  return (
    <Box className="flex-1 justify-center items-center bg-background-100">
      <Text className="text-3xl font-bold">Doctor Dashboard</Text>
    </Box>
  );
}
