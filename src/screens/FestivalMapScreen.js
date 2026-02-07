import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export default function FestivalMapScreen() {
  const stages = [
    {
      id: '1',
      name: 'Main Stage',
      vibe: 'HYPE',
      color: '#FF4500',
      crowd: 92,
    },
    {
      id: '2',
      name: 'Tito\'s Stage',
      vibe: 'CHILLED',
      color: '#87CEEB',
      crowd: 67,
    },
    {
      id: '3',
      name: 'Honda Stage',
      vibe: 'EUPHORIC',
      color: '#FF69B4',
      crowd: 85,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#FFE5F0', '#F0E5FF', '#E5F0FF']}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.networkText}>SONIC SCOUT</Text>
            <Text style={styles.socialText}>Fest</Text>
          </View>
          <TouchableOpacity style={styles.liveButton}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>LIVE</Text>
          </TouchableOpacity>
        </View>

        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>FESTIVAL VIBES</Text>
            <Text style={styles.subtitle}>Real-time sentiment from the crowd</Text>

            {stages.map((stage) => (
              <TouchableOpacity key={stage.id} style={styles.stageCard}>
                <View style={styles.stageHeader}>
                  <View>
                    <Text style={styles.stageName}>{stage.name}</Text>
                    <View style={styles.vibeRow}>
                      <View style={[styles.vibeIndicator, { backgroundColor: stage.color }]} />
                      <Text style={styles.vibeText}>{stage.vibe}</Text>
                    </View>
                  </View>
                  <Ionicons name="musical-notes" size={32} color={stage.color} />
                </View>

                <View style={styles.crowdMeter}>
                  <Text style={styles.crowdLabel}>CROWD ENERGY</Text>
                  <View style={styles.meterContainer}>
                    <View style={[styles.meterFill, { width: `${stage.crowd}%`, backgroundColor: stage.color }]} />
                  </View>
                  <Text style={styles.crowdPercent}>{stage.crowd}%</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>VIBE MATCH</Text>
            <Text style={styles.subtitle}>Find others feeling your energy</Text>

            <View style={styles.vibeMatchCard}>
              <Ionicons name="people" size={48} color="#FF69B4" />
              <Text style={styles.vibeMatchText}>
                23 people near Main Stage are feeling HYPE right now
              </Text>
              <TouchableOpacity style={styles.connectButton}>
                <Text style={styles.connectText}>CONNECT</Text>
              </TouchableOpacity>
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
    backgroundColor: '#FFE5F0',
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
  liveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF4500',
    marginRight: 8,
  },
  liveText: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.5,
    color: '#000',
  },
  scrollContent: {
    paddingBottom: 120,
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 35,
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
  stageCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  stageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  stageName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#000',
    marginBottom: 8,
  },
  vibeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vibeIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  vibeText: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: '#000',
  },
  crowdMeter: {
    marginTop: 8,
  },
  crowdLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 2,
    color: '#666',
    marginBottom: 8,
  },
  meterContainer: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 6,
  },
  meterFill: {
    height: '100%',
    borderRadius: 4,
  },
  crowdPercent: {
    fontSize: 12,
    fontWeight: '700',
    color: '#000',
    textAlign: 'right',
  },
  vibeMatchCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  vibeMatchText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 20,
  },
  connectButton: {
    backgroundColor: '#FF69B4',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 24,
  },
  connectText: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 2,
    color: '#FFF',
  },
});