
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from './Home';
const Tab = createBottomTabNavigator();

 export default function HomeTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Home" component={Home} />
    </Tab.Navigator>
  );
}