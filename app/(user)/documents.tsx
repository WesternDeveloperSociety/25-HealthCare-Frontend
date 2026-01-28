import EditScreenInfo from '@/components/EditScreenInfo';
import { Center } from '@/components/ui/center';
import { Divider } from '@/components/ui/divider';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';

export default function Documents() {
  return (
    <Center className="flex-1 pb-32">
      <Heading className="font-bold text-2xl">My Documents</Heading>
      <Divider className="my-[30px] w-[80%]" />
      <Text className="p-4">View and upload your medical documents here.</Text>
      <EditScreenInfo path="app/(user)/documents.tsx" />
    </Center>
  );
}
