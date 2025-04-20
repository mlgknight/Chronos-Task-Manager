import React, { useEffect, useState } from 'react';
import { AppRegistry, View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Login from '../components/login/Login';
import Signup from '../components/login/Signup';
import HomeTabs from '../components/home/HomeTabs';
import { FIREBASE_AUTH } from '../FirebaseConfig';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { CurrentUser } from '../types';
import { PaperProvider } from 'react-native-paper';

const Stack = createNativeStackNavigator();

export default function App() {
	const [initializing, setInitializing] = useState(true);
	const [user, setUser] = useState<CurrentUser | null>(null);

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
			}
		);

		return () => unsubscribe();
	}, [initializing]);

	const isLoggedIn = !!user;
	console.log('isLoggedIn:', isLoggedIn);

	if (initializing) {
		return (
			<SafeAreaProvider>
				<View
					style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
				>
					<ActivityIndicator size="large" />
				</View>
			</SafeAreaProvider>
		);
	}

	console.log(isLoggedIn);

	return (
		<PaperProvider>
			<SafeAreaProvider>
				<NavigationContainer>
					<Stack.Navigator screenOptions={{ headerShown: false }}>
						{isLoggedIn ? (
							<Stack.Screen name="HomeTabs" component={HomeTabs} />
						) : (
							<>
								<Stack.Screen name="Login" component={Login} />
								<Stack.Screen name="Signup" component={Signup} />
							</>
						)}
					</Stack.Navigator>
				</NavigationContainer>
			</SafeAreaProvider>
		</PaperProvider>
	);
}

AppRegistry.registerComponent('main', () => App);
