"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { View } from "@/components/ui/view";
import { Text } from "@/components/ui/text";
import { Button, ButtonText } from "@/components/ui/button";
import FilterPanel from "./FilterPanel";
import EditableTable from "./EditableTable";

type Row = { id: string; name: string; tags: string[];[k: string]: any };
type FilterConfig = { tags: string[] };

const sampleRows: Row[] = [
  { id: "1", name: "John Smith", tags: ["Dermatology", "Lab Results"], date: new Date().toISOString() },
  { id: "2", name: "Nancy Li", tags: ["Cardiovascular", "Vaccination"], date: new Date(Date.now() + 86400000).toISOString() },
  { id: "3", name: "Hannah Wong", tags: ["General Check-Up", "Vaccination"], date: new Date(Date.now() + 2 * 86400000).toISOString() },
];

const sampleTags = ["General Check-Up", "Lab Results", "Cardiovascular", "Vaccination", "Dermatology"];

export default function DataViewContainer() {
  const [rows, setRows] = useState<Row[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [filters, setFilters] = useState<FilterConfig>({ tags: [] });
  const [sort, setSort] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);

  useEffect(() => {
    // Replace these with real fetches if you have an API
    setRows(sampleRows);
    setAllTags(sampleTags);
  }, []);

  const handleFilterChange = useCallback((cfg: FilterConfig) => {
    setFilters(cfg);
  }, []);

  const handleRowsChange = useCallback((next: Row[]) => {
    setRows(next);
  }, []);

  const handleSortChange = useCallback((key: string, direction: "asc" | "desc") => {
    setSort({ key, direction });
  }, []);

  const filteredRows = useMemo(() => {
    if (!filters.tags || filters.tags.length === 0) return rows;
    return rows.filter((r) => filters.tags.every((t) => r.tags.includes(t)));
  }, [rows, filters]);

  const postConfig = useCallback(async () => {
    const payload = { filters, sort, rows };
    try {
      // Update endpoint as needed for your backend
      const res = await fetch("/api/tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        console.warn("POST failed", await res.text());
      } else {
        console.log("POST success");
      }
    } catch (err) {
      console.error("POST error", err);
    }
  }, [filters, sort, rows]);

  return (
    <View style={{ padding: 12, flex: 1 }}>
      <Text style={{ marginBottom: 8 }} size="lg">
        Appointment Type
      </Text>
      <FilterPanel tags={allTags} value={filters.tags} onChange={handleFilterChange} />

      <View style={{ marginTop: 12, flex: 1 }}>
        <EditableTable rows={filteredRows} onRowsChange={handleRowsChange} onSortChange={handleSortChange} availableTags={allTags} />
      </View>

      <View style={{ marginTop: 12 }}>

        <Button
          onPress={postConfig}
          style={{
            backgroundColor: '#2563EB',
            paddingVertical: 10,
            paddingHorizontal: 20,
            borderRadius: 12,
            minHeight: 45,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ButtonText style={{ color: '#FFFFFF', fontWeight: '800', fontSize: 18, lineHeight: 24 }}>Submit (POST)</ButtonText>
        </Button>
      </View>
    </View>
  );
}
