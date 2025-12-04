// app/(tabs)/(tabs)/map.tsx
// Mapbox clinic locator with user location and custom markers

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import Mapbox from '@rnmapbox/maps';
import * as Location from 'expo-location';

// Configure Mapbox access token
Mapbox.setAccessToken(
  'pk.eyJ1IjoiaGFybGVlbm1vbmRlciIsImEiOiJjbWlxcDAwbzcwZHAzM2hweXF3dHNzZ2p1In0.wCh41lgrzaEft3EBEWbNKA'
);

// Mock clinic data
const mockClinics = [
  {
    id: 'clinic-1',
    name: 'Bay Area Medical Center',
    address: '123 Market St, San Francisco, CA 94102',
    specialty: 'General Practice',
    coordinates: [-122.4194, 37.7749],
    phone: '(415) 555-0123',
    hours: 'Mon-Fri 8AM-6PM',
  },
  {
    id: 'clinic-2',
    name: 'Downtown Health Clinic',
    address: '456 Mission St, San Francisco, CA 94105',
    specialty: 'Urgent Care',
    coordinates: [-122.3988, 37.7897],
    phone: '(415) 555-0456',
    hours: 'Daily 7AM-10PM',
  },
  {
    id: 'clinic-3',
    name: 'Pacific Heights Medical',
    address: '789 California St, San Francisco, CA 94108',
    specialty: 'Cardiology',
    coordinates: [-122.4145, 37.7919],
    phone: '(415) 555-0789',
    hours: 'Mon-Fri 9AM-5PM',
  },
  {
    id: 'clinic-4',
    name: 'Marina District Clinic',
    address: '321 Chestnut St, San Francisco, CA 94123',
    specialty: 'Pediatrics',
    coordinates: [-122.4392, 37.8014],
    phone: '(415) 555-1011',
    hours: 'Mon-Sat 8AM-7PM',
  },
  {
    id: 'clinic-5',
    name: 'SOMA Medical Group',
    address: '654 Folsom St, San Francisco, CA 94107',
    specialty: 'Internal Medicine',
    coordinates: [-122.3989, 37.7819],
    phone: '(415) 555-1213',
    hours: 'Mon-Fri 8AM-6PM',
  },
  {
    id: 'clinic-6',
    name: 'Nob Hill Family Practice',
    address: '987 Powell St, San Francisco, CA 94108',
    specialty: 'Family Medicine',
    coordinates: [-122.4092, 37.7938],
    phone: '(415) 555-1415',
    hours: 'Mon-Fri 9AM-5PM',
  },
  {
    id: 'clinic-7',
    name: 'Richmond District Health',
    address: '147 Clement St, San Francisco, CA 94118',
    specialty: 'General Practice',
    coordinates: [-122.4668, 37.7829],
    phone: '(415) 555-1617',
    hours: 'Mon-Sat 8AM-8PM',
  },
  {
    id: 'clinic-8',
    name: 'Mission Bay Urgent Care',
    address: '258 Third St, San Francisco, CA 94107',
    specialty: 'Urgent Care',
    coordinates: [-122.3893, 37.7742],
    phone: '(415) 555-1819',
    hours: 'Daily 24 Hours',
  },
];

export default function MapScreen() {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    null
  );
  const [selectedClinic, setSelectedClinic] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(13);
  const cameraRef = useRef<any>(null);

  // Get user's current location
  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== 'granted') {
          Alert.alert(
            'Location Permission',
            'Please enable location services to see nearby clinics'
          );
          setUserLocation([-122.4194, 37.7749]);
          setLoading(false);
          return;
        }

        let location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

        setUserLocation([location.coords.longitude, location.coords.latitude]);
        setLoading(false);
      } catch (error) {
        console.error('Location error:', error);
        setUserLocation([-122.4194, 37.7749]);
        setLoading(false);
      }
    })();
  }, []);

  const handleZoomIn = () => {
    if (zoomLevel < 18) {
      const newZoom = zoomLevel + 1;
      setZoomLevel(newZoom);
      cameraRef.current?.setCamera({
        zoomLevel: newZoom,
        animationDuration: 300,
      });
    }
  };

  const handleZoomOut = () => {
    if (zoomLevel > 10) {
      const newZoom = zoomLevel - 1;
      setZoomLevel(newZoom);
      cameraRef.current?.setCamera({
        zoomLevel: newZoom,
        animationDuration: 300,
      });
    }
  };

  const handleRecenter = () => {
    if (userLocation) {
      cameraRef.current?.setCamera({
        centerCoordinate: userLocation,
        zoomLevel: 13,
        animationDuration: 1000,
      });
      setZoomLevel(13);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color="#2563EB" />
        <Text className="mt-4 text-gray-600">Getting your location...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1">
      <Mapbox.MapView
        style={styles.map}
        styleURL={Mapbox.StyleURL.Street}
        zoomEnabled={true}
        scrollEnabled={true}
        pitchEnabled={false}
        rotateEnabled={false}
      >
        {userLocation && (
          <Mapbox.Camera
            ref={cameraRef}
            zoomLevel={13}
            centerCoordinate={userLocation}
            animationMode="flyTo"
            animationDuration={1000}
          />
        )}

        {userLocation && <Mapbox.UserLocation visible={true} />}

        {/* Clinic Markers using MarkerView (renders actual React components) */}
        {mockClinics.map((clinic) => (
          <Mapbox.MarkerView
            key={clinic.id}
            id={clinic.id}
            coordinate={clinic.coordinates as [number, number]}
          >
            <TouchableOpacity
              onPress={() => setSelectedClinic(clinic)}
              className="items-center"
            >
              {/* Custom Marker Design */}
              <View className="bg-blue-600 w-10 h-10 rounded-full items-center justify-center border-2 border-white shadow-lg">
                <Text className="text-white text-lg font-bold">+</Text>
              </View>
              {/* Small triangle pointer */}
              <View
                style={{
                  width: 0,
                  height: 0,
                  backgroundColor: 'transparent',
                  borderStyle: 'solid',
                  borderLeftWidth: 6,
                  borderRightWidth: 6,
                  borderTopWidth: 8,
                  borderLeftColor: 'transparent',
                  borderRightColor: 'transparent',
                  borderTopColor: '#2563EB',
                  marginTop: -1,
                }}
              />
            </TouchableOpacity>
          </Mapbox.MarkerView>
        ))}
      </Mapbox.MapView>

      {/* Header */}
      <View className="absolute top-0 left-0 right-0 bg-white shadow-md">
        <View className="pt-14 pb-4 px-4">
          <Text className="text-2xl font-bold text-gray-900">
            Nearby Clinics
          </Text>
          <Text className="text-sm text-gray-600 mt-1">
            {mockClinics.length} clinics found near you
          </Text>
        </View>
      </View>

      {/* Map Controls */}
      <View className="absolute top-32 right-4 gap-2">
        <TouchableOpacity
          className="bg-white w-12 h-12 rounded-lg shadow-lg items-center justify-center border border-gray-200"
          onPress={handleZoomIn}
        >
          <Text className="text-gray-700 text-2xl font-bold">+</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-white w-12 h-12 rounded-lg shadow-lg items-center justify-center border border-gray-200"
          onPress={handleZoomOut}
        >
          <Text className="text-gray-700 text-2xl font-bold">−</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-white w-12 h-12 rounded-lg shadow-lg items-center justify-center border border-gray-200"
          onPress={handleRecenter}
        >
          <Text className="text-blue-600 text-xl">⌖</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Card - Custom Styled Callout */}
      {selectedClinic && (
        <View className="absolute bottom-4 left-4 right-4 bg-white rounded-2xl shadow-2xl p-4 border border-gray-100">
          {/* Close button moved to LEFT */}
          <TouchableOpacity
            className="absolute top-2 left-2 bg-gray-100 w-8 h-8 rounded-full items-center justify-center z-10"
            onPress={() => setSelectedClinic(null)}
          >
            <Text className="text-gray-600 font-bold">✕</Text>
          </TouchableOpacity>

          {/* Added pl-10 to avoid X button overlap */}
          <View className="flex-row items-start mb-2 pl-10">
            <View className="flex-1">
              <Text className="text-lg font-bold text-gray-900">
                {selectedClinic.name}
              </Text>
              <Text className="text-sm text-gray-600 mt-1">
                {selectedClinic.specialty}
              </Text>
            </View>
            <View className="bg-blue-100 px-3 py-1 rounded-full">
              <Text className="text-blue-600 font-semibold text-xs">
                Open Now
              </Text>
            </View>
          </View>

          <View className="mb-3 space-y-1">
            <Text className="text-sm text-gray-600">
              📍 {selectedClinic.address}
            </Text>
            <Text className="text-sm text-gray-600">
              📞 {selectedClinic.phone}
            </Text>
            <Text className="text-sm text-gray-600">
              🕒 {selectedClinic.hours}
            </Text>
          </View>

          <View className="flex-row gap-2">
            <TouchableOpacity className="flex-1 bg-blue-600 py-3 rounded-lg shadow-sm">
              <Text className="text-white font-semibold text-center">
                Get Directions
              </Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-1 bg-gray-100 py-3 rounded-lg shadow-sm">
              <Text className="text-gray-700 font-semibold text-center">
                Call Now
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
});
