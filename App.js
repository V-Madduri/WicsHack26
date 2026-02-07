import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import MusicMapScreen from './src/screens/MusicMapScreen';
import AddPinScreen from './src/screens/AddPinScreen';
import FestivalMapScreen from './src/screens/FestivalMapScreen';
import FriendsMapScreen from './src/screens/FriendsMapScreen';
import { View, StyleSheet } from 'react-native';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
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
          tabBarShowLabel: true,
          headerShown: false,
        })}
      >
        <Tab.Screen 
          name="Explore" 
          component={MusicMapScreen}
          options={{ tabBarLabel: 'EXPLORE' }}
        />
        <Tab.Screen 
          name="Pin" 
          component={AddPinScreen}
          options={{ tabBarLabel: 'PIN' }}
        />
        <Tab.Screen 
          name="Fest" 
          component={FestivalMapScreen}
          options={{ tabBarLabel: 'FEST' }}
        />
        <Tab.Screen 
          name="Social" 
          component={FriendsMapScreen}
          options={{ tabBarLabel: 'SOCIAL' }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderTopWidth: 0,
    height: 90,
    paddingBottom: 25,
    paddingTop: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    position: 'absolute',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    marginTop: 4,
  },
});