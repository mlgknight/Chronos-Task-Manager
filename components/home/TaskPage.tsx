import React, { useState, useEffect } from 'react';
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	FlatList,
	StyleSheet,
	Image,
} from 'react-native';
import { FIRE_STORE, FIREBASE_AUTH } from '../../FirebaseConfig';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { onAuthStateChanged, User } from 'firebase/auth';
import { Category } from '../../types';

export default function TaskPage() {
	const [categories, setCategories] = useState<Category[]>([]);
	const [searchQuery, setSearchQuery] = useState('');
	const [newCategoryName, setNewCategoryName] = useState('');
	const [selectedCategory, setSelectedCategory] = useState<Category | null>(
		null
	); // Selected category or null
	const [userId, setUserId] = useState<string | null>(null);
	const [newTaskName, setNewTaskName] = useState(''); // State for new task name

	// Filter categories based on search query
	const filteredCategories = categories.filter((category) =>
		category.name.toLowerCase().includes(searchQuery.toLowerCase())
	);


	const fetchUserCategories = async (userId: string): Promise<void> => {
		try {
			const userDocRef = doc(FIRE_STORE, 'users', userId);
			const userDoc = await getDoc(userDocRef);
			if (userDoc.exists()) {
				const userData = userDoc.data();
				setCategories(userData.categories || []);
			}
		} catch (error) {
			console.error('Error fetching user categories:', error);
		}
	};

	console.log(selectedCategory);

	// Add a new category and push it to Firestore
	const addCategory = async (name: string) => {
		if (!userId) {
			alert('User not logged in!');
			return;
		}
        const newTask = {
            id: Date.now().toString(),
            task: newTaskName,
            timeStamp: new Date().toISOString(),
        };

		const newCategory = {
            id: Date.now().toString(),
            tasks: [newTask],
			name,
			color: getRandomColor(),
            timeStamp: new Date().toISOString(),
		};

		try {
			// Update Firestore with the new category
			const userDocRef = doc(FIRE_STORE, 'users', userId);
			await updateDoc(userDocRef, {
				categories: arrayUnion(newCategory),
			});


			// Update local state
			setCategories([...categories, newCategory]);
			setNewCategoryName('');
		} catch (error) {
			console.error('Error adding category:', error);
			alert('Failed to add category. Please try again.');
		}
	};

	const addTaskToCategory = async (taskName: string) => {
		if (!selectedCategory || !userId) {
			alert('No category selected or user not logged in!');
			return;
		}

		const newTask = {
			id: Date.now().toString(), // Unique ID for the task
			task: taskName, // Task name
			timeStamp: new Date().toISOString(), // Optional: Add a timestamp
		};

		const updatedCategory = {
			...selectedCategory,
			tasks: [newTask, ...selectedCategory.tasks],
		};

		try {
			const updatedCategories = categories.map((category) =>
				category.id === selectedCategory.id ? updatedCategory : category
			);

			const userDocRef = doc(FIRE_STORE, 'users', userId);
            await updateDoc(userDocRef, {
                categories: updatedCategories,
                    RecentTasks: [newTask, ...(await (await getDoc(userDocRef)).data()?.RecentTasks || [])],
            });

			setCategories(updatedCategories);
			setSelectedCategory(updatedCategory);
		} catch (error) {
			console.error('Error adding task:', error);
			alert('Failed to add task. Please try again.');
		}
	};

	// Generate a random color for new categories
	const getRandomColor = () => {
		const colors = ['#FF8552', '#4F4789', '#297373', '#E9D758', '#FF6F61'];
		return colors[Math.floor(Math.random() * colors.length)];
	};

	// Get the logged-in user and fetch categories
	useEffect(() => {
		const unsubscribe = onAuthStateChanged(
			FIREBASE_AUTH,
			async (user: User | null) => {
				if (user) {
					setUserId(user.uid); // Save the user ID
					await fetchUserCategories(user.uid); // Fetch categories for the logged-in user
				}
			}
		);
		return unsubscribe;
	}, []);

	return (
		<View style={styles.container}>
			{/* Search Bar */}
			<TextInput
				style={styles.searchBar}
				placeholder="Search categories..."
				value={searchQuery}
				onChangeText={setSearchQuery}
			/>

			{/* Add Category */}
			<View style={styles.addCategoryContainer}>
				<TextInput
					style={styles.input}
					placeholder="New category name"
					value={newCategoryName}
					onChangeText={setNewCategoryName}
				/>
				<TouchableOpacity
					style={[
						styles.addButton,
						{ opacity: newCategoryName.trim().length > 0 ? 1 : 0.5 },
					]}
					onPress={() => {
						if (newCategoryName.trim().length > 0) {
							addCategory(newCategoryName.trim());
						} else {
							alert('Category name cannot be empty!');
						}
					}}
					disabled={newCategoryName.trim().length === 0}
				>
					<Text style={styles.addButtonText}>Add Category</Text>
				</TouchableOpacity>
			</View>

			{/* Category List */}
			<FlatList
				data={filteredCategories}
				keyExtractor={(item) => item.id}
				renderItem={({ item }) => (
					<TouchableOpacity
						style={[styles.categoryItem, { backgroundColor: item.color }]}
						onPress={() => setSelectedCategory(item)}
					>
						<Text style={styles.categoryText}>{item.name}</Text>
						<TouchableOpacity style={styles.deleteButton}>
							<Image
								source={require('../../assets/images/remove.png')}
								style={{ width: 25, height: 25 }}
							></Image>
						</TouchableOpacity>
					</TouchableOpacity>
				)}
			/>

			{/* Tasks in Selected Category */}
			{selectedCategory && (
				<View style={styles.tasksContainer}>
					<Text style={styles.tasksTitle}>
						{selectedCategory.tasks.length > 0
							? `Tasks in ${selectedCategory.name}`
							: 'No tasks in this category'}
					</Text>
					<FlatList
						data={selectedCategory.tasks}
						keyExtractor={(item) => item.id}
						renderItem={({ item }) => (
							<View
								style={{
									display: 'flex',
									flexDirection: 'row',
									justifyContent: 'space-between',
								}}
							>
								<Text style={styles.taskText}>{item.task}</Text>
								<TouchableOpacity style={styles.deleteButton}>
									<Image
										source={require('../../assets/images/remove.png')}
										style={{ width: 25, height: 25 }}
									></Image>
								</TouchableOpacity>
							</View>
						)}
					/>
					<View style={{ height: '20%' }}>
						<TextInput
							style={styles.input}
							placeholder="New task name"
							value={newTaskName}
							onChangeText={setNewTaskName}
							onSubmitEditing={(e) => {
								addTaskToCategory(newTaskName);
								setNewTaskName('');
							}}
						/>
					</View>
				</View>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
		marginTop: 30,
	},
	searchBar: {
		height: 40,
		borderColor: '#ccc',
		borderWidth: 1,
		borderRadius: 5,
		marginBottom: 10,
		paddingHorizontal: 10,
	},
	addCategoryContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 20,
	},
	input: {
		flex: 1,
		height: 40,
		borderColor: '#ccc',
		borderWidth: 1,
		borderRadius: 5,
		paddingHorizontal: 10,
		marginRight: 10,
		maxHeight: 30,
		minHeight: 30,
	},
	addButton: {
		backgroundColor: '#4F4789',
		padding: 10,
		borderRadius: 5,
	},
	addButtonText: {
		color: 'white',
		fontWeight: 'bold',
	},
	categoryItem: {
		padding: 15,
		borderBottomWidth: 1,
		borderBottomColor: '#ddd',
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	categoryText: {
		fontSize: 16,
	},
	tasksContainer: {
		marginTop: 20,
		height: 'auto',
		maxHeight: 200,
	},
	tasksTitle: {
		fontSize: 18,
		fontWeight: 'bold',
		marginBottom: 10,
	},
	taskText: {
		fontSize: 16,
		marginBottom: 5,
	},
	deleteButton: {
		padding: 10,
		borderRadius: 5,
	},
});
