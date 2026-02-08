import React, { useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Dimensions, 
  Animated, 
  PanResponder, 
  Platform 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { height } = Dimensions.get('window');

export default function LandingScreen({ navigation }) {
  // Animation value for the vertical slide
  const translateY = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Only respond if the swipe is upward and significant
        return Math.abs(gestureState.dy) > 20;
      },
      onPanResponderMove: (_, gestureState) => {
        // Only allow upward movement (negative DY)
        if (gestureState.dy < 0) {
          translateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy < -150) {
          // If swiped up far enough, slide away and navigate
          Animated.timing(translateY, {
            toValue: -height,
            duration: 300,
            useNativeDriver: true,
          }).start(() => {
            navigation.replace('Main'); // Or 'Home' depending on your route name
          });
        } else {
          // Reset if not swiped far enough
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  return (
    <View style={styles.container}>
      <Animated.View 
        style={[styles.content, { transform: [{ translateY }] }]}
        {...panResponder.panHandlers}
      >
        <LinearGradient colors={['#FCE4EC', '#F28482']} style={styles.gradient}>
          <View style={styles.centerContent}>
            <MaterialCommunityIcons name="pulse" size={80} color="#FFF" />
            <Text style={styles.networkText}>ATLAST</Text>
            <Text style={styles.tagline}>your world, synchronized.</Text>
          </View>

          <View style={styles.footer}>
            <MaterialCommunityIcons name="chevron-double-up" size={30} color="#FFF" />
            <Text style={styles.swipeText}>swipe up to enter</Text>
          </View>
        </LinearGradient>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#E3F2FD' },
  content: { flex: 1 },
  gradient: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  centerContent: { alignItems: 'center' },
  networkText: { 
    fontSize: 42, 
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif', 
    color: '#FFF', 
    fontStyle: 'italic',
    marginTop: 10 
  },
  tagline: { 
    fontSize: 12, 
    fontWeight: '700', 
    letterSpacing: 2, 
    color: 'rgba(255,255,255,0.8)', 
    marginTop: 5,
    textTransform: 'uppercase'
  },
  footer: { position: 'absolute', bottom: 50, alignItems: 'center' },
  swipeText: { 
    color: '#FFF', 
    fontSize: 10, 
    fontWeight: '900', 
    letterSpacing: 3, 
    marginTop: 10,
    textTransform: 'uppercase'
  }
});