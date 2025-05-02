export interface Location {
	name: string;
	region: string;
	country: string;
	lat: number;
	lon: number;
	tz_id: string;
	localtime_epoch: number;
	localtime: string;
}

export interface Condition {
	text: string;
	icon: string;
	code: number;
}

export interface Current {
	temp_f: number;
	feelslike_f: number;
	condition: Condition;
}

export interface Day {
	maxtemp_f: number;
	mintemp_f: number;
	condition: any;
}

export interface Hour {
    temp_f: number;
    time: string;
    condition: {
        icon: string;
    }
}

export interface ForecastDay {
	date: string;
	date_epoch: number;
	day: Day;
    hour: Hour;
}

export interface Forecast {
	forecastday: ForecastDay[];
}


export interface WeatherData {
	location: Location;
	current: Current;
	forecast: Forecast;
}

export interface Task {
	id: string;
	task: string;
	timeStamp: string;
}

export interface Category {
    id: string;
    tasks: Task[];
    name: string;
    color: string;
	timeStamp: string;
}

export interface UserData {
	name: string;
	email: string;
	photoURL: string;
	avatarSvg: string;
	categories?: Category[];
	RecentTasks?: Task[];
	id: string;
	createdAt?: number;
}

export interface CurrentUser {
	DisplayName: string;
	Email: string;
	uid: string;
}
export interface RecentTask {
    task: string;
    id: string | number;
}

export interface RecentTasksProps {
    RecentTasks?: Task[];
}

export interface CategoryProps {
    categories?: Category[];
}