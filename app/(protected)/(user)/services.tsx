import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { Center } from '@/components/ui/center';

export default function ServicesScreen() {
  return (
    <Box className="flex-1 bg-background-100">
      <Center className="flex-1 p-4">
        <Text className="text-xl font-bold mb-2">Services</Text>
        <Text className="text-gray-500 text-center">
          Please check the "Visits" tab and select "Tags" to view the service
          data table.
        </Text>
      </Center>
    </Box>
  );
}
