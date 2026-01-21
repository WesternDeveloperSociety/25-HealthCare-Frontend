import { Center } from '@/components/ui/center';
import { Divider } from '@/components/ui/divider';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { DocumentUploadExample } from '@/components/documents/DocumentUploadExample';

export default function Upload() {
  return (
    <Center className="flex-1 pb-32">
      <Heading className="font-bold text-2xl">Upload</Heading>
      <Divider className="my-[30px] w-[80%]" />
      <Text className="p-4">Upload your documents using the component below.</Text>
      
      {/* Document Upload Component */}
      <DocumentUploadExample />
    </Center>
  );
}
