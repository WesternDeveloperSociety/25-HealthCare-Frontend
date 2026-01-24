import { useMutation } from '@tanstack/react-query';
import { Platform } from 'react-native';

interface UploadFile {
  uri: string;
  name: string;
  type: string;
}

export function useUploadDocument() {
  return useMutation({
    mutationFn: async (file: UploadFile) => {
      const formData = new FormData();
      formData.append('file', {
        uri: Platform.OS === 'ios' ? file.uri.replace('file://', '') : file.uri,
        name: file.name,
        type: file.type,
      } as any);

      const res = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL || ''}/documents`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data',
            // Add auth headers if needed
          },
          body: formData,
        }
      );

      if (!res.ok) throw new Error('Upload failed');
      return res.json();
    },
  });
}
