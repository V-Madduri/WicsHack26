import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export default function MusicMapScreen() {
  const [pins] = useState([
    {
      id: '1',
      song: 'Tame Impala',
      location: 'PCL Library',
      sentiment: 'nostalgic',
      image: 'https://i.pravatar.cc/150?img=8',
    },
    {
      id: '2',
      song: 'Glass Animals',
      location: 'Zilker Park',
      sentiment: 'euphoric',
      image: 'https://i.pravatar.cc/150?img=20',
    },
    {
      id: '3',
      song: 'Khruangbin',
      location: 'Barton Springs',
      sentiment: 'chilled',
      image: 'https://i.pravatar.cc/150?img=15',
    },
  ]);

  const getSentimentColor = (sentiment) => {
    const colors = {
      euphoric: '#FF69B4',
      chilled: '#87CEEB',
      hype: '#FF4500',
      nostalgic: '#FFD700'
    };
    return colors[sentiment] || '#808080';
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#E5F0FF', '#FFE5F0', '#F0FFE5']}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.networkText}>SONIC SCOUT</Text>
            <Text style={styles.socialText}>Explore</Text>
          </View>
          <TouchableOpacity style={styles.searchButton}>
            <Ionicons name="search" size={22} color="#000" />
          </TouchableOpacity>
        </View>

        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>YOUR MUSIC MAP</Text>
            <Text style={styles.subtitle}>
              {pins.length} musical memories pinned
            </Text>

            {pins.map((pin) => (
              <TouchableOpacity key={pin.id} style={styles.pinCard}>
                <View style={[styles.sentimentBar, { backgroundColor: getSentimentColor(pin.sentiment) }]} />
                <View style={styles.pinContent}>
                  <Image 
                    source={{ uri: pin.image }} 
                    style={styles.pinImage}
                  />
                  <View style={styles.pinInfo}>
                    <Text style={styles.songName}>{pin.song}</Text>
                    <View style={styles.locationRow}>
                      <Ionicons name="location" size={14} color="#666" />
                      <Text style={styles.locationText}>{pin.location}</Text>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={24} color="#999" />
                </View>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>SENTIMENT LEGEND</Text>
            
            <View style={styles.legendGrid}>
              {[
                { name: 'Euphoric', color: '#FF69B4', icon: 'happy' },
                { name: 'Chilled', color: '#87CEEB', icon: 'snow' },
                { name: 'Hype', color: '#FF4500', icon: 'flame' },
                { name: 'Nostalgic', color: '#FFD700', icon: 'time' },
              ].map((item) => (
                <View key={item.name} style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: item.color }]}>
                    <Ionicons name={item.icon} size={16} color="#FFF" />
                  </View>
                  <Text style={styles.legendText}>{item.name}</Text>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E5F0FF',
  },
  gradient: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 10,
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
  searchButton: {
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
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 2.5,
    color: '#000',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    fontWeight: '500',
  },
  pinCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 20,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  sentimentBar: {
    height: 4,
    width: '100%',
  },
  pinContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  pinImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 16,
  },
  pinInfo: {
    flex: 1,
  },
  songName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#000',
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
    fontWeight: '500',
  },
  legendGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
    marginBottom: 16,
  },
  legendDot: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  legendText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000',
  },
});