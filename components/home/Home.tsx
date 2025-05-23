import React, { useEffect, useState, useMemo } from 'react';
import {
	View,
	Text,
	StyleSheet,
	ActivityIndicator,
	TouchableOpacity,
} from 'react-native';
import { SvgUri } from 'react-native-svg';
import { doc, getDoc } from 'firebase/firestore';
import { signOut, onAuthStateChanged, User } from 'firebase/auth';
import { FIRE_STORE, FIREBASE_AUTH } from '../../FirebaseConfig';
import { UserData } from '../../types';
import Category from './Category';
import RecentTasks from './RecentTasks';
import { useUserData } from '@/hooks/UserDataContext';

export default function Home() {
	const { userData, setUserData } = useUserData();
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(
			FIREBASE_AUTH,
			async (user: User | null) => {
				if (user) {
					await fetchUserData(user.uid);
				}
				setLoading(false);
			}
		);
		return unsubscribe;
	}, []);

	const avatarUri = useMemo(() => {
		if (!userData?.avatarSvg) return null;
		return `data:image/svg+xml;utf8,${encodeURIComponent(userData.avatarSvg)}`;
	}, [userData?.avatarSvg]);

	const fetchUserData = async (userId: string): Promise<void> => {
		try {
			const userDocRef = doc(FIRE_STORE, 'users', userId);
			const userDoc = await getDoc(userDocRef);
			if (userDoc.exists()) {
				setUserData(userDoc.data() as UserData);
			}
		} catch (error) {
			console.error('Error fetching user data:', error);
		}
	};

	const handleSignOut = async (): Promise<void> => {
		try {
			await signOut(FIREBASE_AUTH);
		} catch (error) {
			console.error('Error signing out:', error);
			alert('Error signing out');
		}
	};

	// Date formatting helpers
	const currentDate = new Date();
	const daysOfWeek: string[] = [
		'Sunday',
		'Monday',
		'Tuesday',
		'Wednesday',
		'Thursday',
		'Friday',
		'Saturday',
	];
	const monthsOfYear: string[] = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December',
	];
	const currentDayOfWeek = daysOfWeek[currentDate.getDay()];
	const currentDay = currentDate.getDate();
	const currentMonth = monthsOfYear[currentDate.getMonth()];

	if (loading) {
		return (
			<View style={styles.loadingContainer}>
				<ActivityIndicator size="large" color="#8B78FF" />
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<View>
					<Text style={styles.dayWeekText}>{currentDayOfWeek}</Text>
					<Text style={styles.dayText}>
						{currentMonth} {currentDay}
					</Text>
				</View>
				<View style={styles.signOutContainer}>
					{avatarUri ? (
						<SvgUri width={50} height={50} uri={avatarUri} />
					) : (
						<Text style={styles.noAvatarText}>No Avatar</Text>
					)}
					<TouchableOpacity onPress={handleSignOut}>
						<Text style={styles.signOutText}>Sign Out</Text>
					</TouchableOpacity>
				</View>
			</View>

			<View>
				<Text style={styles.userName}>Hi, {userData?.name || 'User'}</Text>
				<Text style={styles.dayWeekText}>
					Number of Tasks {userData?.RecentTasks?.length}
				</Text>
			</View>

			<View>
				<Category />
				<RecentTasks />
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingVertical: 65,
		paddingHorizontal: 30,
		backgroundColor: '#F5F5F5',
	},
	loadingContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	dayText: {
		fontSize: 23,
	},
	dayWeekText: {
		fontSize: 16,
		fontWeight: '200',
		color: '#333',
		marginBottom: 10,
	},
	signOutContainer: {
		alignItems: 'center',
	},
	signOutText: {
		color: '#7F56D9',
		fontSize: 16,
		fontWeight: 'bold',
		marginTop: 5,
	},
	noAvatarText: {
		fontSize: 14,
		color: '#666',
	},
	boxContainer: {
		marginTop: 20,
	},
	box: {
		width: '100%',
		height: 100,
		backgroundColor: '#7F56D9',
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 8,
		marginBottom: 10,
	},
	boxText: {
		color: '#fff',
		fontSize: 16,
		fontWeight: 'bold',
	},
	noUserDataText: {
		fontSize: 16,
		color: '#666',
		textAlign: 'center',
		marginTop: 20,
	},
	userName: {
		fontSize: 20,
		marginTop: 15,
	},
});
