import * as React from 'react';
import { BottomNavigation } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import Home from '../home/Home';
import Setting from '../home/Setting';
import Profile from './Profile';
import TaskPage from './TaskPage';
import { Image } from 'react-native';

const icons = {
  home: require('../../assets/images/NavIcons/home.png'),
  homeActive: require('../../assets/images/NavIcons/home_active.png'),
  settings: require('../../assets/images/NavIcons/setting.png'),
  settingsActive: require('../../assets/images/NavIcons/settings_active.png'),
  profile: require('../../assets/images/NavIcons/avatar.png'),
  profileActive: require('../../assets/images/NavIcons/avatar_active.png'),
  task: require('../../assets/images/NavIcons/task.png'),
  taskActive: require('../../assets/images/NavIcons/task_active.png'),
};

const HomeTabs = () => {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { 
      key: 'home', 
      title: 'Home',
      focusedIcon: () => <Image source={icons.homeActive} style={styles.icon} />,
      unfocusedIcon: () => <Image source={icons.home} style={styles.icon} />,
    },
    { 
      key: 'taskPage', 
      title: 'Tasks',
      focusedIcon: () => <Image source={icons.taskActive} style={styles.icon} />,
      unfocusedIcon: () => <Image source={icons.task} style={styles.icon} />,
    },
    { 
      key: 'profile', 
      title: 'Profile',
      focusedIcon: () => <Image source={icons.profileActive} style={styles.icon} />,
      unfocusedIcon: () => <Image source={icons.profile} style={styles.icon} />,
    },
    { 
      key: 'settings', 
      title: 'Settings',
      focusedIcon: () => <Image source={icons.settingsActive} style={styles.icon} />,
      unfocusedIcon: () => <Image source={icons.settings} style={styles.icon} />,
    },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    home: Home,
    taskPage: TaskPage,
    profile: Profile,
    settings: Setting,
  });

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
      barStyle={{ backgroundColor: 'white' }} 
      activeColor="#4F4789"
      inactiveColor="gray"
    />
  );
};

const styles = StyleSheet.create({
  icon: {
    width: 24,
    height: 24,
  },
});

export default HomeTabs;