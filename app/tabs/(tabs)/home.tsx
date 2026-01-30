import EditScreenInfo from '@/components/EditScreenInfo';
import { Center } from '@/components/ui/center';
import { Divider } from '@/components/ui/divider';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';

// Temporary: import ChatRoomScreen for quick manual testing
import ChatRoomScreen from '@/app/tabs/(tabs)/ChatRoomScreen';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// create a single QueryClient for this temporary test
const _devQueryClient = new QueryClient();

export default function Home() {
  return (
    //     <Center className="flex-1 pb-32">
    //   <Heading className="font-bold text-2xl">Home</Heading>
    //   <Divider className="my-[30px] w-[80%]" />
    //   <Text className="p-4">Example below to use gluestack-ui components.</Text>
    //   <EditScreenInfo path="app/tabs/(tabs)/home.tsx" />
    // </Center>
    <Center className="flex-1 pb-32">
      <Heading className="font-bold text-2xl">Home — Chat test</Heading>
      <Divider className="my-[20px] w-[80%]" />

      {/* Temporary: render ChatRoomScreen for development testing */}
      <QueryClientProvider client={_devQueryClient}>
        <ChatRoomScreen />
      </QueryClientProvider>

      <Divider className="my-[20px] w-[80%]" />
      <EditScreenInfo path="app/tabs/(tabs)/home.tsx" />
    </Center>
  );
}
