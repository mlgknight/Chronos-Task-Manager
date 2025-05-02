import React, { useState, useEffect } from 'react';
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	FlatList,
	StyleSheet,
	Image,
	Modal,
} from 'react-native';
import { FIRE_STORE, FIREBASE_AUTH } from '../../FirebaseConfig';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { onAuthStateChanged, User } from 'firebase/auth';
import { Category } from '../../types';
import { Chip } from 'react-native-paper';
import { useUserData } from '../../hooks/UserDataContext';
import { nanoid } from 'nanoid';

export default function TaskPage() {
	const { setUserData } = useUserData();
	const [categories, setCategories] = useState<Category[]>([]);
	const [searchQuery, setSearchQuery] = useState('');
	const [newCategoryName, setNewCategoryName] = useState('');
	const [selectedCategory, setSelectedCategory] = useState<Category | null>(
		null
	);
	const [userId, setUserId] = useState<string | null>(null);
	const [newTaskName, setNewTaskName] = useState('');
	const [isRemoving, setIsRemoving] = useState(false);
	const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
	const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
		null
	);

	const filteredCategories = categories.filter((category) =>
		category.name.toLowerCase().includes(searchQuery.toLowerCase())
	);

	const fetchUserCategories = async (userId: string): Promise<void> => {
		try {
			const userDocRef = doc(FIRE_STORE, 'users', userId);
			const userDoc = await getDoc(userDocRef);
			if (userDoc.exists()) {
				const userData = userDoc.data();
				if (
					JSON.stringify(categories) !== JSON.stringify(userData.categories)
				) {
					setCategories(userData.categories || []);
				}
			}
		} catch (error) {
			console.error('Error fetching user categories:', error);
		}
	};

	const removeTask = async (taskId: string) => {
		if (!selectedCategory || !userId) {
			alert('No category selected or user not logged in!');
			return;
		}
		try {
			const updatedTasks = selectedCategory.tasks.filter(
				(task) => task.id !== taskId
			);

			const updatedCategory = {
				...selectedCategory,
				tasks: updatedTasks,
			};

			const updatedCategories = categories.map((category) =>
				category.id === selectedCategory.id ? updatedCategory : category
			);

			const userDocRef = doc(FIRE_STORE, 'users', userId);
			await updateDoc(userDocRef, {
				categories: updatedCategories,
			});

			setCategories(updatedCategories);
			setSelectedCategory(updatedCategory);

			setUserData((prevUserData) => ({
				...(prevUserData || {
					name: '',
					email: '',
					photoURL: '',
					avatarSvg: '',
					RecentTasks: [],
					id: '',
				}),
				categories: updatedCategories,
			}));
		} catch (error) {
			console.error('Error removing task:', error);
			alert('Failed to remove task. Please try again.');
		}
	};

	const confirmDeleteCategory = (category: Category) => {
		setCategoryToDelete(category);
		setShowDeleteModal(true);
	};

	const removeCategory = async () => {
		if (!userId || !categoryToDelete) {
			alert('User not logged in or no category selected!');
			return;
		}
		try {
			const userDocRef = doc(FIRE_STORE, 'users', userId);
			const userDoc = await getDoc(userDocRef);
			if (userDoc.exists()) {
				const userData = userDoc.data();
				const updatedCategories = userData?.categories?.filter(
					(category: Category) => category.id !== categoryToDelete.id
				);

				await updateDoc(userDocRef, {
					categories: updatedCategories,
				});

				setCategories(updatedCategories || []);

				setUserData((prevUserData) => ({
					...(prevUserData || {
						name: '',
						email: '',
						photoURL: '',
						avatarSvg: '',
						RecentTasks: [],
						id: '',
					}),
					categories: updatedCategories,
				}));
			}
		} catch (error) {
			console.error('Error removing category:', error);
			alert('Failed to remove category. Please try again.');
		} finally {
			setShowDeleteModal(false);
			setCategoryToDelete(null);
		}
	};

	const addCategory = async (name: string) => {
		if (!userId) {
			alert('User not logged in!');
			return;
		}

		const newTask = newTaskName.trim()
			? {
					id: nanoid(),
					task: newTaskName.trim(),
					timeStamp: new Date().toISOString(),
			  }
			: null;

		const newCategory = {
			id: new Date().toISOString() + name,
			tasks: newTask ? [newTask] : [],
			name,
			color: getRandomColor(),
			timeStamp: new Date().toISOString(),
		};

		try {
			const userDocRef = doc(FIRE_STORE, 'users', userId);
			await updateDoc(userDocRef, {
				categories: arrayUnion(newCategory),
			});

			setCategories([...categories, newCategory]);
			setUserData((prevUserData) => ({
				...(prevUserData || {
					name: '',
					email: '',
					photoURL: '',
					avatarSvg: '',
					RecentTasks: [],
					id: '',
				}),
				categories: [...(prevUserData?.categories || []), newCategory],
			}));

			setNewCategoryName('');
			setNewTaskName('');
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
			id: new Date().toISOString() + taskName,
			task: taskName,
			timeStamp: new Date().toISOString(),
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
				RecentTasks: [
					newTask,
					...((await (await getDoc(userDocRef)).data()?.RecentTasks) || []),
				],
			});

			setCategories(updatedCategories);
			setSelectedCategory(updatedCategory);

			setUserData((prevUserData) => {
				if (!prevUserData) {
					return null;
				}
				return {
					...prevUserData,
					categories: updatedCategories,
				};
			});
		} catch (error) {
			console.error('Error adding task:', error);
			alert('Failed to add task. Please try again.');
		}
	};

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
		return () => unsubscribe();
	}, []);

	return (
		<View style={styles.container}>
			<TextInput
				style={styles.searchBar}
				placeholder="Search categories..."
				value={searchQuery}
				onChangeText={setSearchQuery}
			/>

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
			{categories.length === 0 && <Text>No Categories</Text>}

			<FlatList
				data={filteredCategories}
				keyExtractor={(item) => item.id}
				renderItem={({ item }) => (
					<TouchableOpacity
						style={[styles.categoryItem, { backgroundColor: item.color }]}
						onPress={() => setSelectedCategory(item)}
					>
						<Text style={styles.categoryText}>{item.name}</Text>
						<TouchableOpacity
							onPress={() => confirmDeleteCategory(item)}
							style={styles.deleteButton}
						>
							<Image
								source={require('../../assets/images/remove.png')}
								style={{ width: 25, height: 25 }}
							/>
						</TouchableOpacity>
					</TouchableOpacity>
				)}
			/>
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
								<TouchableOpacity
									style={styles.deleteButton}
									onPress={() => {
										if (!isRemoving) {
											setIsRemoving(true);
											removeTask(item.id).finally(() => setIsRemoving(false));
										}
									}}
								>
									<Image
										source={require('../../assets/images/remove.png')}
										style={{ width: 25, height: 25 }}
									/>
								</TouchableOpacity>
								<Chip
									textStyle={{ color: 'white' }}
									style={[
										styles.taskText,
										{ backgroundColor: selectedCategory.color },
									]}
								>
									{item.task}
								</Chip>
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
								if (newTaskName.trim().length === 0) {
									alert('Task name cannot be empty!');
									return;
								}
								addTaskToCategory(newTaskName.trim());
								setNewTaskName('');
							}}
						/>
					</View>
				</View>
			)}

			<Modal
				visible={showDeleteModal}
				transparent={true}
				animationType="slide"
				onRequestClose={() => setShowDeleteModal(false)}
			>
				<View style={styles.modalContainer}>
					<View style={styles.modalContent}>
						<Text style={styles.modalText}>
							Are you sure you want to delete this category?
						</Text>
						<View style={styles.modalButtons}>
							<TouchableOpacity
								style={styles.modalButtonCancel}
								onPress={() => setShowDeleteModal(false)}
							>
								<Text style={styles.modalButtonText}>Cancel</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={styles.modalButtonConfirm}
								onPress={removeCategory}
							>
								<Text style={styles.modalButtonText}>Delete</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</Modal>
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
		borderBottomWidth: 10,
		borderBottomColor: '#ffffff',
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	categoryText: {
		fontSize: 16,
		color: 'white',
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
		width: '100%',
		color: 'white',
	},
	deleteButton: {
		padding: 10,
		borderRadius: 5,
	},
	modalContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
	},
	modalContent: {
		width: '80%',
		backgroundColor: 'white',
		padding: 20,
		borderRadius: 10,
		alignItems: 'center',
	},
	modalText: {
		fontSize: 18,
		marginBottom: 20,
		textAlign: 'center',
	},
	modalButtons: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		width: '100%',
	},
	modalButtonCancel: {
		backgroundColor: '#ccc',
		padding: 10,
		borderRadius: 5,
		marginRight: 10,
	},
	modalButtonConfirm: {
		backgroundColor: '#FF6F61',
		padding: 10,
		borderRadius: 5,
	},
	modalButtonText: {
		color: 'white',
		fontWeight: 'bold',
	},
});
