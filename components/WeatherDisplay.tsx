import {
	StyleSheet,
	Text,
	View,
	ImageBackground,
	Image,
	FlatList,
	ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WeatherData } from '../types';
import WeeklyWeather from '../components/WeeklyWeather';
import { Day, Hour } from '../types';
interface WeatherDisplayProps {
	weatherData: WeatherData | null;
	isNightTime: boolean;
}

export interface ForecastDay {
	day: Day;
	hour: Hour[];
}


const getDayOfWeek = (dateString: number) => {
	const date = new Date(dateString);
	const daysOfWeek = [
		'Monday    ',
		'Tuesday   ',
		'Wednesday',
		'Thursday    ',
		'Friday     ',
		'Saturday',
		'Sunday    ',
	];
	return daysOfWeek[date.getDay()];
};

export default function WeatherDisplay({
	weatherData,
	isNightTime,
}: WeatherDisplayProps) {
	if (!weatherData) {
		return <Text>Loading...</Text>;
	}

	const { location, current, forecast } = weatherData;
	const { day, hour } = forecast.forecastday[0] || { day: {}, hour: [] };

	const lightDarkVariable = isNightTime
		? 'rgba(0, 0, 0, 0.5)'
		: 'rgba(42, 133, 218, 0.5)';
	const lightDarkTextVariable = isNightTime ? 'gray' : 'white';

	return (
		<SafeAreaView style={styles.safeArea}>
			<ScrollView contentContainerStyle={styles.scrollContainer}>
				<View style={styles.container}>
					<View style={styles.main}>
						<Text style={[styles.baseText, styles.title]}>{location.name}</Text>
						<Text style={[styles.baseText, styles.temperature]}>
							{Math.ceil(current.temp_f)}°
						</Text>
						<Text
							style={[
								styles.baseText,
								styles.subtitle,
								{ color: lightDarkTextVariable },
							]}
						>
							Feels like: {Math.ceil(current.feelslike_f)}°
						</Text>
						<View
							style={{
								flexDirection: 'row',
								justifyContent: 'center',
								alignItems: 'center',
								gap: 10,
							}}
						>
							<Image
								source={{ uri: `https:${current.condition.icon}` }}
								style={styles.icon}
							/>
							<Text style={{ fontSize: 22, color: 'white' }}>
								{current.condition.text}
							</Text>
						</View>
						<Text
							style={[
								styles.baseText,
								styles.subtitle,
								{ color: lightDarkTextVariable },
							]}
						>
							H:{Math.ceil(day.maxtemp_f)}° L:{Math.ceil(day.mintemp_f)}°
						</Text>
					</View>

					<View style={[styles.hourly, { backgroundColor: lightDarkVariable }]}>
						<Text style={[styles.hourlyTemp, styles.hourlyTitle]}>
							HOURLY FORECAST
						</Text>
						<FlatList
							data={Array.isArray(hour) ? hour : []}
							renderItem={({ item }) => (
								<View style={styles.hourlyItem}>
									<Text style={styles.hourlyTemp}>
										{new Date(item.time_epoch * 1000).getHours()}:00
									</Text>
									<Image
										source={{ uri: `https:${item.condition.icon}` }}
										style={styles.hourlyIcon}
									/>
									<Text style={styles.hourlyTemp}>
										{Math.ceil(item.temp_f)}°
									</Text>
								</View>
							)}
							keyExtractor={(item) => item.time_epoch.toString()}
							horizontal
							showsHorizontalScrollIndicator={false}
						/>
					</View>

					<WeeklyWeather
						lightDarkVariable={lightDarkVariable}
						forecast={forecast}
						getDayOfWeek={getDayOfWeek}
					/>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}
const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
	},
	background: {
		flex: 1,
		width: '100%',
		height: '100%',
	},
	scrollContainer: {
		flexGrow: 1,
	},
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'flex-start',
		padding: 10,
		paddingTop: 50,
		gap: 20,
	},
	main: {
		justifyContent: 'flex-start',
		maxWidth: 960,
		marginHorizontal: 'auto',
		gap: 10,
	},
	baseText: {
		fontFamily: 'SF Pro Display',
	},
	title: {
		fontSize: 35,
		fontWeight: 'light',
		color: 'white',
		textAlign: 'center',
	},
	temperature: {
		fontSize: 100,
		color: 'white',
		textAlign: 'center',
		fontWeight: '300',
		marginLeft: 40,
	},
	subtitle: {
		fontSize: 25,
		color: 'gray',
		fontWeight: '300',
		textAlign: 'center',
	},
	buttomText: {
		fontSize: 18,
		color: 'gray',
		textAlign: 'center',
	},
	hourly: {
		width: '100%',
		height: 'auto',
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
		borderRadius: 15,
		padding: 20,
		justifyContent: 'center',
	},
	hourlyTitle: {
		fontSize: 13,
		fontWeight: 'bold',
		marginBottom: 10,
		padding: 20,
	},
	hourlyItem: {
		alignItems: 'center',
		marginHorizontal: 12,
	},
	hourlyIcon: {
		width: 50,
		height: 50,
	},
	hourlyTemp: {
		color: 'white',
	},
	daily: {
		width: '100%',
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
		borderRadius: 15,
		padding: 20,
		justifyContent: 'center',
		marginTop: 20,
	},
	dailyTitle: {
		fontSize: 13,
		fontWeight: 'bold',
		marginBottom: 10,
		padding: 20,
	},
	dailyItem: {
		alignItems: 'center',
		marginVertical: 12,
	},
	dailyIcon: {
		width: 50,
		height: 50,
	},
	dailyTemp: {
		color: 'white',
	},
	monoFont: {
		fontFamily: 'Courier',
	},
	flatListContent: {
		paddingBottom: 20,
	},
	icon: {
		width: 40,
		height: 40,
	},
});
