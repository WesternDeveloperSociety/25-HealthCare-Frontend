'use client';
import React from 'react';
import { View } from '@/components/ui/view';
import { Text } from '@/components/ui/text';
import { Pressable } from '@/components/ui/pressable';

type Props = {
  tags: string[];
  value: string[];
  onChange: (cfg: { tags: string[] }) => void;
};

export default function FilterPanel({
  tags = [],
  value = [],
  onChange,
}: Props) {
  const toggleTag = (tag: string) => {
    const next = value.includes(tag)
      ? value.filter((t) => t !== tag)
      : [...value, tag];
    onChange({ tags: next });
  };

  const clear = () => onChange({ tags: [] });

  return (
    <View
      style={{
        gap: 10,
        backgroundColor: '#ffffff',
        padding: 12,
        borderRadius: 8,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          gap: 10,
          flexWrap: 'wrap',
          paddingBottom: 6,
        }}
      >
        {tags.map((tag) => {
          const active = value.includes(tag);
          return (
            <Pressable
              key={tag}
              onPress={() => toggleTag(tag)}
              style={{
                paddingVertical: 8,
                paddingHorizontal: 14,
                borderRadius: 20,
                borderWidth: 1,
                borderColor: active ? '#3B82F6' : '#E5E7EB',
                backgroundColor: active ? '#3B82F6' : '#F8FAFC',
                shadowColor: active ? 'rgba(59,130,246,0.12)' : 'transparent',
              }}
            >
              <Text
                style={{
                  color: active ? '#ffffff' : '#0F172A',
                  fontWeight: active ? '600' : '500',
                }}
              >
                {tag}
              </Text>
            </Pressable>
          );
        })}
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text style={{ fontSize: 13, color: '#374151' }}>
          Selected: {value.join(', ') || 'None'}
        </Text>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
        {value && value.length > 0 && (
          <Pressable
            onPress={clear}
            style={{ paddingVertical: 6, paddingHorizontal: 8 }}
          >
            <Text style={{ color: '#2563EB', fontWeight: '700' }}>Clear</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}
