import { Center } from '@/components/ui/center';
import { Divider } from '@/components/ui/divider';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { Box } from '@/components/ui/box';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DocumentUploadExample } from '@/components/documents/DocumentUploadExample';

export default function UploadPage() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f3f4f6' }}>
      <Box className="flex-1 bg-gray-100" style={{ paddingBottom: 110 }}>
        <Center className="flex-1">
          <Heading className="font-bold text-2xl">Upload</Heading>
          <Divider className="my-[30px] w-[80%]" />
          <Text className="p-4 text-center">
            Upload your documents using the component below.
          </Text>

          {/* Document Upload Component */}
          <DocumentUploadExample />
        </Center>
      </Box>
    </SafeAreaView>
  );
}
