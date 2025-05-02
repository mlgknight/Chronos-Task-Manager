import React, { useEffect } from 'react';
import {
	View,
	Text,
	StyleSheet,
	FlatList,
	TouchableOpacity,
	Image,
} from 'react-native';
import { CategoryProps } from '../../types';
import { useUserData } from '../../hooks/UserDataContext';

const Category: React.FC<CategoryProps> = () => {
	const { userData } = useUserData();

	if (userData?.categories?.length === 0) {
		return (
			<View>
				<Text style={styles.noCategoriesText}>No categories available</Text>
			</View>
		);
	}

	useEffect(() => {}, [userData]);

	return (
		<View style={{ marginTop: 20 }}>
			<Text style={{ fontSize: 18, marginBottom: 10, fontWeight: 'bold' }}>
				Category
			</Text>
			<FlatList
				data={userData?.categories}
				horizontal
				showsHorizontalScrollIndicator={false}
				keyExtractor={(item) => item.id}
				contentContainerStyle={styles.categoryListContainer}
				renderItem={({ item }) => (
					<View style={[styles.boxCategory, { backgroundColor: item.color }]}>
						<Text style={styles.boxText}>{item.name}</Text>
						<Text style={styles.taskCountText}>{item.tasks.length}</Text>
						<TouchableOpacity>
							<Image
								style={{ width: 40, height: 40 }}
								source={require('../../assets/images/Add-Button.png')}
							/>
						</TouchableOpacity>
					</View>
				)}
			/>
		</View>
	);
};

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
		padding: 20,
		shadowColor: '#000',
		shadowOffset: {
			width: 5,
			height: 10,
		},
		shadowOpacity: 0.3,
		shadowRadius: 4.65,
		elevation: 8,
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
	noCategoriesText: {
		fontSize: 16,
		color: '#666',
		textAlign: 'center',
		marginTop: 20,
	},
});

export default Category;
