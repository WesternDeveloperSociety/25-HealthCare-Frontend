import React from "react";
import { View } from "@/components/ui/view";
import DataViewContainer from "@/components/DataViewContainer";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ServicesScreen() {
	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: '#f3f4f6' }}>
			<View style={{ padding: 12, flex: 1 }}>
				<DataViewContainer />
			</View>
		</SafeAreaView>
	);
}
