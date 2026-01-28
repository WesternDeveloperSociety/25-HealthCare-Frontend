import EditScreenInfo from '@/components/EditScreenInfo';
import { Center } from '@/components/ui/center';
import { Divider } from '@/components/ui/divider';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';

export default function Appointments() {
  return (
    <Center className="flex-1 pb-32">
      <Heading className="font-bold text-2xl">Appointments</Heading>
      <Divider className="my-[30px] w-[80%]" />
      <Text className="p-4">View and manage your appointments here.</Text>
      <EditScreenInfo path="app/(doctor)/appointments.tsx" />
    </Center>
  );
}
