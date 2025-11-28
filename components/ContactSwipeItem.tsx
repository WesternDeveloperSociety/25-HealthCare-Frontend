import React, { useRef } from 'react';
import {
  Animated,
  PanResponder,
  ViewStyle,
  StyleSheet,
  LayoutAnimation,
} from 'react-native';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { Pressable } from '@/components/ui/pressable';

type Props = {
  id: string;
  children: React.ReactNode;
  onDelete?: (id: string) => void;
  onArchive?: (id: string) => void;
  onToggleRead?: (id: string) => void;
  unread?: boolean;
};

const ACTION_WIDTH = 140;
const THRESHOLD = 60;

export default function ContactSwipeItem({
  id,
  children,
  onDelete,
  onArchive,
  onToggleRead,
  unread,
}: Props) {
  const translateX = useRef(new Animated.Value(0)).current;
  const rowHeight = useRef(new Animated.Value(1)).current;

  const panResponder = useRef(
    PanResponder.create({
      // allow taps to reach children (like the read indicator); only capture
      // the gesture when a horizontal move is detected
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dx) > 5,
      onPanResponderMove: (_, gesture) => {
        // clamp translate
        const x = gesture.dx;
        if (x > ACTION_WIDTH) return;
        translateX.setValue(x);
      },
      onPanResponderRelease: (_, gesture) => {
        const x = gesture.dx;
        if (x <= -THRESHOLD) {
          // swiped left -> reveal right actions
          Animated.timing(translateX, {
            toValue: -ACTION_WIDTH,
            duration: 200,
            useNativeDriver: true,
          }).start();
        } else if (x >= THRESHOLD) {
          // swiped right -> reveal left action
          Animated.timing(translateX, {
            toValue: ACTION_WIDTH * 0.6,
            duration: 200,
            useNativeDriver: true,
          }).start();
        } else {
          // reset
          Animated.timing(translateX, {
            toValue: 0,
            duration: 150,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  const close = () => {
    Animated.timing(translateX, { toValue: 0, duration: 150, useNativeDriver: true }).start();
  };

  const handleDelete = () => {
    // animate collapse then call onDelete
    Animated.timing(rowHeight, { toValue: 0, duration: 200, useNativeDriver: false }).start(() => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      onDelete?.(id);
    });
  };

  { /* TODO: Archive function */}
  const handleArchive = () => {
    onArchive?.(id);
    close();
  };

  { /* TODO: Read/Unread indicator */}
  const handleToggleRead = () => {
    onToggleRead?.(id);
    close();
  };

  const rowAnimatedStyle: ViewStyle = {
    transform: [{ translateX }],
  };

  const containerHeight = rowHeight.interpolate({ inputRange: [0, 1], outputRange: [0, 96] });

  return (
    <Animated.View style={[{ overflow: 'hidden', height: containerHeight }]}>
      {/* rounded containers for buttons underneath */}
      <Box className="mb-2 relative rounded-lg overflow-hidden">
        {/* Background actions (right) */}
        <Box className="absolute right-0 top-0 bottom-0 flex-row items-center" style={{ width: ACTION_WIDTH }}>
          <Pressable onPress={handleArchive} className="bg-primary-300 flex-1 items-center justify-center h-full">
            <Text className="text-typography-0">Archive</Text>
          </Pressable>
          <Pressable onPress={handleDelete} className="bg-error-500 flex-1 items-center justify-center h-full">
            <Text className="text-typography-0">Delete</Text>
          </Pressable>
        </Box>

        {/* Background action (left) */}
        <Box className="absolute left-0 top-0 bottom-0 flex-row items-center" style={{ width: ACTION_WIDTH * 0.6 }}>
          <Pressable onPress={handleToggleRead} className="bg-typography-700 flex-1 items-center justify-center h-full">
            <Text className="text-typography-0">{unread ? 'Mark Read' : 'Mark Unread'}</Text>
          </Pressable>
        </Box>

        {/* Foreground row (contact to swipe) */}
        <Animated.View
          {...panResponder.panHandlers}
          style={[styles.row, rowAnimatedStyle]}
        >
          <Box className="bg-blue-200 rounded-lg h-[96px] px-6 flex-row items-center w-full overflow-hidden relative">
            {/* Read indicator */}
            <Pressable onPress={handleToggleRead} className="absolute left-0 top-0 bottom-0 w-2" accessibilityLabel="Toggle read status">
              <Box className={`${unread ? 'bg-blue-600' : 'bg-transparent'} h-full rounded-l-lg`} />
            </Pressable>
            {children}
          </Box>
        </Animated.View>
      </Box>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  row: {
    zIndex: 10,
  },
});
