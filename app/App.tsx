import React, { useEffect, useState } from 'react';
import { AppRegistry, View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Login from '../components/login/Login';
import Signup from '../components/login/Signup';
import HomeTabs from '../components/home/HomeTabs';
import Loading from '../components/home/Loading';
import { FIREBASE_AUTH } from '../FirebaseConfig';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { CurrentUser } from '../types';
import { PaperProvider } from 'react-native-paper';
import { UserDataProvider } from '../hooks/UserDataContext';

const welcome_photo = require('../assets/images/welcome_photo.jpg');
const Stack = createNativeStackNavigator();

export default function App() {
	const [initializing, setInitializing] = useState(true);
	const [user, setUser] = useState<CurrentUser | null>(null);
	const [image, setImage] = useState<string | null>(welcome_photo);

	const fetchImage = async () => {
		try {
			const response = await fetch(
				'https://apis.scrimba.com/unsplash/photos/random?orientation=landscape&query=nature'
			);

			if (!response.ok) {
				throw new Error('Failed to fetch image');
			}

			const data = await response.json();
			setImage(data.urls.regular || null);
		} catch (error) {
			console.error('Error fetching image:', error);
			setImage(welcome_photo);
		}
	};

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(
			FIREBASE_AUTH,
			(currentUser: FirebaseUser | null) => {
				if (currentUser) {
					const formattedUser: CurrentUser = {
						DisplayName: currentUser.displayName ?? '',
						Email: currentUser.email ?? '',
						uid: currentUser.uid,
					};
					setUser(formattedUser);
				} else {
					setUser(null);
				}

				if (initializing) {
					setInitializing(false);
				}
				fetchImage();
			}
		);

		return () => unsubscribe();
	}, []);

	if (!image || initializing) {
		return <Loading />;
	}

	user && console.log(user);

	const isLoggedIn = !!user;

	return (
		<UserDataProvider>
			<PaperProvider>
				<SafeAreaProvider>
					<NavigationContainer>
						<Stack.Navigator screenOptions={{ headerShown: false }}>
							{isLoggedIn ? (
								<Stack.Screen name="HomeTabs" component={HomeTabs} />
							) : (
								<>
									<Stack.Screen
										name="Login"
										children={(props) => <Login {...props} image={image} />}
									/>
									<Stack.Screen name="Signup" component={Signup} />
								</>
							)}
						</Stack.Navigator>
					</NavigationContainer>
				</SafeAreaProvider>
			</PaperProvider>
		</UserDataProvider>
	);
}

AppRegistry.registerComponent('main', () => App);
