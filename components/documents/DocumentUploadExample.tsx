import React, { useState } from 'react';
import { Button, ButtonText } from '@/components/ui/button';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { UploadModal } from './UploadModal';

// Example usage component for UploadModal
export const DocumentUploadExample: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState<{
        uri: string;
        name: string;
        type: string;
    } | null>(null);

    const handleFileSelected = (file: {
        uri: string;
        name: string;
        type: string;
    }) => {
        setSelectedFile(file);

        // Here you would typically upload the file to your backend
        console.log('Selected file:', file);

        // TODO: Call your upload mutation here
        // uploadMutation.mutate(formData);
    };

    const openUploadModal = () => {
        setIsModalOpen(true);
    };

    const closeUploadModal = () => {
        setIsModalOpen(false);
    };

    return (
        <VStack space="md" className="p-4">
            <Button onPress={openUploadModal}>
                <ButtonText>Upload Document</ButtonText>
            </Button>

            {selectedFile && (
                <VStack space="sm" className="p-3 bg-background-50 rounded-md">
                    <Text className="font-medium">Selected File:</Text>
                    <Text className="text-sm text-typography-600">
                        Name: {selectedFile.name}
                    </Text>
                    <Text className="text-sm text-typography-600">
                        Type: {selectedFile.type}
                    </Text>
                    <Text className="text-sm text-typography-600">
                        URI: {selectedFile.uri}
                    </Text>
                </VStack>
            )}

            <UploadModal
                isOpen={isModalOpen}
                onClose={closeUploadModal}
                onFileSelected={handleFileSelected}
            />
        </VStack>
    );
};
