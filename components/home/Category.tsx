import {
	View,
	Text,
	FlatList,
	TouchableOpacity,
	StyleSheet,
	Image,
} from 'react-native';

export default function Category() {
	const categories = [
		{ id: '1', name: 'Music', taskCount: 5, color: '#E9D758' },
		{ id: '2', name: 'Work', taskCount: 3, color: '#39393A' },
		{ id: '3', name: 'Personal', taskCount: 2, color: '#FF8552' },
		{ id: '4', name: 'Health', taskCount: 4, color: '#4F4789' },
		{ id: '5', name: 'Learning', taskCount: 1, color: '#E6E6E6' },
		{ id: '6', name: 'Test', taskCount: 1, color: '#297373' },
	];

	return (
		<View style={{ marginTop: 20 }}>
			<Text style={{ fontSize: 18, marginBottom: 10 }}>Category</Text>
			<FlatList
				data={categories}
				horizontal
				showsHorizontalScrollIndicator={false}
				keyExtractor={(item) => item.id}
				contentContainerStyle={styles.categoryListContainer}
				renderItem={({ item }) => (
					<View style={[styles.boxCategory, { backgroundColor: item.color }]}>
						<Text style={styles.boxText}>{item.name}</Text>
						<Text style={styles.taskCountText}>{item.taskCount} Tasks</Text>
						<TouchableOpacity>
							<Image style={{ width: 40, height: 40}} source={require('../../assets/images/Add-Button.png')} ></Image>
						</TouchableOpacity>
					</View>
				)}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	boxText: {
		color: '#fff',
		fontSize: 16,
		fontWeight: 'bold',
	},
	categoryListContainer: {
		paddingVertical: 10,
		paddingHorizontal: 5,
	},
	boxCategory: {
		width: 150,
		height: 120,
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 8,
		marginRight: 15,
		padding: 15,
	},
	taskCountText: {
		color: '#fff',
		fontSize: 14,
		marginVertical: 5,
	},
	plusText: {
		color: '#fff',
		fontSize: 20,
		fontWeight: 'bold',
	},
});
