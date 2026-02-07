import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export default function AddPinScreen() {
  // Form State
  const [songName, setSongName] = useState('');
  const [artistName, setArtistName] = useState('');
  const [locationName, setLocationName] = useState('');
  const [memory, setMemory] = useState('');
  const [sentiment, setSentiment] = useState('');
  
  // Popup State
  const [modalVisible, setModalVisible] = useState(false);

  // Breathing animation for the sparkle icon
  const sparkleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(sparkleAnim, { toValue: 1.2, duration: 1500, useNativeDriver: true }),
        Animated.timing(sparkleAnim, { toValue: 1, duration: 1500, useNativeDriver: true }),
      ])
    ).start();
  }, [sparkleAnim]);

  const sentiments = [
    { name: 'Euphoric', color: '#F28482', icon: 'heart' },
    { name: 'Chilled', color: '#84A59D', icon: 'leaf' },
    { name: 'Hype', color: '#F5AB00', icon: 'flash' },
    { name: 'Nostalgic', color: '#9B86BD', icon: 'cloudy-night' },
  ];

  const handleSave = () => {
    // You can add validation here (e.g., if (!songName) return;)
    setModalVisible(true);
  };

  const closeAndReset = () => {
    setModalVisible(false);
    // Clears the form after saving
    setSongName('');
    setArtistName('');
    setLocationName('');
    setMemory('');
    setSentiment('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#FCE4EC', '#E3F2FD']} style={styles.gradient}>
        
        {/* Success Popup Modal */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <MaterialCommunityIcons name="heart-pulse" size={50} color="#F28482" />
              
              <Text style={styles.modalTitle}>
                thanks for sharing your memory with us {"<3"}
              </Text>
              
              <TouchableOpacity 
                style={styles.modalButton} 
                onPress={closeAndReset}
                activeOpacity={0.8}
              >
                <Text style={styles.modalButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <View>
                <Text style={styles.networkText}>SONIC SCOUT</Text>
                <Text style={styles.socialText}>Pin</Text>
              </View>
              <Animated.View style={{ transform: [{ scale: sparkleAnim }] }}>
                <MaterialCommunityIcons name="sparkles" size={30} color="#F28482" />
              </Animated.View>
            </View>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>CREATE A MUSICAL MEMORY</Text>

              {/* Song Name Input */}
              <View style={styles.inputCard}>
                <Text style={styles.label}>SONG NAME</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter song name"
                  placeholderTextColor="#A0A0A0"
                  onChangeText={setSongName}
                  value={songName}
                />
              </View>

              {/* Artist Input */}
              <View style={styles.inputCard}>
                <Text style={styles.label}>ARTIST</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter artist"
                  placeholderTextColor="#A0A0A0"
                  onChangeText={setArtistName}
                  value={artistName}
                />
              </View>

              {/* Location Input */}
              <View style={styles.inputCard}>
                <Text style={styles.label}>LOCATION</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter location"
                  placeholderTextColor="#A0A0A0"
                  onChangeText={setLocationName}
                  value={locationName}
                />
              </View>

              {/* Memory Input */}
              <View style={styles.inputCard}>
                <Text style={styles.label}>MEMORY</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Write a little note..."
                  multiline
                  placeholderTextColor="#A0A0A0"
                  onChangeText={setMemory}
                  value={memory}
                />
              </View>

              {/* Sentiment Picker */}
              <View style={styles.sentimentContainer}>
                <Text style={styles.sentimentLabel}>how did it make you feel?</Text>
                <View style={styles.sentimentGrid}>
                  {sentiments.map((item) => {
                    const isSelected = sentiment === item.name;
                    return (
                      <TouchableOpacity
                        key={item.name}
                        activeOpacity={0.7}
                        style={[
                          styles.sentimentButton,
                          isSelected && { backgroundColor: '#FFF', borderColor: item.color, borderWidth: 1.5 }
                        ]}
                        onPress={() => setSentiment(item.name)}
                      >
                        <Ionicons
                          name={item.icon}
                          size={18}
                          color={isSelected ? item.color : '#707070'}
                          style={{ marginRight: 8 }}
                        />
                        <Text style={[styles.sentimentText, isSelected && { color: '#333', fontWeight: '700' }]}>
                          {item.name}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* Save Button */}
              <TouchableOpacity 
                style={styles.saveButton} 
                activeOpacity={0.8}
                onPress={handleSave}
              >
                <LinearGradient
                  colors={['#F28482', '#F59694']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.saveGradient}
                >
                  <Text style={styles.saveText}>Save memory</Text>
                  <Ionicons name="heart" size={20} color="#FFF" />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FCE4EC' },
  gradient: { flex: 1 },
  keyboardView: { flex: 1 },
  header: { paddingHorizontal: 30, paddingTop: 30, paddingBottom: 20 },
  headerTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  networkText: { fontSize: 10, fontWeight: '800', letterSpacing: 4, color: '#A08189' },
  socialText: {
    fontSize: 68,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    color: '#3D3D3D',
    marginTop: -10,
    fontStyle: 'italic'
  },
  scrollContent: { paddingBottom: 80 },
  section: { paddingHorizontal: 30 },
  sectionTitle: { fontSize: 11, fontWeight: '700', letterSpacing: 2, color: '#757575', marginBottom: 25, textAlign: 'center' },
  inputCard: {
    backgroundColor: '#FFF',
    borderRadius: 22,
    paddingVertical: 18,
    paddingHorizontal: 22,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3
  },
  label: { fontSize: 10, fontWeight: '900', letterSpacing: 1.5, color: '#C97A8E', marginBottom: 6 },
  input: { fontSize: 16, color: '#2D2D2D', fontWeight: '500' },
  textArea: { height: 90, textAlignVertical: 'top' },
  sentimentContainer: { marginTop: 15, marginBottom: 30 },
  sentimentLabel: { fontSize: 20, fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif', color: '#525252', marginBottom: 15, fontStyle: 'italic' },
  sentimentGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  sentimentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#EAEAEA'
  },
  sentimentText: { fontSize: 14, color: '#555', fontWeight: '500' },
  saveButton: { borderRadius: 30, overflow: 'hidden', marginTop: 10 },
  saveGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 20 },
  saveText: { fontSize: 18, fontWeight: '700', color: '#FFF', marginRight: 10 },
  
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 30,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 22,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    color: '#3D3D3D',
    marginTop: 15,
    marginBottom: 25,
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 28,
  },
  modalButton: {
    backgroundColor: '#F28482',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 20,
  },
  modalButtonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  }
});