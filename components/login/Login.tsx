import {
	View,
	Text,
	StyleSheet,
	Image,
	TextInput,
	TouchableOpacity,
	ActivityIndicator,
} from 'react-native';

import { useEffect, useState } from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { FIREBASE_AUTH } from '../../FirebaseConfig';
import { FirebaseError } from 'firebase/app';

type RootStackParamList = {
	Login: undefined;
	Weather: undefined;
	Signup: undefined;
};

type WelcomeScreenNavigationProp = NativeStackNavigationProp<
	RootStackParamList,
	'Login'
>;

const welcome_photo = require('../../assets/images/welcome_photo.jpg');

export default function Login({
	navigation,
}: {
	navigation: WelcomeScreenNavigationProp;
}) {

	const [quote, setQuote] = useState<string | null>(null);
	const [author, setAuthor] = useState<string | null>(null);


	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);


	const auth = FIREBASE_AUTH;


	const fetchQuote = async () => {
		try {
			const response = await fetch('https://api.api-ninjas.com/v1/quotes', {
				method: 'GET',
				headers: {
					'X-Api-Key': 'qJqnAqe25hYBNvlfy66YKw==chuvmY1r4j6Fwm6M',
				},
			});

			if (!response.ok) {
				throw new Error('Failed to fetch quote');
			}

			const data = await response.json();
			setQuote(data[0].quote || 'No quote found');
			setAuthor(data[0].author);
		} catch (error) {
			console.log('Error fetching quote:', error);
		}
	};


	const handleSignIn = async () => {
		setLoading(true); // Start loading
		try {
			const userCredential = await signInWithEmailAndPassword(
				auth,
				email,
				password
			);
			console.log('User signed in:', userCredential.user);
			navigation.navigate('Weather');
		} catch (error: unknown) {

			if (error instanceof FirebaseError) {
				console.error('Firebase error code:', error.code);
				console.error('Firebase error message:', error.message);
			} else if (error instanceof Error) {
				console.error('General error message:', error.message);
			} else {
				console.error('Unknown error:', error);
			}
		} finally {
			setLoading(false);
		}
	};

	const handleSignOut = async () => {
		try {
			await auth.signOut();
			console.log('User signed out');
		}
		catch (error: unknown) {

			if (error instanceof FirebaseError) {
				console.error('Firebase error code:', error.code);
				console.error('Firebase error message:', error.message);
			} else if (error instanceof Error) {
				console.error('General error message:', error.message);
			} else {
				console.error('Unknown error:', error);
			}
		} finally {
			setLoading(false);
		}
	};


	useEffect(() => {
		fetchQuote();
	}, []);

	return (
		<View style={styles.container}>
			<Image style={styles.image} source={welcome_photo} />
			<Text style={styles.title}>Welcome to the Daily Driver</Text>
			<Text style={styles.subtitle}>{quote || 'Loading quote...'}</Text>
			<Text style={styles.subtitle}>- {author || 'Loading author...'}</Text>
			<View>
				<View style={styles.inputContainer}>
					<Text style={styles.label}>Email</Text>
					<TextInput
						placeholder="Enter your email"
						style={styles.textInput}
						placeholderTextColor="#aaa"
						value={email}
						onChangeText={setEmail} // Update email state
						autoCapitalize={'none'}
					/>
				</View>
				<View style={styles.inputContainer}>
					<Text style={styles.label}>Password</Text>
					<TextInput
						placeholder="Enter your Password"
						style={styles.textInput}
						placeholderTextColor="#aaa"
						secureTextEntry // Hide password input
						value={password}
						onChangeText={setPassword} // Update password state
					/>
				</View>
				<TouchableOpacity
					style={styles.button}
					onPress={handleSignIn}
					disabled={loading}
				>
					{loading ? (
						<ActivityIndicator size="small" color="#fff" />
					) : (
						<Text style={styles.buttonText}>Sign In</Text>
					)}
				</TouchableOpacity>
			</View>
			<View style={styles.SignUp}>
				<Text>You don't have an account?</Text>
				<TouchableOpacity onPress={() => navigation.navigate('Signup')}>
					<Text style={{ color: '#007BFF', fontWeight: 'bold' }}>Sign Up</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 20,
		gap: 10,
		margin: 20,
	},
	image: {
		width: 342,
		height: 180,
		marginBottom: 20,
		borderRadius: 10,
	},
	title: {
		fontSize: 24,
		fontFamily: 'SFProDisplay-Bold',
		textAlign: 'center',
		marginBottom: 10,
	},
	subtitle: {
		fontSize: 16,
		fontFamily: 'SFProDisplay-Regular',
		textAlign: 'center',
		color: '#555',
	},
	inputContainer: {
		width: 342,
		marginBottom: 20,
	},
	label: {
		fontSize: 14,
		fontFamily: 'SFProDisplay-Regular',
		color: '#555',
		marginBottom: 5,
	},
	textInput: {
		width: '100%',
		height: 42,
		borderWidth: 1,
		borderColor: '#ccc',
		borderRadius: 8,
		paddingHorizontal: 10,
		backgroundColor: '#fff',
		color: 'black',
	},
	button: {
		width: 342,
		height: 50,
		backgroundColor: '#007BFF',
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 8,
		marginTop: 10,
	},
	buttonText: {
		fontSize: 16,
		fontFamily: 'SFProDisplay-Bold',
		color: '#fff',
	},
	SignUp: {
		display: 'flex',
		flexDirection: 'row',
		gap: 5,
	}
});
