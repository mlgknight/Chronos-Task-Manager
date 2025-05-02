import React, { useState } from 'react';
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	TextInput,
	Alert,
	ActivityIndicator,
} from 'react-native';
import {
	signOut,
	reauthenticateWithCredential,
	EmailAuthProvider,
	updatePassword,
} from 'firebase/auth';
import { FIREBASE_AUTH } from '../../FirebaseConfig';
import { useUserData } from '@/hooks/UserDataContext';

export default function Setting() {
	const { userData } = useUserData();
	const [passwordSectionVisible, setPasswordSectionVisible] = useState(false);
	const [currentPassword, setCurrentPassword] = useState('');
	const [newPassword, setNewPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [isUpdating, setIsUpdating] = useState(false);

	const handleSignOut = async (): Promise<void> => {
		try {
			await signOut(FIREBASE_AUTH);
		} catch (error) {
			console.error('Error signing out:', error);
			Alert.alert('Error', 'Error signing out');
		}
	};

	const handleChangePassword = async () => {
		if (!currentPassword || !newPassword || !confirmPassword) {
			Alert.alert('Error', 'Please fill in all fields');
			return;
		}

		if (newPassword !== confirmPassword) {
			Alert.alert('Error', 'New passwords do not match');
			return;
		}

		if (newPassword.length < 6) {
			Alert.alert('Error', 'Password should be at least 6 characters');
			return;
		}

		const user = FIREBASE_AUTH.currentUser;
		if (!user || !user.email) return;

		try {
			setIsUpdating(true);

			// Reauthenticate user
			const credential = EmailAuthProvider.credential(
				user.email,
				currentPassword
			);

			await reauthenticateWithCredential(user, credential);
			await updatePassword(user, newPassword);

			Alert.alert('Success', 'Password updated successfully');
			setPasswordSectionVisible(false);
			setCurrentPassword('');
			setNewPassword('');
			setConfirmPassword('');
		} catch (error: any) {
			console.error('Error updating password:', error);
			let errorMessage = 'Failed to update password';
			if (error.code === 'auth/wrong-password') {
				errorMessage = 'Current password is incorrect';
			} else if (error.code === 'auth/requires-recent-login') {
				errorMessage =
					'This operation requires recent authentication. Please sign out and sign back in.';
			}
			Alert.alert('Error', errorMessage);
		} finally {
			setIsUpdating(false);
		}
	};

	return (
		<View style={styles.container}>
			{/* Header Section */}
			<View style={styles.header}>
				<Text style={styles.title}>Settings</Text>
			</View>

			{/* User Information */}
			<View style={styles.section}>
				<Text style={styles.sectionTitle}>Account Information</Text>
				<View style={styles.infoItem}>
					<Text style={styles.infoLabel}>Name:</Text>
					<Text style={styles.infoValue}>{userData?.name || 'N/A'}</Text>
				</View>
				<View style={styles.infoItem}>
					<Text style={styles.infoLabel}>Email:</Text>
					<Text style={styles.infoValue}>{userData?.email || 'N/A'}</Text>
				</View>
			</View>

			{/* Password Change Section */}
			<View style={styles.section}>
				<Text style={styles.sectionTitle}>Security</Text>
				{!passwordSectionVisible ? (
					<TouchableOpacity
						style={styles.settingItem}
						onPress={() => setPasswordSectionVisible(true)}
					>
						<Text style={styles.settingText}>Change Password</Text>
					</TouchableOpacity>
				) : (
					<View style={styles.passwordChangeContainer}>
						<TextInput
							style={styles.input}
							placeholder="Current Password"
							secureTextEntry
							value={currentPassword}
							onChangeText={setCurrentPassword}
							autoCapitalize="none"
							placeholderTextColor="#999"
						/>
						<TextInput
							style={styles.input}
							placeholder="New Password"
							secureTextEntry
							value={newPassword}
							onChangeText={setNewPassword}
							autoCapitalize="none"
							placeholderTextColor="#999"
						/>
						<TextInput
							style={styles.input}
							placeholder="Confirm New Password"
							secureTextEntry
							value={confirmPassword}
							onChangeText={setConfirmPassword}
							autoCapitalize="none"
							placeholderTextColor="#999"
						/>
						<View style={styles.passwordButtonContainer}>
							<TouchableOpacity
								style={[styles.passwordButton, styles.cancelButton]}
								onPress={() => {
									setPasswordSectionVisible(false);
									setCurrentPassword('');
									setNewPassword('');
									setConfirmPassword('');
								}}
								disabled={isUpdating}
							>
								<Text style={[styles.passwordButtonText, { color: '#333' }]}>
									Cancel
								</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={[
									styles.passwordButton,
									styles.updateButton,
									isUpdating ? styles.disabledButton : null,
								]}
								onPress={handleChangePassword}
								disabled={isUpdating}
							>
								{isUpdating ? (
									<ActivityIndicator color="#FFF" />
								) : (
									<Text style={styles.passwordButtonText}>Update</Text>
								)}
							</TouchableOpacity>
						</View>
					</View>
				)}
			</View>

			{/* App Settings */}
			<View style={styles.section}>
				<Text style={styles.sectionTitle}>App Settings</Text>
				<TouchableOpacity style={styles.settingItem}>
					<Text style={styles.settingText}>Notification Preferences</Text>
				</TouchableOpacity>
				<TouchableOpacity style={styles.settingItem}>
					<Text style={styles.settingText}>Theme</Text>
				</TouchableOpacity>
			</View>

			{/* Sign Out Button */}
			<TouchableOpacity
				style={styles.signOutButton}
				onPress={handleSignOut}
				disabled={isUpdating}
			>
				<Text style={styles.signOutButtonText}>Sign Out</Text>
			</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingVertical: 40,
		paddingHorizontal: 20,
		backgroundColor: '#F5F5F5',
	},
	header: {
		marginBottom: 30,
	},
	title: {
		fontSize: 28,
		fontWeight: 'bold',
		color: '#333',
	},
	section: {
		marginBottom: 25,
		backgroundColor: '#FFF',
		borderRadius: 10,
		padding: 15,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.1,
		shadowRadius: 3,
		elevation: 2,
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: '600',
		marginBottom: 15,
		color: '#7F56D9',
	},
	infoItem: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 10,
	},
	infoLabel: {
		fontSize: 16,
		color: '#666',
	},
	infoValue: {
		fontSize: 16,
		fontWeight: '500',
	},
	settingItem: {
		paddingVertical: 12,
		borderBottomWidth: 1,
		borderBottomColor: '#EEE',
	},
	settingText: {
		fontSize: 16,
	},
	passwordChangeContainer: {
		marginTop: 10,
	},
	input: {
		height: 50,
		borderColor: '#DDD',
		borderWidth: 1,
		borderRadius: 8,
		paddingHorizontal: 15,
		marginBottom: 15,
		backgroundColor: '#FAFAFA',
		color: '#333',
	},
	passwordButtonContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginTop: 10,
	},
	passwordButton: {
		flex: 1,
		padding: 15,
		borderRadius: 8,
		alignItems: 'center',
		justifyContent: 'center',
	},
	cancelButton: {
		backgroundColor: '#EEE',
		marginRight: 10,
	},
	updateButton: {
		backgroundColor: '#7F56D9',
		marginLeft: 10,
	},
	disabledButton: {
		opacity: 0.6,
	},
	passwordButtonText: {
		fontSize: 16,
		fontWeight: 'bold',
		color: '#FFF',
	},
	signOutButton: {
		marginTop: 20,
		backgroundColor: '#FF3B30',
		padding: 15,
		borderRadius: 10,
		alignItems: 'center',
	},
	signOutButtonText: {
		color: '#FFF',
		fontSize: 16,
		fontWeight: 'bold',
	},
});
