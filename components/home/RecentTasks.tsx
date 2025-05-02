import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Chip } from 'react-native-paper';
import { RecentTasksProps } from '../../types';
import { useUserData } from '../../hooks/UserDataContext';

const RecentTasks: React.FC<RecentTasksProps> = () => {
	const { userData } = useUserData();

	const list = React.useMemo(() => {
		return (userData?.RecentTasks || []).slice(0, 5);
	}, [userData?.RecentTasks]);

	const colors = ['#FF8552', '#4F4789', '#297373', '#E9D758', '#FF6F61'];

	const getColorForIndex = (index: number) => {
		return colors[index % colors.length];
	};

	const renderItem = ({ item, index }: { item: any; index: number }) => (
		<Chip
			style={[
				styles.taskItem,
				{
					backgroundColor: getColorForIndex(index),
				},
			]}
			textStyle={styles.taskText}
		>
			{item.task}
		</Chip>
	);

	return (
		<View style={{ marginTop: 1 }}>
			<Text style={styles.title}>Recently Added Tasks</Text>
			<FlatList
				data={list}
				keyExtractor={(item) => item.id.toString()}
				renderItem={renderItem}
				contentContainerStyle={styles.taskContainer}
				showsVerticalScrollIndicator={false}
				extraData={userData?.RecentTasks} // This forces FlatList to update when data changes
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	title: {
		fontSize: 18,
		marginBottom: 10,
		marginTop: 6,
		fontWeight: 'bold',
	},
	taskContainer: {
		paddingBottom: 10,
	},
	taskItem: {
		marginBottom: 12,
		paddingVertical: 6,
		paddingHorizontal: 15,
		borderRadius: 8,
		shadowColor: '#000',
		shadowOffset: {
			width: 3,
			height: 5,
		},
		shadowOpacity: 0.7,
		shadowRadius: 3.65,
		elevation: 5,
	},
	taskText: {
		color: 'white',
		fontSize: 16,
	},
});

export default RecentTasks;
