"use client";
import React, { useCallback, useMemo, useState } from "react";
import { FlatList } from "./ui/flat-list";
import { View } from "./ui/view";
import { Text } from "./ui/text";
import { Pressable } from "./ui/pressable";
import { Input, InputField } from "./ui/input";
// DatePicker is dynamically imported on native platforms to avoid web render errors
import { Platform, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Button, ButtonText } from './ui/button';
import FilterPanel from './FilterPanel';

type Row = { id: string; name: string; tags: string[]; date?: string; [k: string]: any };

type Props = {
  rows: Row[];
  onRowsChange: (next: Row[]) => void;
  onSortChange?: (key: string, direction: "asc" | "desc") => void;
  availableTags?: string[];
};


export default function EditableTable({ rows, onRowsChange, onSortChange, availableTags }: Props) {
  const [localRows, setLocalRows] = useState<Row[]>(rows || []);

  React.useEffect(() => setLocalRows(rows || []), [rows]);

  const updateCell = useCallback(
    (id: string, key: string, value: any) => {
      const next = localRows.map((r) => (r.id === id ? { ...r, [key]: value } : r));
      setLocalRows(next);
      onRowsChange(next);
    },
    [localRows, onRowsChange]
  );

  const onNameChange = (id: string, v: string) => updateCell(id, "name", v);
  const onTagsChange = (id: string, raw: string) => {
    const parsed = raw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    updateCell(id, "tags", parsed);
  };

  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  // DateCell: clickable date display that opens an editor appropriate for the platform
  const DateCell = ({ id, value }: { id: string; value?: string }) => {
    const [localDate, setLocalDate] = useState<Date>(value ? new Date(value) : new Date());
    const [showModalLocal, setShowModalLocal] = useState(false);

    React.useEffect(() => setLocalDate(value ? new Date(value) : new Date()), [value]);

    // Use react-native-calendars (JS-only) for a cross-platform calendar UI (no native modules required).

    const open = () => {
      setLocalDate(value ? new Date(value) : new Date());
      setShowModalLocal(true);
    };

    const commitLocal = (d: Date) => {
      updateCell(id, 'date', d.toISOString());
      setShowModalLocal(false);
    };

      const NativePressable: any = Platform.OS === 'web' ? Pressable : TouchableOpacity;

    return (
      <View style={{ padding: 0, width: '100%' }}>
        <NativePressable
          onPress={open}
          activeOpacity={0.7}
          style={{ paddingVertical: 6, paddingHorizontal: 8, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 6, minWidth: 100, justifyContent: 'center', backgroundColor: '#FFFFFF' }}
        >
          <Text numberOfLines={1} ellipsizeMode="tail" style={{ textAlign: 'center', minWidth: 90, fontSize: 14 }}>{value ? new Date(value).toLocaleDateString() : 'Select date'}</Text>
        </NativePressable>


        {/* Native modal picker (iOS/Android): show the JS Calendar inside a Modal */}
        {showModalLocal && Platform.OS !== 'web' && (
          <Modal transparent animationType="fade" visible={!!showModalLocal} onRequestClose={() => setShowModalLocal(false)}>
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <View style={{ marginBottom: 12 }}>
                  <Calendar
                    current={localDate.toISOString().slice(0, 10)}
                    onDayPress={(day: { dateString: string }) => {
                      const d = new Date(day.dateString + 'T00:00:00');
                      setLocalDate(d);
                    }}
                    markedDates={{
                      [localDate.toISOString().slice(0, 10)]: { selected: true, selectedColor: '#2563EB' },
                    }}
                  />
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 8 }}>
                  <Button onPress={() => setShowModalLocal(false)} style={{ marginRight: 8 }}>
                    <ButtonText>Cancel</ButtonText>
                  </Button>
                  <Button onPress={() => { commitLocal(localDate); }}>
                    <ButtonText>OK</ButtonText>
                  </Button>
                </View>
              </View>
            </View>
          </Modal>
        )}
      </View>
    );
  };

  const sortedRows = useMemo(() => {
    if (!sortKey) return localRows;
    const copy = [...localRows];
    copy.sort((a, b) => {
      const A = a[sortKey];
      const B = b[sortKey];
      if (Array.isArray(A) && Array.isArray(B)) {
        const sa = A.join(",");
        const sb = B.join(",");
        return sortDir === "asc" ? sa.localeCompare(sb) : sb.localeCompare(sa);
      }
      return sortDir === "asc" ? String(A).localeCompare(String(B)) : String(B).localeCompare(String(A));
    });
    return copy;
  }, [localRows, sortKey, sortDir]);

  const handleHeaderClick = (key: string) => {
    let nextDir: "asc" | "desc" = "asc";
    if (sortKey === key) nextDir = sortDir === "asc" ? "desc" : "asc";
    setSortKey(key);
    setSortDir(nextDir);
    if (onSortChange) onSortChange(key, nextDir);
  };

  const renderItem = ({ item }: { item: Row }) => {
    const TagsCell = ({ id, value }: { id: string; value?: string[] }) => {
      const [localValue, setLocalValue] = useState<string[]>(value || []);
      const [showModalLocal, setShowModalLocal] = useState(false);

      React.useEffect(() => setLocalValue(value || []), [value]);

      const open = () => {
        setLocalValue(value ? [...value] : []);
        setShowModalLocal(true);
      };

      const commitLocal = (next: string[]) => {
        updateCell(id, 'tags', next);
        setShowModalLocal(false);
      };

      const available = Array.isArray(availableTags) ? availableTags : [];

      const NativePressable: any = Platform.OS === 'web' ? Pressable : TouchableOpacity;

      return (
      <View style={{ flex: 1, padding: 0 }}>
        <NativePressable
          onPress={open}
          activeOpacity={0.8}
          style={{ paddingVertical: 6, paddingHorizontal: 8, borderWidth: 1, borderColor: value && value.length ? '#BFDBFE' : '#E5E7EB', borderRadius: 8, backgroundColor: value && value.length ? '#EFF6FF' : '#FFFFFF', minHeight: 36, justifyContent: 'center' }}
        >
          <Text numberOfLines={1} ellipsizeMode="tail" style={{ color: value && value.length ? '#0B3D91' : '#0F172A', fontSize: 14 }}>{value && value.length ? value.join(', ') : 'Select tags'}</Text>
        </NativePressable>

          {/* Web overlay */}
          {showModalLocal && Platform.OS === 'web' && (
            <div style={{ position: 'fixed', left: 0, top: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ background: '#fff', padding: 20, borderRadius: 12, boxShadow: '0 8px 30px rgba(16,24,40,0.08)', minWidth: 360 }}>
                <div style={{ marginBottom: 12 }}>
                  <FilterPanel tags={available} value={localValue} onChange={({ tags }) => setLocalValue(tags)} />
                </div>
                <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', alignItems: 'center' }}>
                  <button onClick={() => setShowModalLocal(false)} style={{ padding: '8px 14px', background: '#F3F4F6', border: 'none', borderRadius: 8, color: '#0F172A' }}>Cancel</button>
                  <button onClick={() => { commitLocal(localValue); }} style={{ padding: '8px 14px', background: '#2563EB', border: 'none', borderRadius: 8, color: '#fff' }}>OK</button>
                </div>
              </div>
            </div>
          )}

          {/* Native modal */}
          {showModalLocal && Platform.OS !== 'web' && (
            <Modal transparent animationType="fade" visible={!!showModalLocal} onRequestClose={() => setShowModalLocal(false)}>
              <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                  <View style={{ marginBottom: 12 }}>
                    <FilterPanel tags={available} value={localValue} onChange={({ tags }) => setLocalValue(tags)} />
                  </View>
                  <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 8 }}>
                    <Button onPress={() => setShowModalLocal(false)} style={{ marginRight: 8, backgroundColor: '#F3F4F6' }}>
                      <ButtonText style={{ color: '#0F172A' }}>Cancel</ButtonText>
                    </Button>
                    <Button onPress={() => { commitLocal(localValue); }} style={{ backgroundColor: '#2563EB' }}>
                      <ButtonText style={{ color: '#fff' }}>OK</ButtonText>
                    </Button>
                  </View>
                </View>
              </View>
            </Modal>
          )}
        </View>
      );
    };

    return (
      <View style={{ flexDirection: 'row', marginVertical: 6, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E6EEF8', borderRadius: 10, paddingVertical: 8, paddingHorizontal: 10, alignItems: 'center' }}>
        <View style={{ flex: 0.95, paddingRight: 8 }}>
          <Input>
            <InputField
              value={item.name}
              onChangeText={(v: string) => onNameChange(item.id, v)}
              style={{ textAlign: 'left' }}
              // ensure the visible portion shows start of the string (selection at start)
              selection={{ start: 0, end: 0 }}
            />
          </Input>
        </View>
        {/* Tags cell: opens a dropdown checklist using FilterPanel */}
        <View style={{ flex: 0.95, paddingHorizontal: 8 }}>
          <TagsCell id={item.id} value={item.tags} />
        </View>
        {/* Date cell: uses DateCell component to edit */}
        <View style={{ flex: 1.05, paddingLeft: 8, alignItems: 'flex-end' }}>
          <DateCell id={item.id} value={item.date} />
        </View>
      </View>
    );
  };

  return (
    <View style={{ backgroundColor: '#FFFFFF', padding: 12, borderRadius: 12, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 12, elevation: 2 }}>
      <View style={{ flexDirection: 'row', marginBottom: 8 }}>
        <Pressable onPress={() => handleHeaderClick('name')} style={{ flex: 1, padding: 8 }}>
          <Text style={{ color: '#2563EB', fontWeight: '700' }}>Patient Name {sortKey === 'name' ? (sortDir === 'asc' ? '▲' : '▼') : ''}</Text>
        </Pressable>
        <Pressable style={{ flex: 1, padding: 8 }}>
          <Text style={{ color: '#2563EB', fontWeight: '700' }}>Tags</Text>
        </Pressable>
        <Pressable onPress={() => handleHeaderClick('date')} style={{ flex: 1, padding: 8 }}>
          <Text style={{ color: '#2563EB', fontWeight: '700' }}>Date {sortKey === 'date' ? (sortDir === 'asc' ? '▲' : '▼') : ''}</Text>
        </Pressable>
      </View>

      <FlatList data={sortedRows} renderItem={renderItem} keyExtractor={(i) => i.id} />
      {/* Date editing handled per-row inside DateCell component */}
    </View>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    minWidth: 280,
  },
});
