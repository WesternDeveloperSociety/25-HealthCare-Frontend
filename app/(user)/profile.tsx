import EditScreenInfo from '@/components/EditScreenInfo';
import { Center } from '@/components/ui/center';
import { Divider } from '@/components/ui/divider';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';

export default function Profile() {
  return (
    <Center className="flex-1 pb-32">
      <Heading className="font-bold text-2xl">My Profile</Heading>
      <Divider className="my-[30px] w-[80%]" />
      <Text className="p-4">Manage your profile information here.</Text>
      <EditScreenInfo path="app/(user)/profile.tsx" />
    </Center>
  );
}
