import React, { useState } from 'react';
import {
	View,
	Text,
	StyleSheet,
	TextInput,
	TouchableOpacity,
	ActivityIndicator,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { FIREBASE_AUTH } from '../../FirebaseConfig';

type RootStackParamList = {
	Login: undefined;
	Weather: undefined;
};

type SignupScreenNavigationProp = NativeStackNavigationProp<
	RootStackParamList,
	'Login'
>;

export default function Signup({
	navigation,
}: {
	navigation: SignupScreenNavigationProp;
}) {

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
	const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');


	const handleSignUp = async () => {
		setLoading(true);
		try {

			const userCredential = await createUserWithEmailAndPassword(
				FIREBASE_AUTH,
				email,
				password
			);
			console.log('User signed up:', userCredential.user);

			navigation.navigate('Weather');
		} catch (error: any) {
			// Handle Firebase errors
			if (error.code === 'auth/email-already-in-use') {
				setError('That email address is already in use!');
			} else if (error.code === 'auth/invalid-email') {
				setError('That email address is invalid!');
			} else if (error.code === 'auth/weak-password') {
				setError('The password is too weak!');
			} else {
				setError('Error signing up:');
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<View style={styles.container}>
            {error && <Text style={styles.label}>{error}</Text>}
			<View style={styles.inputContainer}>
				<Text style={styles.label}>Email</Text>
				<TextInput
					placeholder="Enter your email"
					style={styles.textInput}
					placeholderTextColor="#aaa"
					value={email}
					onChangeText={setEmail}
					autoCapitalize="none"
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
			<View style={styles.inputContainer}>
				<Text style={styles.label}>Confirm Password</Text>
				<TextInput
					placeholder="Confirm your Password"
					style={styles.textInput}
					placeholderTextColor="#aaa"
					secureTextEntry
					value={passwordConfirm}
					onChangeText={setPasswordConfirm}
				/>
			</View>
			<TouchableOpacity
				style={styles.button}
				onPress={() =>password === passwordConfirm ? handleSignUp : setError('Passwords do not match')}
				disabled={loading}
			>
				{loading ? (
					<ActivityIndicator size="small" color="#fff" />
				) : (
					<Text style={styles.buttonText}>Sign Up</Text>
				)}
			</TouchableOpacity>
			<View style={styles.SignUp}>
				<Text>Already have an account?</Text>
				<TouchableOpacity onPress={() => navigation.navigate('Login')}>
					<Text style={{ color: '#007BFF', fontWeight: 'bold' }}>Log In</Text>
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
		marginTop: 20,
	},
});
