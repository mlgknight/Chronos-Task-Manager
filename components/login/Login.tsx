import {
	View,
	Text,
	StyleSheet,
	Image,
	TouchableOpacity,
	ActivityIndicator,
	ScrollView,
	Modal,
	Alert,
} from 'react-native';
import { TextInput } from 'react-native-paper';
import * as React from 'react';
import { useState, useEffect } from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
	signInWithEmailAndPassword,
	sendPasswordResetEmail,
} from 'firebase/auth';
import { FIREBASE_AUTH } from '../../FirebaseConfig';
import { FirebaseError } from 'firebase/app';
import Constants from 'expo-constants';

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
	image,
}: {
	navigation: WelcomeScreenNavigationProp;
	image: string | null;
}) {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const [quote, setQuote] = useState<string | null>(null);
	const [author, setAuthor] = useState<string | null>(null);
	const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
	const [resetEmail, setResetEmail] = useState('');
	const [isSendingReset, setIsSendingReset] = useState(false);

	const auth = FIREBASE_AUTH;
	const quoteApiKey = Constants.expoConfig?.extra?.QUOTE_API_KEY;

	const fetchQuote = async () => {
		try {
			const response = await fetch('https://api.api-ninjas.com/v1/quotes', {
				method: 'GET',
				headers: {
					'X-Api-Key': quoteApiKey,
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
			await signInWithEmailAndPassword(auth, email, password);
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

	const handleForgotPassword = async () => {
		if (!resetEmail) {
			Alert.alert('Error', 'Please enter your email address');
			return;
		}

		setIsSendingReset(true);
		try {
			await sendPasswordResetEmail(auth, resetEmail);
			Alert.alert(
				'Password Reset Sent',
				`A password reset link has been sent to ${resetEmail}. Please check your email.`
			);
			setShowForgotPasswordModal(false);
			setResetEmail('');
		} catch (error: any) {
			console.error('Error sending password reset:', error);
			Alert.alert(
				'Error',
				error.message || 'Failed to send password reset email'
			);
		} finally {
			setIsSendingReset(false);
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
						<TouchableOpacity
							onPress={() => {
								setResetEmail(email);
								setShowForgotPasswordModal(true);
							}}
							style={styles.forgotPasswordButton}
						>
							<Text style={styles.forgotPasswordText}>Forgot Password?</Text>
						</TouchableOpacity>
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
						<Text style={{ color: '#7F56D9', fontWeight: 'bold' }}>
							Sign Up
						</Text>
					</TouchableOpacity>
				</View>

				<Modal
					visible={showForgotPasswordModal}
					animationType="slide"
					transparent={true}
					onRequestClose={() => setShowForgotPasswordModal(false)}
				>
					<View style={styles.modalContainer}>
						<View style={styles.modalContent}>
							<Text style={styles.modalTitle}>Reset Password</Text>
							<Text style={styles.modalText}>
								Enter your email to receive a password reset link
							</Text>
							<TextInput
								placeholder="Email"
								style={styles.modalInput}
								value={resetEmail}
								onChangeText={setResetEmail}
								autoCapitalize="none"
								keyboardType="email-address"
							/>
							<View style={styles.modalButtonContainer}>
								<TouchableOpacity
									style={[styles.modalButton, styles.cancelButton]}
									onPress={() => setShowForgotPasswordModal(false)}
									disabled={isSendingReset}
								>
									<Text style={styles.modalButtonText}>Cancel</Text>
								</TouchableOpacity>
								<TouchableOpacity
									style={[styles.modalButton, styles.resetButton]}
									onPress={handleForgotPassword}
									disabled={isSendingReset}
								>
									{isSendingReset ? (
										<ActivityIndicator size="small" color="#fff" />
									) : (
										<Text style={styles.modalButtonText}>Send Reset</Text>
									)}
								</TouchableOpacity>
							</View>
						</View>
					</View>
				</Modal>
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
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 10,
		width: 342,
		height: 180,
		marginBottom: 20,
		borderRadius: 10,
		borderWidth: 2,
		borderColor: '#4F4789',
	},
	title: {
		fontSize: 30,
		fontFamily: 'Poppins-Bold',
		textAlign: 'center',
		marginBottom: 15,
		color: '#4F4789',
		fontWeight: 'bold',
		textShadowColor: 'rgba(0, 0, 0, 0.2)',
		textShadowOffset: { width: 1, height: 1 },
		textShadowRadius: 2,
	},
	subtitle: {
		fontSize: 18,
		fontFamily: 'Poppins-Regular',
		textAlign: 'center',
		color: '#535862',
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
		color: '#535862',
		marginBottom: 5,
	},
	textInput: {
		width: '100%',
		height: 42,
		borderWidth: 1,
		borderColor: '#535862',
		borderRadius: 8,
		paddingHorizontal: 10,
		backgroundColor: '#fff',
		color: 'black',
	},
	button: {
		width: 342,
		height: 50,
		backgroundColor: '#4F4789',
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
		color: '#D92D20',
		fontSize: 14,
		marginBottom: 5,
		textAlign: 'center',
	},
	forgotPasswordButton: {
		alignSelf: 'flex-end',
		marginTop: 5,
	},
	forgotPasswordText: {
		color: '#7F56D9',
		fontSize: 14,
	},
	modalContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'rgba(0,0,0,0.5)',
	},
	modalContent: {
		width: '80%',
		height: '30%',
		backgroundColor: 'white',
		padding: 20,
		borderRadius: 10,
		elevation: 5,
		justifyContent: 'center',
	},
	modalTitle: {
		fontSize: 20,
		fontWeight: 'bold',
		marginBottom: 10,
		color: '#4F4789',
	},
	modalText: {
		fontSize: 16,
		marginBottom: 20,
		color: '#535862',
	},
	modalInput: {
		width: '100%',
		height: 60,
		borderWidth: 1,
		borderColor: '#535862',
		borderRadius: 5,
		paddingHorizontal: 10,
		marginBottom: 20,
		backgroundColor: '#fff',
	},
	modalButtonContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	modalButton: {
		flex: 1,
		padding: 10,
		borderRadius: 5,
		alignItems: 'center',
		marginHorizontal: 10,
	},
	cancelButton: {
		backgroundColor: '#E0E0E0',
		flex: 1,
		justifyContent: 'center',
	},
	resetButton: {
		backgroundColor: '#4F4789',
	},
	modalButtonText: {
		color: '#fff',
		fontWeight: 'bold',
	},
});
