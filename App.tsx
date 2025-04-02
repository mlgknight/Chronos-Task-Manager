import React from 'react';
import { AppRegistry } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Login from './components/login/Login';
import Signup from './components/login/Signup'
import Weather from './components/Weather';

const Stack = createNativeStackNavigator();

export default function App() {
	return (
		<SafeAreaProvider>
			<NavigationContainer>
				<Stack.Navigator initialRouteName="Login">
					<Stack.Screen
						name="Login"
						component={Login}
						options={{ headerShown: false }}
					/>
					<Stack.Screen
						name="Weather"
						component={Weather}
						options={{ headerShown: false }}
					/>
										<Stack.Screen
						name="Signup"
						component={Signup}
						options={{ headerShown: false }}
					/>
				</Stack.Navigator>
			</NavigationContainer>
		</SafeAreaProvider>
	);
}

AppRegistry.registerComponent('main', () => App);
