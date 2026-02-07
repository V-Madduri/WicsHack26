import React, { useRef, useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView,
  ScrollView, 
  TouchableOpacity,
  Platform,
  Animated,
  Modal
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export default function FestivalExploreScreen() {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  
  // State for Modal
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState(''); // 'details' or 'tickets'
  const [selectedFest, setSelectedFest] = useState(null);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.1, duration: 2000, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 2000, useNativeDriver: true }),
      ])
    ).start();
  }, [pulseAnim]);

  const festivals = [
    {
      id: '1',
      name: 'Aura Fest 2026',
      date: 'AUG 12-14',
      location: 'Brooklyn Mirage',
      tag: 'HOTTEST',
      color: '#F28482',
      description: 'A 3-day immersive experience featuring the world’s leading melodic techno artists under the stars of Brooklyn.',
      price: '$149.00'
    },
    {
      id: '2',
      name: 'Electric Sky',
      date: 'SEP 05-07',
      location: 'Zilker Park',
      tag: 'TRENDING',
      color: '#84A59D',
      description: 'The ultimate open-air electronic gathering in the heart of Austin, known for its massive light shows and high energy.',
      price: '$125.00'
    },
    {
      id: '3',
      name: 'Neon Garden',
      date: 'OCT 21-23',
      location: 'Echo Park',
      tag: 'CHILL VIBES',
      color: '#9B86BD',
      description: 'An intimate garden setting focusing on lo-fi, house, and experimental jazz beats. Pure vibes only.',
      price: '$89.00'
    },
  ];

  const openModal = (type, fest) => {
    setModalType(type);
    setSelectedFest(fest);
    setModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#FCE4EC', '#E3F2FD']} style={styles.gradient}>
        
        {/* Dynamic Popup Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <TouchableOpacity 
                style={styles.closeIcon} 
                onPress={() => setModalVisible(false)}
              >
                <Ionicons name="close-circle" size={30} color="#DDD" />
              </TouchableOpacity>

              {selectedFest && (
                <>
                  <Text style={[styles.modalTitle, { color: selectedFest.color }]}>
                    {modalType === 'details' ? 'Festival Info' : 'Get Tickets'}
                  </Text>
                  
                  <Text style={styles.festHeaderName}>{selectedFest.name}</Text>
                  
                  {modalType === 'details' ? (
                    <View>
                      <Text style={styles.modalBodyText}>{selectedFest.description}</Text>
                      <View style={styles.detailBadgeRow}>
                         <View style={styles.miniBadge}><Text style={styles.miniBadgeText}>18+</Text></View>
                         <View style={styles.miniBadge}><Text style={styles.miniBadgeText}>Outdoor</Text></View>
                      </View>
                    </View>
                  ) : (
                    <View style={styles.ticketContainer}>
                      <Text style={styles.modalBodyText}>Secure your spot at {selectedFest.location}!</Text>
                      <View style={styles.priceTag}>
                        <Text style={styles.priceLabel}>Starting at</Text>
                        <Text style={styles.priceAmount}>{selectedFest.price}</Text>
                      </View>
                      <TouchableOpacity style={[styles.buyButton, { backgroundColor: selectedFest.color }]}>
                        <Text style={styles.buyButtonText}>Purchase Now</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </>
              )}
            </View>
          </View>
        </Modal>

        <View style={styles.header}>
          <View style={styles.headerTitleRow}>
            <View>
              <Text style={styles.networkText}>DISCOVER</Text>
              <Text style={styles.socialText}>Festivals</Text>
            </View>
            <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
              <MaterialCommunityIcons name="sparkles" size={30} color="#F28482" />
            </Animated.View>
          </View>
        </View>

        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.section}>
            {festivals.map((fest) => (
              <View key={fest.id} style={styles.festCard}>
                <View style={[styles.imageContainer, { backgroundColor: fest.color + '40' }]}>
                  <LinearGradient 
                    colors={['transparent', 'rgba(0,0,0,0.6)']} 
                    style={styles.imageOverlay} 
                  />
                  <TouchableOpacity style={styles.heartButton}>
                    <Ionicons name="heart-outline" size={22} color="#FFF" />
                  </TouchableOpacity>
                  
                  <View style={styles.cardContent}>
                    <View style={styles.tagBadge}>
                      <Text style={styles.tagText}>{fest.tag}</Text>
                    </View>
                    <Text style={styles.festTitle}>{fest.name}</Text>
                    
                    <View style={styles.infoRow}>
                      <View style={styles.infoItem}>
                        <Ionicons name="calendar-outline" size={14} color="#FFF" />
                        <Text style={styles.infoText}>{fest.date}</Text>
                      </View>
                      <View style={styles.infoItem}>
                        <Ionicons name="location-outline" size={14} color="#FFF" />
                        <Text style={styles.infoText}>{fest.location}</Text>
                      </View>
                    </View>
                  </View>
                </View>

                {/* Interactive Action Buttons */}
                <View style={styles.actionRow}>
                  <TouchableOpacity 
                    style={styles.detailsBtn}
                    onPress={() => openModal('details', fest)}
                  >
                    <Text style={styles.detailsBtnText}>DETAILS</Text>
                  </TouchableOpacity>
                  <View style={styles.divider} />
                  <TouchableOpacity 
                    style={styles.ticketsBtn}
                    onPress={() => openModal('tickets', fest)}
                  >
                    <Text style={[styles.ticketsBtnText, { color: fest.color }]}>TICKETS</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FCE4EC' },
  gradient: { flex: 1 },
  header: { paddingHorizontal: 30, paddingTop: 30, paddingBottom: 15 },
  headerTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  networkText: { fontSize: 10, fontWeight: '800', letterSpacing: 4, color: '#A08189' },
  socialText: {
    fontSize: 62,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    color: '#3D3D3D',
    marginTop: -10,
    fontStyle: 'italic'
  },
  scrollContent: { paddingBottom: 100 },
  section: { paddingHorizontal: 25 },
  festCard: {
    backgroundColor: '#FFF',
    borderRadius: 30,
    marginBottom: 25,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 5,
  },
  imageContainer: { height: 220, justifyContent: 'flex-end', position: 'relative' },
  imageOverlay: { ...StyleSheet.absoluteFillObject },
  heartButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.2)',
    padding: 8,
    borderRadius: 20,
  },
  cardContent: { padding: 20 },
  tagBadge: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 5,
    marginBottom: 8,
  },
  tagText: { color: '#FFF', fontSize: 10, fontWeight: '900', letterSpacing: 1 },
  festTitle: {
    color: '#FFF',
    fontSize: 32,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    fontStyle: 'italic',
    marginBottom: 10,
  },
  infoRow: { flexDirection: 'row', gap: 15 },
  infoItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  infoText: { color: '#FFF', fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
  actionRow: {
    flexDirection: 'row',
    height: 60,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F5F5F5',
  },
  detailsBtn: { flex: 1, alignItems: 'center' },
  detailsBtnText: { fontSize: 12, fontWeight: '800', letterSpacing: 1.5, color: '#3D3D3D' },
  divider: { width: 1, height: '50%', backgroundColor: '#EEE' },
  ticketsBtn: { flex: 1, alignItems: 'center' },
  ticketsBtnText: { fontSize: 12, fontWeight: '800', letterSpacing: 1.5 },

  // New Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 35,
    padding: 30,
    alignItems: 'center',
    position: 'relative',
  },
  closeIcon: { position: 'absolute', top: 20, right: 20 },
  modalTitle: {
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 2,
    marginBottom: 10,
    textTransform: 'uppercase'
  },
  festHeaderName: {
    fontSize: 28,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    fontStyle: 'italic',
    color: '#333',
    textAlign: 'center',
    marginBottom: 15,
  },
  modalBodyText: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  detailBadgeRow: { flexDirection: 'row', justifyContent: 'center', gap: 10 },
  miniBadge: { backgroundColor: '#F5F5F5', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
  miniBadgeText: { fontSize: 10, fontWeight: '700', color: '#888' },
  ticketContainer: { alignItems: 'center', width: '100%' },
  priceTag: { alignItems: 'center', marginBottom: 20 },
  priceLabel: { fontSize: 10, fontWeight: '700', color: '#AAA', textTransform: 'uppercase' },
  priceAmount: { fontSize: 32, fontWeight: '800', color: '#333' },
  buyButton: {
    width: '100%',
    paddingVertical: 18,
    borderRadius: 20,
    alignItems: 'center',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5
  },
  buyButtonText: { color: 'white', fontWeight: '800', fontSize: 16, letterSpacing: 1 }
});