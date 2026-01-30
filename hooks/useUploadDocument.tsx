import { useMutation } from '@tanstack/react-query';
import {
    useToast,
    Toast,
    ToastTitle,
    ToastDescription,
} from '@/components/ui/toast';

export function useUploadDocument() {
    const toast = useToast();

    return useMutation({
        mutationFn: async (file: {
            uri: string;
            name: string;
            type: string;
            [key: string]: any;
        }) => {
            const formData = new FormData();
            formData.append('file', {
                uri: file.uri,
                name: file.name,
                type: file.type,
            } as any);
            // Add any extra fields (e.g., appointmentID, title, docType)
            if (file.appointmentID)
                formData.append('appointmentID', file.appointmentID);
            if (file.title) formData.append('title', file.title);
            if (file.docType) formData.append('docType', file.docType);

            // Ensure API_URL is defined or fallback
            const apiUrl = process.env.API_URL || 'http://localhost:3000';
            const response = await fetch(`${apiUrl}/api/documents`, {
                method: 'POST',
                body: formData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (!response.ok) {
                throw new Error('Upload failed');
            }
            return response.json();
        },
        onSuccess: () => {
            toast.show({
                render: ({ id }) => (
                    <Toast nativeID={id} action="success" variant="solid">
                        <ToastTitle>Success</ToastTitle>
                        <ToastDescription>Document uploaded successfully!</ToastDescription>
                    </Toast>
                ),
            });
        },
        onError: (error: any) => {
            toast.show({
                render: ({ id }) => (
                    <Toast nativeID={id} action="error" variant="solid">
                        <ToastTitle>Error</ToastTitle>
                        <ToastDescription>
                            {error.message || 'Upload failed'}
                        </ToastDescription>
                    </Toast>
                ),
            });
        },
    });
}
