import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Avatar } from 'react-native-paper';
import { doc, getDoc } from 'firebase/firestore';
import { signOut, onAuthStateChanged, User } from 'firebase/auth';
import { FIRE_STORE, FIREBASE_AUTH } from '../../FirebaseConfig';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { UserData } from '../../types';

type RootStackParamList = {
  Login: undefined;
  Home: undefined;
};

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

type Props = {
  navigation: HomeScreenNavigationProp;
};

export default function Home({ navigation }: Props) {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, async (user) => {
      setFirebaseUser(user);
      if (user) {
        await fetchUserData(user.uid);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [navigation]);

  const fetchUserData = async (userId: string) => {
    try {
      const userDocRef = doc(FIRE_STORE, 'users', userId);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const data = userDoc.data() as UserData;
        setUserData(data);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(FIREBASE_AUTH);
    } catch (error) {
      console.error('Error signing out:', error);
      alert('Error signing out');
    }
  };

  // Date formatting helpers
  const currentDate = new Date();
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const monthsOfYear = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const currentDayOfWeek = daysOfWeek[currentDate.getDay()];
  const currentDay = currentDate.getDate();
  const currentMonth = monthsOfYear[currentDate.getMonth()];

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8B78FF" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.dayText}>{currentDayOfWeek}</Text>
          <Text style={styles.dayText}>{currentMonth} {currentDay}</Text>
        </View>

        <View style={styles.signOutContainer}>
          <Avatar.Image
            size={50}
            style={{ marginHorizontal: 5 }}
            source={
              userData?.photoURL
                ? { uri: userData.photoURL }
                : require('../../assets/images/icon.png')
            }
          />
          <TouchableOpacity onPress={handleSignOut}>
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.boxContainer}>
        {userData ? (
          <View style={styles.box}>
            <Text style={styles.boxText}>Welcome, {userData.name}!</Text>
          </View>
        ) : (
          <Text style={styles.noUserDataText}>No user data available</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 65,
    paddingHorizontal: 30,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    gap: 10,
  },
  dayText: {
    fontSize: 13,
    fontWeight: '200',
    color: '#333',
    marginBottom: 10,
  },
  signOutContainer: {
    gap: 10,
    alignItems: 'center',
  },
  signOutText: {
    color: '#8B78FF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  boxContainer: {
    marginTop: 20,
  },
  box: {
    width: '100%',
    height: 100,
    backgroundColor: '#8B78FF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 10,
  },
  boxText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  noUserDataText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
});