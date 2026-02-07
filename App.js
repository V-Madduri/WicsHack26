import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import MusicMapScreen from './src/screens/MusicMapScreen';
import AddPinScreen from './src/screens/AddPinScreen';
import FestivalMapScreen from './src/screens/FestivalMapScreen';
import FriendsMapScreen from './src/screens/FriendsMapScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === 'My Map') iconName = 'map';
            else if (route.name === 'Add Pin') iconName = 'add-circle';
            else if (route.name === 'Festival') iconName = 'flame';
            else if (route.name === 'Friends') iconName = 'people';
            
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#FF69B4',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen name="My Map" component={MusicMapScreen} />
        <Tab.Screen name="Add Pin" component={AddPinScreen} />
        <Tab.Screen name="Festival" component={FestivalMapScreen} />
        <Tab.Screen name="Friends" component={FriendsMapScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}