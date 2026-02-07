import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export default function AddPinScreen() {
  const [songName, setSongName] = useState('');
  const [artistName, setArtistName] = useState('');
  const [locationName, setLocationName] = useState('');
  const [memory, setMemory] = useState('');
  const [sentiment, setSentiment] = useState('');

  const sentiments = [
    { name: 'Euphoric', color: '#FF69B4', icon: 'happy' },
    { name: 'Chilled', color: '#87CEEB', icon: 'snow' },
    { name: 'Hype', color: '#FF4500', icon: 'flame' },
    { name: 'Nostalgic', color: '#FFD700', icon: 'time' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#F0FFE5', '#FFE5F0', '#E5F0FF']}
        style={styles.gradient}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <View style={styles.header}>
            <View>
              <Text style={styles.networkText}>SONIC SCOUT</Text>
              <Text style={styles.socialText}>Pin</Text>
            </View>
          </View>

          <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>CREATE A MUSICAL MEMORY</Text>

              <View style={styles.inputCard}>
                <Text style={styles.label}>SONG NAME</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter song title"
                  value={songName}
                  onChangeText={setSongName}
                  placeholderTextColor="#999"
                />
              </View>

              <View style={styles.inputCard}>
                <Text style={styles.label}>ARTIST</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter artist name"
                  value={artistName}
                  onChangeText={setArtistName}
                  placeholderTextColor="#999"
                />
              </View>

              <View style={styles.inputCard}>
                <Text style={styles.label}>LOCATION</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Where were you? (e.g., PCL Library)"
                  value={locationName}
                  onChangeText={setLocationName}
                  placeholderTextColor="#999"
                />
              </View>

              <View style={styles.inputCard}>
                <Text style={styles.label}>MEMORY</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="What's the story behind this song?"
                  value={memory}
                  onChangeText={setMemory}
                  multiline
                  numberOfLines={4}
                  placeholderTextColor="#999"
                />
              </View>

              <View style={styles.section}>
                <Text style={styles.label}>HOW DID IT MAKE YOU FEEL?</Text>
                
                <View style={styles.sentimentGrid}>
                  {sentiments.map((item) => (
                    <TouchableOpacity
                      key={item.name}
                      style={[
                        styles.sentimentButton,
                        sentiment === item.name && styles.sentimentSelected,
                        { borderColor: item.color }
                      ]}
                      onPress={() => setSentiment(item.name)}
                    >
                      <View style={[styles.sentimentIcon, { backgroundColor: item.color }]}>
                        <Ionicons name={item.icon} size={20} color="#FFF" />
                      </View>
                      <Text style={styles.sentimentText}>{item.name}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <TouchableOpacity style={styles.saveButton}>
                <LinearGradient
                  colors={['#FF69B4', '#87CEEB']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.saveGradient}
                >
                  <Ionicons name="add-circle" size={24} color="#FFF" />
                  <Text style={styles.saveText}>SAVE PIN</Text>
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
  container: {
    flex: 1,
    backgroundColor: '#F0FFE5',
  },
  gradient: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
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
  scrollContent: {
    paddingBottom: 120,
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 2.5,
    color: '#000',
    marginBottom: 20,
  },
  inputCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  label: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 2,
    color: '#000',
    marginBottom: 12,
  },
  input: {
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  sentimentGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
    gap: 12,
  },
  sentimentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderColor: 'transparent',
    width: '48%',
  },
  sentimentSelected: {
    borderWidth: 2,
  },
  sentimentIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  sentimentText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#000',
  },
  saveButton: {
    marginTop: 24,
    borderRadius: 28,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  saveGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
  },
  saveText: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 2,
    color: '#FFF',
    marginLeft: 10,
  },
});