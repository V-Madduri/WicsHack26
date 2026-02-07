import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  TouchableOpacity,
  SafeAreaView,
  Animated 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export default function FriendsMapScreen({ navigation }) {
  const [vibingNow] = useState([
    {
      id: '1',
      name: 'ALEX',
      image: 'https://i.pravatar.cc/150?img=12',
      isOnline: true,
    },
    {
      id: '2',
      name: 'SARAH',
      image: 'https://i.pravatar.cc/150?img=45',
      isOnline: true,
    },
    {
      id: '3',
      name: 'JORDAN',
      image: 'https://i.pravatar.cc/150?img=33',
      isOnline: true,
    },
  ]);

  const [recentAuras] = useState([
    {
      id: '1',
      name: 'Alex Rivera',
      activity: 'Listening to Tame Impala',
      image: 'https://i.pravatar.cc/150?img=12',
    },
    {
      id: '2',
      name: 'Sarah Chen',
      activity: 'At Brooklyn Mirage',
      image: 'https://i.pravatar.cc/150?img=45',
    },
    {
      id: '3',
      name: 'Jordan Smith',
      activity: 'Exploring NYC',
      image: 'https://i.pravatar.cc/150?img=33',
    },
  ]);

  // Animation values
  const colorAnim1 = useRef(new Animated.Value(0)).current;
  const colorAnim2 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(colorAnim1, {
            toValue: 1,
            duration: 5000,
            useNativeDriver: false,
          }),
          Animated.timing(colorAnim1, {
            toValue: 0,
            duration: 5000,
            useNativeDriver: false,
          }),
        ]),
        Animated.sequence([
          Animated.timing(colorAnim2, {
            toValue: 1,
            duration: 7000,
            useNativeDriver: false,
          }),
          Animated.timing(colorAnim2, {
            toValue: 0,
            duration: 7000,
            useNativeDriver: false,
          }),
        ]),
      ])
    ).start();
  }, []);

  const backgroundColor = colorAnim1.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['#FFE5F0', '#E5F0FF', '#F0E5FF'],
  });

  const overlayColor = colorAnim2.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['rgba(255, 229, 240, 0.4)', 'rgba(229, 240, 255, 0.4)', 'rgba(240, 229, 255, 0.4)'],
  });

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.animatedBackground, { backgroundColor }]}>
        <Animated.View style={[styles.overlay, { backgroundColor: overlayColor }]} />
        
        <View style={styles.header}>
          <View>
            <Text style={styles.networkText}>AURA NETWORK</Text>
            <Text style={styles.socialText}>Social</Text>
          </View>
          <TouchableOpacity style={styles.addButton}>
            <Ionicons name="person-add" size={22} color="#000" />
          </TouchableOpacity>
        </View>

        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.section}>
            <View style={styles.vibingHeader}>
              <View style={styles.greenDot} />
              <Text style={styles.sectionTitle}>VIBING NOW</Text>
            </View>

            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.vibingScroll}
              contentContainerStyle={styles.vibingScrollContent}
            >
              {vibingNow.map((friend) => (
                <TouchableOpacity key={friend.id} style={styles.vibingCard}>
                  <View style={styles.avatarContainer}>
                    <Image 
                      source={{ uri: friend.image }} 
                      style={styles.vibingAvatar}
                    />
                    {friend.isOnline && <View style={styles.onlineDot} />}
                  </View>
                  <Text style={styles.vibingName}>{friend.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>RECENT AURAS</Text>

            {recentAuras.map((aura) => (
              <TouchableOpacity key={aura.id} style={styles.auraCard}>
                <View style={styles.auraLeft}>
                  <Image 
                    source={{ uri: aura.image }} 
                    style={styles.auraAvatar}
                  />
                  <View style={styles.auraInfo}>
                    <Text style={styles.auraName}>{aura.name}</Text>
                    <View style={styles.activityRow}>
                      <Ionicons name="heart" size={14} color="#000" />
                      <Text style={styles.auraActivity}>{aura.activity}</Text>
                    </View>
                  </View>
                </View>
                <TouchableOpacity style={styles.messageButton}>
                  <Ionicons name="chatbubble-outline" size={26} color="#000" />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFE5F0',
  },
  animatedBackground: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 10,
    zIndex: 10,
  },
  networkText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2.5,
    color: '#000',
  },
  socialText: {
    fontSize: 52,
    fontWeight: '300',
    fontStyle: 'italic',
    color: '#000',
    marginTop: -10,
  },
  addButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  section: {
    marginBottom: 35,
    paddingHorizontal: 24,
    zIndex: 10,
  },
  vibingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  greenDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#00FF88',
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 2.5,
    color: '#000',
  },
  vibingScroll: {
    marginLeft: -5,
  },
  vibingScrollContent: {
    paddingRight: 20,
  },
  vibingCard: {
    alignItems: 'center',
    marginRight: 28,
  },
  avatarContainer: {
    position: 'relative',
  },
  vibingAvatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 4,
    borderColor: '#FFF',
  },
  onlineDot: {
    position: 'absolute',
    bottom: 3,
    right: 3,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#00FF88',
    borderWidth: 4,
    borderColor: '#FFF',
  },
  vibingName: {
    fontSize: 13,
    fontWeight: '800',
    marginTop: 10,
    color: '#000',
    letterSpacing: 0.5,
  },
  auraCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 28,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  auraLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  auraAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginRight: 16,
  },
  auraInfo: {
    flex: 1,
  },
  auraName: {
    fontSize: 19,
    fontWeight: '800',
    color: '#000',
    marginBottom: 5,
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  auraActivity: {
    fontSize: 14,
    color: '#000',
    marginLeft: 7,
    fontWeight: '500',
  },
  messageButton: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
});