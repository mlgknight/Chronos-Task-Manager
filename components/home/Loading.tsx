import { View, Text, StyleSheet } from 'react-native';
import * as React from 'react';
import { ActivityIndicator, MD2Colors } from 'react-native-paper';

export default function Loading() {
	return (
		<View style={styles.container}>
			<Text style={styles.title}>Welcome to Chronos</Text>
			<ActivityIndicator animating={true} color={MD2Colors.purple800} />
		</View>
	);
}

const styles = StyleSheet.create({
	title: {
		fontSize: 35,
		fontFamily: 'Poppins-Bold',
		textAlign: 'center',
		marginBottom: 15,
		color: '#4F4789',
		fontWeight: 'bold',
		textShadowColor: 'rgba(0, 0, 0, 0.2)',
		textShadowOffset: { width: 1, height: 1 },
		textShadowRadius: 2,
	},
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
});
