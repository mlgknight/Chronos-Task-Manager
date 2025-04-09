import React, { useState } from 'react';
import {
	View,
	Text,
	StyleSheet,
	TextInput,
	TouchableOpacity,
	ActivityIndicator,
	ScrollView,
	Image,
	Button,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { FIREBASE_AUTH, FIRE_STORE } from '../../FirebaseConfig';
import { doc, setDoc } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';

type RootStackParamList = {
	Login: undefined;
	HomeTabs: undefined;
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
	const [name, setName] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [image, setImage] = useState<string | null>(null); // State for profile picture

	const Camera_icon = require('../../assets/images/Camera_icon.png');

	const handleSignUp = async () => {
		if (password !== passwordConfirm) {
			setError('Passwords do not match!');
			return;
		}

		setLoading(true);
		try {
			const userCredential = await createUserWithEmailAndPassword(
				FIREBASE_AUTH,
				email,
				password
			);

			await updateProfile(userCredential.user, {
				displayName: name,
				photoURL: image || '', // Save the profile picture URL
			});

			await setDoc(doc(FIRE_STORE, 'users', userCredential.user.uid), {
				name,
				email,
				photoURL: image || '',
				createdAt: new Date().toISOString(),
			});

			navigation.navigate('HomeTabs');
		} catch (error: any) {
			if (error.code === 'auth/email-already-in-use') {
				setError('That email address is already in use!');
			} else if (error.code === 'auth/invalid-email') {
				setError('That email address is invalid!');
			} else if (error.code === 'auth/weak-password') {
				setError('The password is too weak!');
			} else {
				setError('Error signing up: ' + error.message);
			}
		} finally {
			setLoading(false);
		}
	};

	const pickImage = async () => {
		try {
			const permissionResult =
				await ImagePicker.requestMediaLibraryPermissionsAsync();

			if (!permissionResult.granted) {
				alert('Permission to access the camera roll is required!');
				return;
			}

			const result = await ImagePicker.launchImageLibraryAsync({
				mediaTypes: ImagePicker.MediaTypeOptions.Images,
				allowsEditing: true,
				aspect: [1, 1],
				quality: 1,
			});

			if (!result.canceled) {
				setImage(result.assets[0].uri);
			}
		} catch (error) {
			console.error('Error picking image:', error);
			alert('An error occurred while picking the image.');
		}
	};

	return (
		<ScrollView>
			<View style={styles.container}>
				{error && <Text style={styles.errorText}>{error}</Text>}
				<View style={styles.inputContainer}>
					<Text style={styles.label}>Name</Text>
					<TextInput
						placeholder="Enter your name"
						style={styles.textInput}
						placeholderTextColor="#aaa"
						value={name}
						onChangeText={setName}
					/>
				</View>
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
					<TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
						{image ? (
							<Image source={{ uri: image }} style={styles.profileImage} />
						) : (
							<>
								<Text style={styles.label}>Add Profile Picture</Text>
								<Image style={styles.cameraIcon} source={Camera_icon}></Image>
							</>
						)}
					</TouchableOpacity>
				</View>
				<TouchableOpacity
					style={styles.button}
					onPress={handleSignUp}
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
						<Text style={{ color: '#8B78FF', fontWeight: 'bold' }}>Log In</Text>
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
		padding: 20,
		gap: 10,
		margin: 40,
	},
	imagePicker: {
		width: 150,
		height: 150,
		borderRadius: 75,
		backgroundColor: '#f0f0f0',
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: 10,
		marginTop: 10,
	},
	imagePickerText: {
		color: 'white',
		borderRadius: 10,
		fontSize: 20,
		width: 150,
		height: 55,
		textAlign: 'center',
		backgroundColor: '#8B78FF',
	},
	profileImage: {
		width: 150,
		height: 150,
		borderRadius: 75,
	},
	inputContainer: {
		width: 342,
		marginBottom: 20,
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
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
	errorText: {
		color: 'red',
		fontSize: 14,
		marginBottom: 10,
	},
	SignUp: {
		display: 'flex',
		flexDirection: 'row',
		gap: 5,
		marginTop: 20,
	},
	cameraIcon: {
		width: 80,
		height: 80,
	}
});
