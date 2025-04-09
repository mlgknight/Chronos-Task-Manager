import {
	View,
	Text,
	StyleSheet,
	Image,
	TextInput,
	TouchableOpacity,
	ActivityIndicator,
	ScrollView,
	StatusBar,
} from 'react-native';

import { useState, useEffect } from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { FIREBASE_AUTH } from '../../FirebaseConfig';
import { FirebaseError } from 'firebase/app';
import AsyncStorage from '@react-native-async-storage/async-storage';

type RootStackParamList = {
	Login: undefined;
	HomeTabs: undefined;
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
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const [image, setImage] = useState<string | null>(null);
	const [quote, setQuote] = useState<string | null>(null);
	const [author, setAuthor] = useState<string | null>(null);

	const auth = FIREBASE_AUTH;


	const fetchImage = async () => {
		try {
			const response = await fetch(
				'https://apis.scrimba.com/unsplash/photos/random?orientation=landscape&query=nature'
			);

			if (!response.ok) {
				throw new Error('Failed to fetch image');
			}

			const data = await response.json();
			setImage(data.urls.regular || null); // Set the fetched image URL
		} catch (error) {
			console.error('Error fetching image:', error);
			setImage(welcome_photo); // Fallback to no image
		}
	};

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

			if (data[0]?.quote && data[0].quote.length <= 200) {
				setQuote(data[0].quote || 'No quote found');
				setAuthor(data[0].author || 'Unknown');
			} else {
				setQuote(
					'If I Try, I Fail. If I Do not Try, I am Never Going To Get It.'
				);
				setAuthor('Aang');
			}
		} catch (error) {
			console.error('Error fetching quote:', error);
			setQuote('Failed to load quote');
			setAuthor('');
		}
	};

	useEffect(() => {
		fetchImage();
		fetchQuote();
	}, []);

	const handleSignIn = async () => {
		setLoading(true);
		setError('');

		if (email.length === 0) {
			setError('Email field cannot be empty.');
			setLoading(false);
			return;
		}

		if (password.length === 0) {
			setError('Password field cannot be empty.');
			setLoading(false);
			return;
		}

		try {
			const userCredential = await signInWithEmailAndPassword(
				auth,
				email,
				password
			);
		} catch (error: unknown) {
			if (error instanceof FirebaseError) {
				if (error.code === 'auth/invalid-email') {
					setError('The email address is not valid.');
				} else if (error.code === 'auth/user-disabled') {
					setError('This user account has been disabled.');
				} else if (error.code === 'auth/user-not-found') {
					setError('No user found with this email.');
				} else if (error.code === 'auth/wrong-password') {
					setError('Incorrect password. Please try again.');
				} else {
					setError('Your email or password is incorrect.');
				}
			} else if (error instanceof Error) {
				setError(error.message || 'An unknown error occurred.');
			} else {
				setError('An unknown error occurred.');
			}
		} finally {
			setLoading(false);
		}
	};


	return (
		<ScrollView>
			<View style={styles.container}>
				<Image
					style={styles.image}
					source={image ? { uri: image } : welcome_photo}
				/>
				<Text style={styles.title}>Welcome to Chronos</Text>
				<Text style={styles.subtitle}>
					{quote || 'Fetching a dose of motivation for you...'}
				</Text>
				<Text style={styles.subtitle}>
					- {author || 'An Unknown Visionary'}
				</Text>
				<View>
					<View style={styles.inputContainer}>
						<Text style={styles.errorText}>{error}</Text>
						<Text style={styles.label}>Email</Text>
						<TextInput
							placeholder="Enter your email"
							style={styles.textInput}
							placeholderTextColor="#aaa"
							value={email}
							onChangeText={setEmail}
							autoCapitalize={'none'}
						/>
					</View>
					<View style={styles.inputContainer}>
						<Text style={styles.label}>Password</Text>
						<TextInput
							placeholder="Enter your Password"
							style={styles.textInput}
							placeholderTextColor="#aaa"
							secureTextEntry
							value={password}
							onChangeText={setPassword}
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
						<Text style={{ color: '#8B78FF', fontWeight: 'bold' }}>
							Sign Up
						</Text>
					</TouchableOpacity>
				</View>
			</View>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 5,
		marginVertical: 70,
		gap: 1,
		margin: 20,
	},
	image: {
		width: 342,
		height: 180,
		marginBottom: 20,
		borderRadius: 10,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.3,
		shadowRadius: 5,
		elevation: 5,
		borderWidth: 2,
		borderColor: '#8B78FF',
	},
	title: {
		fontSize: 30,
		fontFamily: 'Poppins-Bold',
		textAlign: 'center',
		marginBottom: 15,
		color: '#8B78FF',
		fontWeight: 'bold',
		textShadowColor: 'rgba(0, 0, 0, 0.2)',
		textShadowOffset: { width: 1, height: 1 },
		textShadowRadius: 2,
	},
	subtitle: {
		fontSize: 18,
		fontFamily: 'Poppins-Regular',
		textAlign: 'center',
		color: '#555',
		fontStyle: 'italic',
		marginBottom: 10,
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
		backgroundColor: '#8B78FF',
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
		marginTop: 7,
		gap: 5,
	},
	errorText: {
		color: 'red',
		fontSize: 14,
		marginBottom: 5,
		textAlign: 'center',
	},
});
