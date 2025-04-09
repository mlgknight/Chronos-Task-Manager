
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from './home/Home'; // Your Home screen

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={Home} />
    </Tab.Navigator>
  );
}