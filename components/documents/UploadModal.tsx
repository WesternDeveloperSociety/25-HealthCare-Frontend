import React, { useState } from 'react';
import { Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { 
  Actionsheet, 
  ActionsheetBackdrop, 
  ActionsheetContent, 
  ActionsheetDragIndicator, 
  ActionsheetDragIndicatorWrapper,
  ActionsheetItem,
  ActionsheetItemText
} from '../ui/actionsheet';
import { VStack } from '../ui/vstack';
import { HStack } from '../ui/hstack';
import { Text } from '../ui/text';
import { Button, ButtonText } from '../ui/button';
import { 
  AlertDialog, 
  AlertDialogBackdrop,
  AlertDialogContent, 
  AlertDialogHeader, 
  AlertDialogBody, 
  AlertDialogFooter 
} from '../ui/alert-dialog';
import { Camera, Images, FileText, AlertCircle } from 'lucide-react-native';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFileSelected?: (file: { uri: string; name: string; type: string }) => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onFileSelected,
}) => {
  const [permissionAlert, setPermissionAlert] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'camera' | 'gallery' | null;
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: null,
  });

  // Permission check utility with custom Gluestack Alert dialogs
  const requestPermissions = async (type: 'camera' | 'gallery'): Promise<boolean> => {
    try {
      let permission;
      
      if (type === 'camera') {
        permission = await ImagePicker.requestCameraPermissionsAsync();
      } else {
        permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      }

      if (!permission.granted) {
        // Show custom Gluestack Alert dialog for denied access
        const permissionType = type === 'camera' ? 'Camera' : 'Photo Library';
        setPermissionAlert({
          isOpen: true,
          title: 'Permission Required',
          message: `${permissionType} access is required to upload ${type === 'camera' ? 'photos' : 'images'}. Please enable this permission in your device settings.`,
          type,
        });
        return false;
      }
      return true;
    } catch (error) {
      setPermissionAlert({
        isOpen: true,
        title: 'Permission Error',
        message: 'Failed to request permissions. Please try again.',
        type: null,
      });
      return false;
    }
  };

  // Handle camera capture
  const handleTakePhoto = async () => {
    onClose();
    
    const hasPermission = await requestPermissions('camera');
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        onFileSelected?.({
          uri: asset.uri,
          name: `photo_${Date.now()}.jpg`,
          type: asset.type || 'image/jpeg',
        });
      }
    } catch (error) {
      setPermissionAlert({
        isOpen: true,
        title: 'Camera Error',
        message: 'Failed to take photo. Please try again.',
        type: null,
      });
    }
  };

  // Handle gallery selection
  const handleChooseFromGallery = async () => {
    onClose();
    
    const hasPermission = await requestPermissions('gallery');
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        onFileSelected?.({
          uri: asset.uri,
          name: asset.fileName || `image_${Date.now()}.jpg`,
          type: asset.type || 'image/jpeg',
        });
      }
    } catch (error) {
      setPermissionAlert({
        isOpen: true,
        title: 'Gallery Error',
        message: 'Failed to select image from gallery. Please try again.',
        type: null,
      });
    }
  };

  // Handle document file upload (PDF, DOC, DOCX, etc.)
  const handleUploadDocument = async () => {
    onClose();

    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          'application/pdf', // .pdf
          'application/msword', // .doc
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
          'application/vnd.ms-powerpoint', // .ppt
          'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .pptx
          'application/vnd.ms-excel', // .xls
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
          'text/plain', // .txt
        ],
        copyToCacheDirectory: true, // give app access to selected file 
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        onFileSelected?.({
          uri: asset.uri,
          name: asset.name,
          type: asset.mimeType || 'application/octet-stream',
        });
      }
    } catch (error) {
      console.error('Document picker error:', error);
      setPermissionAlert({
        isOpen: true,
        title: 'File Error',
        message: 'Failed to select document. Please try again.',
        type: null,
      });
    }
  }

  const closePermissionAlert = () => {
    setPermissionAlert({
      isOpen: false,
      title: '',
      message: '',
      type: null,
    });
  };

  return (
    <>
      <Actionsheet isOpen={isOpen} onClose={onClose}>
        <ActionsheetBackdrop />
        <ActionsheetContent>
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator />
          </ActionsheetDragIndicatorWrapper>

          <VStack className="w-full p-4" space="lg">
            {/* Header */}
            <VStack className="items-center" space="sm">
              <Text className="text-xl font-semibold text-typography-900">
                Upload Document
              </Text>
              <Text className="text-sm text-typography-600 text-center">
                Choose how you'd like to add your document
              </Text>
            </VStack>

            {/* Options */}
            <VStack space="xs">
              {/* Take Photo Option */}
              <ActionsheetItem onPress={handleTakePhoto}>
                <HStack className="items-center w-full" space="md">
                  <Camera size={24} color="#374151" />
                  <VStack className="flex-1">
                    <ActionsheetItemText className="font-medium">
                      Take Photo
                    </ActionsheetItemText>
                    <Text className="text-sm text-typography-600">
                      Capture a new photo with your camera
                    </Text>
                  </VStack>
                </HStack>
              </ActionsheetItem>

              {/* Choose from Gallery Option */}
              <ActionsheetItem onPress={handleChooseFromGallery}>
                <HStack className="items-center w-full" space="md">
                  <Images size={24} color="#374151" />
                  <VStack className="flex-1">
                    <ActionsheetItemText className="font-medium">
                      Choose from Gallery
                    </ActionsheetItemText>
                    <Text className="text-sm text-typography-600">
                      Select an existing photo from your gallery
                    </Text>
                  </VStack>
                </HStack>
              </ActionsheetItem>

              {/* Upload Document File Option */}
              <ActionsheetItem onPress={handleUploadDocument}>
                <HStack className="items-center w-full" space="md">
                  <FileText size={24} color="#374151" />
                  <VStack className="flex-1">
                    <ActionsheetItemText className="font-medium">
                      Upload Document File
                    </ActionsheetItemText>
                    <Text className="text-sm text-typography-600">
                      Select a document (PDF, DOC, DOCX, etc.) from your files
                    </Text>
                  </VStack>
                </HStack>
              </ActionsheetItem>
            </VStack>

            {/* Cancel Button */}
            <Button variant="outline" onPress={onClose} className="w-full mt-4">
              <ButtonText>Cancel</ButtonText>
            </Button>
          </VStack>
        </ActionsheetContent>
      </Actionsheet>

      {/* Permission Alert Dialog */}
      <AlertDialog isOpen={permissionAlert.isOpen} onClose={closePermissionAlert}>
        <AlertDialogBackdrop />
        <AlertDialogContent>
          <AlertDialogHeader>
            <HStack space="sm" className="items-center">
              <AlertCircle size={20} color="#EF4444" />
              <Text className="font-semibold">{permissionAlert.title}</Text>
            </HStack>
          </AlertDialogHeader>
          <AlertDialogBody>
            <Text>{permissionAlert.message}</Text>
          </AlertDialogBody>
          <AlertDialogFooter>
            <HStack space="sm" className="justify-end">
              <Button variant="outline" onPress={closePermissionAlert}>
                <ButtonText>OK</ButtonText>
              </Button>
              {Platform.OS === 'ios' && (
                <Button onPress={() => {
                  closePermissionAlert();// On iOS, we could potentially open settings, but it's complex
                }}>
                  <ButtonText>Settings</ButtonText>
                </Button>
              )}
            </HStack>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};