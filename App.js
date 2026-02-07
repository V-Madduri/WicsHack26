import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack'; // You'll need this
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet } from 'react-native';

// Import all your screens
import LandingScreen from './src/screens/LandingScreen';
import MusicMapScreen from './src/screens/MusicMapScreen';
import AddPinScreen from './src/screens/AddPinScreen';
import FestivalMapScreen from './src/screens/FestivalMapScreen';
import FriendsMapScreen from './src/screens/FriendsMapScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// 1. Define the Main App (Tabs)
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Explore') iconName = focused ? 'location' : 'location-outline';
          else if (route.name === 'Pin') iconName = focused ? 'add-circle' : 'add-circle-outline';
          else if (route.name === 'Fest') iconName = focused ? 'musical-notes' : 'musical-notes-outline';
          else if (route.name === 'Social') iconName = focused ? 'people' : 'people-outline';
          
          return <Ionicons name={iconName} size={28} color={color} />;
        },
        tabBarActiveTintColor: '#000',
        tabBarInactiveTintColor: '#666',
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabLabel,
        headerShown: false,
      })}
    >
      <Tab.Screen name="Explore" component={MusicMapScreen} options={{ tabBarLabel: 'EXPLORE' }} />
      <Tab.Screen name="Pin" component={AddPinScreen} options={{ tabBarLabel: 'PIN' }} />
      <Tab.Screen name="Fest" component={FestivalMapScreen} options={{ tabBarLabel: 'FEST' }} />
      <Tab.Screen name="Social" component={FriendsMapScreen} options={{ tabBarLabel: 'SOCIAL' }} />
    </Tab.Navigator>
  );
}

// 2. Define the Root Stack
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* This screen shows first */}
        <Stack.Screen name="Landing" component={LandingScreen} />
        
        {/* Once you swipe up, you enter this "Main" group */}
        <Stack.Screen name="Main" component={MainTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderTopWidth: 0,
    height: 90,
    paddingBottom: 30,
    paddingTop: 10,
    position: 'absolute',
    borderTopLeftRadius: 30, 
    borderTopRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 10,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
});