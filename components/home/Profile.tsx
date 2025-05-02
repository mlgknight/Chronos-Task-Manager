import React from 'react';
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	ActivityIndicator,
} from 'react-native';
import { SvgUri } from 'react-native-svg';
import { useUserData } from '@/hooks/UserDataContext';

export default function Profile() {
	const { userData, isLoading } = useUserData();

	interface FirebaseTimestamp {
		seconds: number;
		nanoseconds: number;
	}

	// Generate avatar URI from user data
	const avatarUri = React.useMemo(() => {
		if (!userData?.avatarSvg) return null;
		return `data:image/svg+xml;utf8,${encodeURIComponent(userData.avatarSvg)}`;
	}, [userData?.avatarSvg]);

	if (isLoading) {
		return (
			<View style={styles.loadingContainer}>
				<ActivityIndicator size="large" color="#7F56D9" />
			</View>
		);
	}

	return (
		<View style={styles.container}>
			{/* Header Section */}
			<View style={styles.header}>
				<Text style={styles.title}>Profile</Text>
			</View>

			{/* Avatar Section */}
			<View style={styles.avatarContainer}>
				{avatarUri ? (
					<SvgUri
						width={120}
						height={120}
						uri={avatarUri}
						style={styles.avatarImage}
					/>
				) : (
					<View style={styles.avatarPlaceholder}>
						<Text style={styles.avatarPlaceholderText}>
							{userData?.name?.charAt(0)?.toUpperCase() || 'U'}
						</Text>
					</View>
				)}
				<Text style={styles.userName}>{userData?.name || 'User'}</Text>
				<Text style={styles.userEmail}>
					{userData?.email || 'user@example.com'}
				</Text>
			</View>

			{/* User Information */}
			<View style={styles.infoContainer}>
				<View style={styles.infoItem}>
					<Text style={styles.infoLabel}>Member Since</Text>
					<Text style={styles.infoValue}>
						{userData?.createdAt
							? new Date(userData.createdAt.seconds * 1000).toLocaleDateString()
							: 'N/A'}
					</Text>
				</View>
				<View style={styles.infoItem}>
					<Text style={styles.infoLabel}>Total Tasks</Text>
					<Text style={styles.infoValue}>
						{userData?.RecentTasks?.length || 0}
					</Text>
				</View>
			</View>

			{/* Edit Profile Button */}
			<TouchableOpacity
				style={styles.editButton}
				onPress={() => console.log('Edit profile pressed')}
			>
				<Text style={styles.editButtonText}>Edit Profile</Text>
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
	loadingContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	header: {
		marginBottom: 30,
	},
	title: {
		fontSize: 28,
		fontWeight: 'bold',
		color: '#333',
	},
	avatarContainer: {
		alignItems: 'center',
		marginBottom: 30,
	},
	avatarImage: {
		borderRadius: 60,
	},
	avatarPlaceholder: {
		width: 120,
		height: 120,
		borderRadius: 60,
		backgroundColor: '#7F56D9',
		justifyContent: 'center',
		alignItems: 'center',
	},
	avatarPlaceholderText: {
		fontSize: 48,
		color: '#FFF',
		fontWeight: 'bold',
	},
	userName: {
		fontSize: 24,
		fontWeight: '600',
		marginTop: 15,
		color: '#333',
	},
	userEmail: {
		fontSize: 16,
		color: '#666',
		marginTop: 5,
	},
	infoContainer: {
		backgroundColor: '#FFF',
		borderRadius: 10,
		padding: 20,
		marginBottom: 20,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.1,
		shadowRadius: 3,
		elevation: 2,
	},
	infoItem: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingVertical: 12,
		borderBottomWidth: 1,
		borderBottomColor: '#EEE',
	},
	infoLabel: {
		fontSize: 16,
		color: '#666',
	},
	infoValue: {
		fontSize: 16,
		fontWeight: '500',
	},
	editButton: {
		backgroundColor: '#7F56D9',
		padding: 15,
		borderRadius: 10,
		alignItems: 'center',
	},
	editButtonText: {
		color: '#FFF',
		fontSize: 16,
		fontWeight: 'bold',
	},
});
