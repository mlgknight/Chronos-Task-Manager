import { Text, View, TouchableOpacity, Image, StyleSheet } from 'react-native';

export default function Calender() {
	return (
		<View style={styles.container}>
			<TouchableOpacity style={styles.addButton}>
				<Image style={{ width: 40, height: 40 }} source={require('../../assets/images/Add-Button.png')}></Image>
			</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    addButton: {
        display: 'flex',
        width: 100,
        height: 50,
        backgroundColor: '#4F4789',
        justifyContent: 'center',
        alignContent: 'center',
    }

})
