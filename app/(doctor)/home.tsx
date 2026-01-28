import EditScreenInfo from '@/components/EditScreenInfo';
import { Center } from '@/components/ui/center';
import { Divider } from '@/components/ui/divider';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';

export default function Home() {
  return (
    <Center className="flex-1 pb-32">
      <Heading className="font-bold text-2xl">Doctor Dashboard</Heading>
      <Divider className="my-[30px] w-[80%]" />
      <Text className="p-4">Welcome to the Doctor portal!</Text>
      <EditScreenInfo path="app/(doctor)/home.tsx" />
    </Center>
  );
}
