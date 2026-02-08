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
  Image,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { searchTrack } from '../services/musicService';

export default function AddPinScreen() {
  const [songName, setSongName] = useState('');
  const [artistName, setArtistName] = useState('');
  const [locationName, setLocationName] = useState('');
  const [locationCoordinates, setLocationCoordinates] = useState(null);
  const [memory, setMemory] = useState('');
  const [sentiment, setSentiment] = useState('');
  
  const [albumCover, setAlbumCover] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [searchingMusic, setSearchingMusic] = useState(false);
  const [musicFound, setMusicFound] = useState(false);
  
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [searchingLocation, setSearchingLocation] = useState(false);
  
  const [modalVisible, setModalVisible] = useState(false);

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

  useEffect(() => {
    const searchMusic = async () => {
      if (songName.trim() && artistName.trim()) {
        setSearchingMusic(true);
        setMusicFound(false);
        
        const result = await searchTrack(songName.trim(), artistName.trim());
        
        if (result) {
          setAlbumCover(result.albumCover);
          setPreviewUrl(result.previewUrl);
          setMusicFound(true);
          console.log('🎨 Album cover set:', result.albumCover);
        } else {
          setAlbumCover(null);
          setPreviewUrl(null);
          setMusicFound(false);
        }
        
        setSearchingMusic(false);
      } else {
        setAlbumCover(null);
        setPreviewUrl(null);
        setMusicFound(false);
      }
    };

    const timeoutId = setTimeout(searchMusic, 1000);
    return () => clearTimeout(timeoutId);
  }, [songName, artistName]);

  const searchLocation = async (query) => {
    if (!query || query.length < 3) {
      setLocationSuggestions([]);
      setShowLocationDropdown(false);
      return;
    }

    setSearchingLocation(true);
    setShowLocationDropdown(true);

    try {
      const suggestions = [];
      
      try {
        const directResults = await Location.geocodeAsync(query);
        for (const result of directResults.slice(0, 3)) {
          const reverseGeo = await Location.reverseGeocodeAsync({
            latitude: result.latitude,
            longitude: result.longitude,
          });
          
          if (reverseGeo[0]) {
            const place = reverseGeo[0];
            suggestions.push({
              id: `${result.latitude}-${result.longitude}`,
              name: place.name || place.street || query,
              address: buildAddress(place),
              latitude: result.latitude,
              longitude: result.longitude,
            });
          }
        }
      } catch (error) {
        console.log('Direct search failed');
      }

      const cityVariations = [`${query}, Austin, TX`, `${query}, Austin, Texas`];

      for (const variation of cityVariations) {
        try {
          const results = await Location.geocodeAsync(variation);
          for (const result of results.slice(0, 2)) {
            const isDuplicate = suggestions.some(s => 
              Math.abs(s.latitude - result.latitude) < 0.0001
            );
            
            if (!isDuplicate) {
              const reverseGeo = await Location.reverseGeocodeAsync({
                latitude: result.latitude,
                longitude: result.longitude,
              });
              
              if (reverseGeo[0]) {
                suggestions.push({
                  id: `${result.latitude}-${result.longitude}`,
                  name: reverseGeo[0].name || query,
                  address: buildAddress(reverseGeo[0]),
                  latitude: result.latitude,
                  longitude: result.longitude,
                });
              }
            }
          }
        } catch (error) {
          console.log(`Failed: ${variation}`);
        }
      }

      setLocationSuggestions(suggestions.slice(0, 7));
    } catch (error) {
      console.error('Location search error:', error);
    } finally {
      setSearchingLocation(false);
    }
  };

  const buildAddress = (place) => {
    const parts = [];
    if (place.street && place.street !== place.name) parts.push(place.street);
    if (place.city) parts.push(place.city);
    if (place.region) parts.push(place.region);
    return parts.join(', ') || 'Location';
  };

  const handleLocationChange = (text) => {
    setLocationName(text);
    searchLocation(text);
  };

  const selectLocation = (location) => {
    setLocationName(location.name);
    setLocationCoordinates({
      latitude: location.latitude,
      longitude: location.longitude,
    });
    setShowLocationDropdown(false);
    setLocationSuggestions([]);
  };

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Please enable location permissions in Settings');
        return;
      }

      const location = await Location.getCurrentPositionAsync({ timeout: 3000 });
      const reverseGeo = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      const displayName = reverseGeo[0]?.name || 'Current Location';
      setLocationName(displayName);
      setLocationCoordinates({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    } catch (error) {
      const fallback = { latitude: 30.2672, longitude: -97.7431 };
      setLocationName('Austin, TX');
      setLocationCoordinates(fallback);
      alert('Using default location. Search for your actual location above.');
    }
  };

  const handleSave = async () => {
    if (!songName || !artistName || !locationName || !sentiment) {
      alert('Please fill in all required fields');
      return;
    }

    if (!locationCoordinates) {
      alert('Please select a location');
      return;
    }

    try {
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      
      console.log('💾 Saving pin...');
      console.log('  Album Cover:', albumCover);
      console.log('  Preview URL:', previewUrl);
      
      const newPin = {
        id: Date.now().toString(),
        song: songName,
        artist: artistName,
        location: locationName,
        sentiment: sentiment.toLowerCase(),
        image: albumCover || `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
        previewUrl: previewUrl || null,
        memory: memory || 'A special musical moment',
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        coordinate: locationCoordinates,
      };

      console.log('📌 NEW PIN:');
      console.log('  Song:', newPin.song);
      console.log('  Artist:', newPin.artist);
      console.log('  Image:', newPin.image);
      console.log('  Preview:', newPin.previewUrl);

      const existingPins = JSON.parse(await AsyncStorage.getItem('musicPins') || '[]');
      await AsyncStorage.setItem('musicPins', JSON.stringify([newPin, ...existingPins]));
      
      console.log('✅ Pin saved successfully!');
      setModalVisible(true);
    } catch (error) {
      console.error('❌ Save error:', error);
      alert('Failed to save pin');
    }
  };

  const closeAndReset = () => {
    setModalVisible(false);
    setSongName('');
    setArtistName('');
    setLocationName('');
    setLocationCoordinates(null);
    setMemory('');
    setSentiment('');
    setAlbumCover(null);
    setPreviewUrl(null);
    setMusicFound(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#FCE4EC', '#E3F2FD']} style={styles.gradient}>
        
        <Modal visible={modalVisible} animationType="fade" transparent={true}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Ionicons name="heart-circle" size={50} color="#F28482" />
              <Text style={styles.modalTitle}>thanks for sharing your memory with us {"<3"}</Text>
              <TouchableOpacity style={styles.modalButton} onPress={closeAndReset}>
                <Text style={styles.modalButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardView}>
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <View>
                <Text style={styles.networkText}>SONIC SCOUT</Text>
                <Text style={styles.socialText}>Pin</Text>
              </View>
              <Animated.View style={{ transform: [{ scale: sparkleAnim }] }}>
                <Ionicons name="star" size={30} color="#F28482" />
              </Animated.View>
            </View>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            nestedScrollEnabled={true}
          >
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>CREATE A MUSICAL MEMORY</Text>

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

              <View style={styles.inputCard}>
                <Text style={styles.label}>ARTIST</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter artist"
                  placeholderTextColor="#A0A0A0"
                  onChangeText={setArtistName}
                  value={artistName}
                />
                
                {searchingMusic && (
                  <View style={styles.musicSearching}>
                    <ActivityIndicator size="small" color="#F28482" />
                    <Text style={styles.musicSearchingText}>Searching iTunes...</Text>
                  </View>
                )}
                
                {musicFound && albumCover && (
                  <View style={styles.albumCoverPreview}>
                    <Image 
                      source={{ uri: albumCover }} 
                      style={styles.albumCoverImage}
                      onError={() => console.log('❌ Preview image failed')}
                      onLoad={() => console.log('✅ Preview image loaded')}
                    />
                    <View style={styles.albumCoverInfo}>
                      <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                      <Text style={styles.albumCoverText}>Found on iTunes!</Text>
                      {previewUrl && <Text style={styles.previewAvailable}>• Preview ready</Text>}
                    </View>
                  </View>
                )}
              </View>

              <View style={styles.inputCard}>
                <View style={styles.locationHeader}>
                  <Text style={styles.label}>LOCATION</Text>
                  <TouchableOpacity style={styles.currentLocationButton} onPress={getCurrentLocation}>
                    <Ionicons name="locate" size={16} color="#F28482" />
                    <Text style={styles.currentLocationText}>Use Current</Text>
                  </TouchableOpacity>
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., Zilker Park, Stubb's BBQ..."
                  placeholderTextColor="#A0A0A0"
                  onChangeText={handleLocationChange}
                  value={locationName}
                  onFocus={() => locationSuggestions.length > 0 && setShowLocationDropdown(true)}
                />
                
                {showLocationDropdown && locationSuggestions.length > 0 && (
                  <View style={styles.locationDropdown}>
                    {locationSuggestions.map((item) => (
                      <TouchableOpacity key={item.id} style={styles.locationItem} onPress={() => selectLocation(item)}>
                        <Ionicons name="location" size={18} color="#F28482" />
                        <View style={styles.locationTextContainer}>
                          <Text style={styles.locationItemName}>{item.name}</Text>
                          <Text style={styles.locationItemAddress}>{item.address}</Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}

                {searchingLocation && <Text style={styles.searchingText}>Searching...</Text>}
                {locationCoordinates && (
                  <View style={styles.locationConfirmed}>
                    <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                    <Text style={styles.locationConfirmedText}>Location set!</Text>
                  </View>
                )}
              </View>

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

              <View style={styles.sentimentContainer}>
                <Text style={styles.sentimentLabel}>how did it make you feel?</Text>
                <View style={styles.sentimentGrid}>
                  {sentiments.map((item) => {
                    const isSelected = sentiment === item.name;
                    return (
                      <TouchableOpacity
                        key={item.name}
                        style={[
                          styles.sentimentButton,
                          isSelected && { backgroundColor: '#FFF', borderColor: item.color, borderWidth: 1.5 }
                        ]}
                        onPress={() => setSentiment(item.name)}
                      >
                        <Ionicons name={item.icon} size={18} color={isSelected ? item.color : '#707070'} style={{ marginRight: 8 }} />
                        <Text style={[styles.sentimentText, isSelected && { color: '#333', fontWeight: '700' }]}>
                          {item.name}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <LinearGradient colors={['#F28482', '#F59694']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.saveGradient}>
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
  socialText: { fontSize: 68, fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif', color: '#3D3D3D', marginTop: -10, fontStyle: 'italic' },
  scrollContent: { paddingBottom: 80 },
  section: { paddingHorizontal: 30 },
  sectionTitle: { fontSize: 11, fontWeight: '700', letterSpacing: 2, color: '#757575', marginBottom: 25, textAlign: 'center' },
  inputCard: { backgroundColor: '#FFF', borderRadius: 22, paddingVertical: 18, paddingHorizontal: 22, marginBottom: 18, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 3 },
  label: { fontSize: 10, fontWeight: '900', letterSpacing: 1.5, color: '#C97A8E', marginBottom: 6 },
  input: { fontSize: 16, color: '#2D2D2D', fontWeight: '500' },
  textArea: { height: 90, textAlignVertical: 'top' },
  musicSearching: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  musicSearchingText: { fontSize: 12, color: '#F28482', marginLeft: 8, fontStyle: 'italic' },
  albumCoverPreview: { marginTop: 12, flexDirection: 'row', alignItems: 'center', backgroundColor: '#F9F9F9', padding: 10, borderRadius: 12 },
  albumCoverImage: { width: 70, height: 70, borderRadius: 8, marginRight: 12 },
  albumCoverInfo: { flex: 1, flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' },
  albumCoverText: { fontSize: 12, color: '#4CAF50', fontWeight: '600', marginLeft: 6 },
  previewAvailable: { fontSize: 11, color: '#999', marginLeft: 6 },
  locationHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  currentLocationButton: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 4, backgroundColor: '#FCE4EC', borderRadius: 12 },
  currentLocationText: { fontSize: 11, fontWeight: '700', color: '#F28482', marginLeft: 4 },
  locationDropdown: { marginTop: 10, backgroundColor: '#FAFAFA', borderRadius: 12, maxHeight: 200 },
  locationItem: { flexDirection: 'row', alignItems: 'center', padding: 12, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  locationTextContainer: { marginLeft: 12, flex: 1 },
  locationItemName: { fontSize: 14, fontWeight: '600', color: '#2D2D2D' },
  locationItemAddress: { fontSize: 12, color: '#999' },
  searchingText: { fontSize: 12, color: '#999', marginTop: 8, fontStyle: 'italic' },
  locationConfirmed: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  locationConfirmedText: { fontSize: 12, color: '#4CAF50', marginLeft: 6, fontWeight: '600' },
  sentimentContainer: { marginTop: 15, marginBottom: 30 },
  sentimentLabel: { fontSize: 20, fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif', color: '#525252', marginBottom: 15, fontStyle: 'italic' },
  sentimentGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  sentimentButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.7)', borderRadius: 18, paddingVertical: 12, paddingHorizontal: 16, borderWidth: 1, borderColor: '#EAEAEA' },
  sentimentText: { fontSize: 14, color: '#555', fontWeight: '500' },
  saveButton: { borderRadius: 30, overflow: 'hidden', marginTop: 10 },
  saveGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 20 },
  saveText: { fontSize: 18, fontWeight: '700', color: '#FFF', marginRight: 10 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '80%', backgroundColor: 'white', borderRadius: 30, padding: 35, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.15, shadowRadius: 20, elevation: 10 },
  modalTitle: { fontSize: 22, fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif', color: '#3D3D3D', marginTop: 15, marginBottom: 25, fontStyle: 'italic', textAlign: 'center', lineHeight: 28 },
  modalButton: { backgroundColor: '#F28482', paddingVertical: 12, paddingHorizontal: 40, borderRadius: 20 },
  modalButtonText: { color: 'white', fontWeight: '700', fontSize: 16 },
});