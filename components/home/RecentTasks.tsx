import React from 'react';
import {
	View,
	Text,
	FlatList,
	StyleSheet,
} from 'react-native';

import { RecentTasksProps } from '../../types';

const RecentTasks: React.FC<RecentTasksProps> = ({ RecentTasks }) => {
	const list = RecentTasks || [];

	return (
		<View style={{ marginTop: 20 }}>
			<Text style={{ fontSize: 18, marginBottom: 10 }}>Recent Tasks</Text>
			<FlatList
				data={list}
				showsHorizontalScrollIndicator={false}
				keyExtractor={(item) => item.id.toString()}
				contentContainerStyle={styles.taskContainer}
				renderItem={({ item }) => <Text>{item.task}</Text>}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	taskContainer: {
		display: 'flex',
		justifyContent: 'center',
	},
});

export default RecentTasks;
