import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Animated,
  StatusBar,
  Platform,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Alert,
  ActivityIndicator
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useFonts, PlayfairDisplay_400Regular_Italic } from '@expo-google-fonts/playfair-display';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { Audio } from 'expo-av';

export default function MusicMapScreen() {
  const [fontsLoaded] = useFonts({
    PlayfairDisplay_400Regular_Italic,
  });

  const mapRef = useRef(null);
  const [selectedPin, setSelectedPin] = useState(null);
  const [showPinModal, setShowPinModal] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentRegion, setCurrentRegion] = useState({
    latitude: 30.2672,
    longitude: -97.7431,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);

  const [pins, setPins] = useState([]);

  const opacity1 = useRef(new Animated.Value(1)).current;
  const opacity2 = useRef(new Animated.Value(0)).current;
  const opacity3 = useRef(new Animated.Value(0)).current;
  const opacity4 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!fontsLoaded) return;

    const animate = () => {
      Animated.sequence([
        Animated.parallel([
          Animated.timing(opacity1, { toValue: 1, duration: 1500, useNativeDriver: true }),
          Animated.timing(opacity2, { toValue: 0, duration: 1500, useNativeDriver: true }),
          Animated.timing(opacity3, { toValue: 0, duration: 1500, useNativeDriver: true }),
          Animated.timing(opacity4, { toValue: 0, duration: 1500, useNativeDriver: true }),
        ]),
        Animated.delay(4000),
        Animated.parallel([
          Animated.timing(opacity1, { toValue: 0, duration: 1500, useNativeDriver: true }),
          Animated.timing(opacity2, { toValue: 1, duration: 1500, useNativeDriver: true }),
          Animated.timing(opacity3, { toValue: 0, duration: 1500, useNativeDriver: true }),
          Animated.timing(opacity4, { toValue: 0, duration: 1500, useNativeDriver: true }),
        ]),
        Animated.delay(4000),
        Animated.parallel([
          Animated.timing(opacity1, { toValue: 0, duration: 1500, useNativeDriver: true }),
          Animated.timing(opacity2, { toValue: 0, duration: 1500, useNativeDriver: true }),
          Animated.timing(opacity3, { toValue: 1, duration: 1500, useNativeDriver: true }),
          Animated.timing(opacity4, { toValue: 0, duration: 1500, useNativeDriver: true }),
        ]),
        Animated.delay(4000),
        Animated.parallel([
          Animated.timing(opacity1, { toValue: 0, duration: 1500, useNativeDriver: true }),
          Animated.timing(opacity2, { toValue: 0, duration: 1500, useNativeDriver: true }),
          Animated.timing(opacity3, { toValue: 0, duration: 1500, useNativeDriver: true }),
          Animated.timing(opacity4, { toValue: 1, duration: 1500, useNativeDriver: true }),
        ]),
        Animated.delay(4000),
      ]).start(() => animate());
    };

    animate();
  }, [fontsLoaded]);

  useFocusEffect(
    React.useCallback(() => {
      loadPins();
    }, [])
  );

  const loadPins = async () => {
    try {
      const pinsJson = await AsyncStorage.getItem('musicPins');
      
      // Real songs with actual album covers and previews from iTunes
      const defaultPins = [
        {
          id: 'default-1',
          song: 'Levitating',
          artist: 'Dua Lipa',
          location: 'Zilker Park',
          sentiment: 'euphoric',
          image: 'https://cdn-images.dzcdn.net/images/cover/3c5cd0eb919ff9a7767b8ac7acc89e40/1900x1900-000000-80-0-0.jpg',
          previewUrl: null,
          memory: 'ACL Festival vibes! Dancing with friends under the sunset. This song made everything feel magical.',
          date: 'October 8, 2023',
          time: '6:23 PM',
          coordinate: {
            latitude: 30.2672,
            longitude: -97.7731,
          },
        },
        {
          id: 'default-2',
          song: 'Blinding Lights',
          artist: 'The Weeknd',
          location: 'Barton Springs',
          sentiment: 'nostalgic',
          image: 'https://upload.wikimedia.org/wikipedia/en/e/e6/The_Weeknd_-_Blinding_Lights.png',
          previewUrl: null,
          memory: 'Swimming at sunset with the crew. The water was perfect and this song came on someone\'s speaker.',
          date: 'August 22, 2023',
          time: '7:15 PM',
          coordinate: {
            latitude: 30.2635,
            longitude: -97.7712,
          },
        },
        {
          id: 'default-3',
          song: 'Anti-Hero',
          artist: 'Taylor Swift',
          location: 'PCL Library',
          sentiment: 'chilled',
          image: 'https://m.media-amazon.com/images/I/419jTRCD5SL._UXNaN_FMjpg_QL85_.jpg',
          previewUrl: null,
          memory: 'Late night study session during finals. This song kept me company through the hardest semester.',
          date: 'December 15, 2023',
          time: '11:47 PM',
          coordinate: {
            latitude: 30.2862,
            longitude: -97.7394,
          },
        },
      ];

      if (pinsJson) {
        const savedPins = JSON.parse(pinsJson);
        
        console.log('📍 Loaded saved pins:');
        savedPins.forEach(pin => {
          console.log(`  - ${pin.song} by ${pin.artist}`);
          console.log(`    Image: ${pin.image}`);
          console.log(`    Preview: ${pin.previewUrl || 'None'}`);
        });
        
        const allPins = [...savedPins, ...defaultPins];
        setPins(allPins);

        if (savedPins.length > 0 && savedPins[0].coordinate) {
          setCurrentRegion({
            latitude: savedPins[0].coordinate.latitude,
            longitude: savedPins[0].coordinate.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          });
        }
      } else {
        setPins(defaultPins);
      }
    } catch (error) {
      console.error('Error loading pins:', error);
    }
  };

  const handleDeletePin = async (pinId) => {
    // Allow deletion of all pins now (removed isDefault check)
    Alert.alert(
      'Delete Memory',
      'Are you sure you want to delete this memory? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const updatedPins = pins.filter(pin => pin.id !== pinId);
              setPins(updatedPins);

              // Save only user-created pins (not default ones)
              const userPins = updatedPins.filter(pin => !pin.id.startsWith('default-'));
              await AsyncStorage.setItem('musicPins', JSON.stringify(userPins));

              if (selectedPin?.id === pinId) {
                setShowPinModal(false);
                setSelectedPin(null);
              }

              Alert.alert('Deleted', 'Memory has been deleted successfully.');
            } catch (error) {
              console.error('Error deleting pin:', error);
              Alert.alert('Error', 'Failed to delete memory');
            }
          }
        }
      ]
    );
  };

  const getSentimentColor = (sentiment) => {
    const colors = {
      euphoric: '#FF69B4',
      chilled: '#87CEEB',
      hype: '#FF4500',
      nostalgic: '#FFD700'
    };
    return colors[sentiment] || '#808080';
  };

  const handleMarkerPress = (pin) => {
    setSelectedPin(pin);
    setShowPinModal(true);
  };

  const handleZoomIn = () => {
    const newRegion = {
      ...currentRegion,
      latitudeDelta: currentRegion.latitudeDelta / 2,
      longitudeDelta: currentRegion.longitudeDelta / 2,
    };
    setCurrentRegion(newRegion);
    mapRef.current?.animateToRegion(newRegion, 300);
  };

  const handleZoomOut = () => {
    const newRegion = {
      ...currentRegion,
      latitudeDelta: currentRegion.latitudeDelta * 2,
      longitudeDelta: currentRegion.longitudeDelta * 2,
    };
    setCurrentRegion(newRegion);
    mapRef.current?.animateToRegion(newRegion, 300);
  };

  const handleRegionChangeComplete = (region) => {
    setCurrentRegion(region);
  };

  const handleSearchPress = () => {
    setShowSearchModal(true);
  };

  const handleCloseSearch = () => {
    setShowSearchModal(false);
    setSearchQuery('');
  };

  const handleSearchResultPress = (pin) => {
    setShowSearchModal(false);
    setSearchQuery('');
    setSelectedPin(pin);
    setShowPinModal(true);
  };

  const filteredPins = pins.filter((pin) => {
    if (!searchQuery.trim()) return true;
    
    const query = searchQuery.toLowerCase();
    const songMatch = pin.song.toLowerCase().includes(query);
    const artistMatch = pin.artist.toLowerCase().includes(query);
    const locationMatch = pin.location.toLowerCase().includes(query);
    
    return songMatch || artistMatch || locationMatch;
  });

  const playPreview = async (previewUrl) => {
    if (!previewUrl) {
      Alert.alert('No Preview', 'This song doesn\'t have a preview available.');
      return;
    }

    try {
      setIsLoadingAudio(true);

      if (sound) {
        await sound.stopAsync();
        await sound.unloadAsync();
        setSound(null);
        setIsPlaying(false);
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
      });

      console.log('🎵 Loading preview:', previewUrl);
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: previewUrl },
        { shouldPlay: true, volume: 1.0 }
      );

      setSound(newSound);
      setIsPlaying(true);
      setIsLoadingAudio(false);

      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          setIsPlaying(false);
        }
        if (status.error) {
          console.error('Playback error:', status.error);
          setIsPlaying(false);
          Alert.alert('Playback Error', 'Could not play the preview.');
        }
      });

      console.log('✅ Playing preview');
    } catch (error) {
      console.error('Error playing preview:', error);
      setIsLoadingAudio(false);
      setIsPlaying(false);
      Alert.alert('Error', 'Could not play preview. Please try again.');
    }
  };

  const stopPreview = async () => {
    if (sound) {
      try {
        await sound.stopAsync();
        await sound.unloadAsync();
        setSound(null);
        setIsPlaying(false);
        console.log('⏹️ Stopped preview');
      } catch (error) {
        console.error('Error stopping preview:', error);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (sound) {
        console.log('🧹 Cleaning up audio');
        sound.unloadAsync();
      }
    };
  }, [sound]);

  useEffect(() => {
    if (!showPinModal && sound) {
      stopPreview();
    }
  }, [showPinModal]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.fullScreen}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      
      <View style={StyleSheet.absoluteFillObject}>
        <Animated.View style={[StyleSheet.absoluteFillObject, { opacity: opacity1 }]}>
          <LinearGradient colors={['#E8F4FF', '#FFEEF7', '#FFF9E8']} style={StyleSheet.absoluteFillObject} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} />
        </Animated.View>
        <Animated.View style={[StyleSheet.absoluteFillObject, { opacity: opacity2 }]}>
          <LinearGradient colors={['#FFE8F7', '#FFF4E8', '#FFFDE8']} style={StyleSheet.absoluteFillObject} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} />
        </Animated.View>
        <Animated.View style={[StyleSheet.absoluteFillObject, { opacity: opacity3 }]}>
          <LinearGradient colors={['#FFF4E8', '#FFFDE8', '#FFFFE8']} style={StyleSheet.absoluteFillObject} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} />
        </Animated.View>
        <Animated.View style={[StyleSheet.absoluteFillObject, { opacity: opacity4 }]}>
          <LinearGradient colors={['#FFFDE8', '#F4E8FF', '#E8F4FF']} style={StyleSheet.absoluteFillObject} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} />
        </Animated.View>
      </View>

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <View>
            <Text style={styles.networkText}>ATLAST</Text>
            <Text style={styles.exploreText}>Explore</Text>
          </View>
          <TouchableOpacity style={styles.searchButton} onPress={handleSearchPress}>
            <Ionicons name="search" size={22} color="#000" />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>YOUR MUSIC MAP</Text>
            <Text style={styles.subtitle}>{pins.length} musical memories pinned</Text>

            <View style={styles.mapContainer}>
              <MapView
                ref={mapRef}
                style={styles.map}
                initialRegion={currentRegion}
                onRegionChangeComplete={handleRegionChangeComplete}
                zoomEnabled={true}
                scrollEnabled={true}
                pitchEnabled={false}
                rotateEnabled={false}
              >
                {pins.map((pin) => (
                  <Marker key={pin.id} coordinate={pin.coordinate} onPress={() => handleMarkerPress(pin)}>
                    <View style={styles.customMarker}>
                      <View style={[styles.markerDot, { backgroundColor: getSentimentColor(pin.sentiment) }]}>
                        <Ionicons name="musical-note" size={16} color="#FFF" />
                      </View>
                    </View>
                  </Marker>
                ))}
              </MapView>

              <View style={styles.zoomControls}>
                <TouchableOpacity style={styles.zoomButton} onPress={handleZoomIn}>
                  <Ionicons name="add" size={24} color="#000" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.zoomButton} onPress={handleZoomOut}>
                  <Ionicons name="remove" size={24} color="#000" />
                </TouchableOpacity>
              </View>
            </View>

            {pins.map((pin) => (
              <TouchableOpacity key={pin.id} style={styles.pinCard} onPress={() => handleMarkerPress(pin)}>
                <View style={[styles.sentimentBar, { backgroundColor: getSentimentColor(pin.sentiment) }]} />
                <View style={styles.pinContent}>
                  <Image 
                    source={{ uri: pin.image }} 
                    style={styles.pinImage}
                    onError={(e) => console.log('❌ List image failed:', pin.song, e.nativeEvent.error)}
                    onLoad={() => console.log('✅ List image loaded:', pin.song)}
                  />
                  <View style={styles.pinInfo}>
                    <Text style={styles.songName}>{pin.song}</Text>
                    <Text style={styles.artistName}>{pin.artist}</Text>
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
      </SafeAreaView>

      <Modal visible={showSearchModal} animationType="slide" transparent={true} onRequestClose={handleCloseSearch}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.searchModalOverlay}>
          <TouchableOpacity style={styles.searchBackdrop} activeOpacity={1} onPress={handleCloseSearch} />
          
          <View style={styles.searchModalContent}>
            <View style={styles.searchHeader}>
              <Text style={styles.searchTitle}>Search Memories</Text>
              <TouchableOpacity onPress={handleCloseSearch} style={styles.closeButton}>
                <Ionicons name="close" size={28} color="#000" />
              </TouchableOpacity>
            </View>

            <View style={styles.searchInputContainer}>
              <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search by song, artist, or location..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholderTextColor="#999"
                autoFocus={true}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <Ionicons name="close-circle" size={20} color="#999" />
                </TouchableOpacity>
              )}
            </View>

            <ScrollView style={styles.searchResults} showsVerticalScrollIndicator={false}>
              {filteredPins.length > 0 ? (
                <>
                  <Text style={styles.resultsCount}>
                    {filteredPins.length} {filteredPins.length === 1 ? 'memory' : 'memories'} found
                  </Text>
                  {filteredPins.map((pin) => (
                    <TouchableOpacity key={pin.id} style={styles.searchResultCard} onPress={() => handleSearchResultPress(pin)}>
                      <View style={[styles.resultSentimentBar, { backgroundColor: getSentimentColor(pin.sentiment) }]} />
                      <View style={styles.resultContent}>
                        <Image source={{ uri: pin.image }} style={styles.resultImage} />
                        <View style={styles.resultInfo}>
                          <Text style={styles.resultSongName}>{pin.song}</Text>
                          <Text style={styles.resultArtist}>{pin.artist}</Text>
                          <View style={styles.resultLocationRow}>
                            <Ionicons name="location" size={12} color="#666" />
                            <Text style={styles.resultLocation}>{pin.location}</Text>
                          </View>
                          <Text style={styles.resultDate}>{pin.date}</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#999" />
                      </View>
                    </TouchableOpacity>
                  ))}
                </>
              ) : (
                <View style={styles.noResults}>
                  <Ionicons name="search" size={64} color="#CCC" />
                  <Text style={styles.noResultsText}>No memories found</Text>
                  <Text style={styles.noResultsSubtext}>Try searching for a different song, artist, or location</Text>
                </View>
              )}
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <Modal visible={showPinModal} animationType="slide" transparent={true} onRequestClose={() => setShowPinModal(false)}>
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={styles.modalBackdrop} activeOpacity={1} onPress={() => setShowPinModal(false)} />
          
          {selectedPin && (
            <View style={styles.pinModalContent}>
              <View style={[styles.modalSentimentBar, { backgroundColor: getSentimentColor(selectedPin.sentiment) }]} />
              
              <View style={styles.modalHeader}>
                <Image 
                  source={{ uri: selectedPin.image }} 
                  style={styles.modalImage}
                  onError={(e) => {
                    console.log('❌ Modal image failed to load');
                    console.log('   URL:', selectedPin.image);
                    console.log('   Error:', e.nativeEvent.error);
                  }}
                  onLoad={() => console.log('✅ Modal image loaded:', selectedPin.image)}
                />
                <View style={styles.modalHeaderButtons}>
                  <TouchableOpacity onPress={() => setShowPinModal(false)} style={styles.closeButton}>
                    <Ionicons name="close" size={28} color="#000" />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.modalBody}>
                <View style={styles.modalTitleRow}>
                  <View style={styles.modalTitleContainer}>
                    <Text style={styles.modalSongName}>{selectedPin.song}</Text>
                    <Text style={styles.modalArtist}>{selectedPin.artist}</Text>
                  </View>
                  
                  {/* Now ALL pins can be deleted */}
                  <TouchableOpacity 
                    onPress={() => {
                      setShowPinModal(false);
                      handleDeletePin(selectedPin.id);
                    }}
                    style={styles.modalDeleteButton}
                  >
                    <Ionicons name="trash-outline" size={24} color="#999" />
                  </TouchableOpacity>
                </View>

                <View style={styles.modalInfoRow}>
                  <Ionicons name="location" size={18} color="#666" />
                  <Text style={styles.modalLocation}>{selectedPin.location}</Text>
                </View>

                <View style={styles.modalInfoRow}>
                  <Ionicons name="calendar" size={18} color="#666" />
                  <Text style={styles.modalDate}>{selectedPin.date}</Text>
                </View>

                <View style={styles.modalInfoRow}>
                  <Ionicons name="time" size={18} color="#666" />
                  <Text style={styles.modalTime}>{selectedPin.time}</Text>
                </View>

                <View style={styles.modalSentimentBadge}>
                  <View style={[styles.sentimentBadgeDot, { backgroundColor: getSentimentColor(selectedPin.sentiment) }]} />
                  <Text style={styles.sentimentBadgeText}>{selectedPin.sentiment.toUpperCase()}</Text>
                </View>

                <View style={styles.memorySection}>
                  <Text style={styles.memoryLabel}>MEMORY</Text>
                  <Text style={styles.memoryText}>{selectedPin.memory}</Text>
                </View>

                <TouchableOpacity 
                  style={styles.playButton}
                  onPress={() => {
                    if (isPlaying) {
                      stopPreview();
                    } else {
                      playPreview(selectedPin.previewUrl);
                    }
                  }}
                  disabled={isLoadingAudio}
                >
                  <LinearGradient
                    colors={[getSentimentColor(selectedPin.sentiment), '#C9A0FF']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.playGradient}
                  >
                    {isLoadingAudio ? (
                      <>
                        <ActivityIndicator size="small" color="#FFF" />
                        <Text style={styles.playText}>LOADING...</Text>
                      </>
                    ) : (
                      <>
                        <Ionicons name={isPlaying ? "pause" : "play"} size={20} color="#FFF" />
                        <Text style={styles.playText}>
                          {isPlaying ? "PAUSE PREVIEW" : selectedPin.previewUrl ? "PLAY PREVIEW" : "NO PREVIEW"}
                        </Text>
                      </>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  fullScreen: { flex: 1 },
  safeArea: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingHorizontal: 24, paddingTop: 10, paddingBottom: 10 },
  networkText: { fontSize: 11, fontWeight: '700', letterSpacing: 2.5, color: '#000' },
  exploreText: { fontSize: 52, fontFamily: 'PlayfairDisplay_400Regular_Italic', color: '#000', marginTop: -10 },
  searchButton: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8, elevation: 5 },
  scrollContent: { paddingBottom: 120 },
  section: { marginBottom: 35, paddingHorizontal: 24 },
  sectionTitle: { fontSize: 13, fontWeight: '800', letterSpacing: 2.5, color: '#000', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#666', marginBottom: 20, fontWeight: '500' },
  mapContainer: { height: 300, borderRadius: 20, overflow: 'hidden', marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 5, position: 'relative' },
  map: { flex: 1 },
  customMarker: { alignItems: 'center' },
  markerDot: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: '#FFF', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4, elevation: 5 },
  zoomControls: { position: 'absolute', right: 10, bottom: 10, gap: 10 },
  zoomButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 4, elevation: 3 },
  pinCard: { backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: 20, marginBottom: 16, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 6, elevation: 3 },
  sentimentBar: { height: 4, width: '100%' },
  pinContent: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  pinImage: { width: 56, height: 56, borderRadius: 28, marginRight: 16 },
  pinInfo: { flex: 1 },
  songName: { fontSize: 18, fontWeight: '800', color: '#000', marginBottom: 2 },
  artistName: { fontSize: 14, color: '#999', fontWeight: '500', marginBottom: 4 },
  locationRow: { flexDirection: 'row', alignItems: 'center' },
  locationText: { fontSize: 14, color: '#666', marginLeft: 4, fontWeight: '500' },
  legendGrid: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 16 },
  legendItem: { flexDirection: 'row', alignItems: 'center', width: '50%', marginBottom: 16 },
  legendDot: { width: 36, height: 36, borderRadius: 18, marginRight: 10, justifyContent: 'center', alignItems: 'center' },
  legendText: { fontSize: 14, fontWeight: '700', color: '#000' },
  searchModalOverlay: { flex: 1, justifyContent: 'flex-end' },
  searchBackdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0, 0, 0, 0.5)' },
  searchModalContent: { backgroundColor: '#FFF', borderTopLeftRadius: 30, borderTopRightRadius: 30, height: '90%', shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 10 },
  searchHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingTop: 24, paddingBottom: 16 },
  searchTitle: { fontSize: 24, fontWeight: '800', color: '#000' },
  closeButton: { width: 44, height: 44, justifyContent: 'center', alignItems: 'center' },
  searchInputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8F8F8', borderRadius: 16, marginHorizontal: 24, marginBottom: 20, paddingHorizontal: 16, paddingVertical: 12 },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, fontSize: 16, color: '#000' },
  searchResults: { flex: 1, paddingHorizontal: 24 },
  resultsCount: { fontSize: 13, fontWeight: '700', letterSpacing: 1.5, color: '#666', marginBottom: 16 },
  searchResultCard: { backgroundColor: '#FFF', borderRadius: 20, marginBottom: 16, overflow: 'hidden', borderWidth: 1, borderColor: '#F0F0F0' },
  resultSentimentBar: { height: 4, width: '100%' },
  resultContent: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  resultImage: { width: 64, height: 64, borderRadius: 32, marginRight: 16 },
  resultInfo: { flex: 1 },
  resultSongName: { fontSize: 16, fontWeight: '800', color: '#000', marginBottom: 2 },
  resultArtist: { fontSize: 14, color: '#666', fontWeight: '600', marginBottom: 4 },
  resultLocationRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 2 },
  resultLocation: { fontSize: 12, color: '#666', marginLeft: 4 },
  resultDate: { fontSize: 12, color: '#999', marginTop: 2 },
  noResults: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60 },
  noResultsText: { fontSize: 18, fontWeight: '700', color: '#666', marginTop: 16 },
  noResultsSubtext: { fontSize: 14, color: '#999', marginTop: 8, textAlign: 'center', paddingHorizontal: 40 },
  modalOverlay: { flex: 1, justifyContent: 'flex-end' },
  modalBackdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0, 0, 0, 0.5)' },
  pinModalContent: { backgroundColor: '#FFF', borderTopLeftRadius: 30, borderTopRightRadius: 30, maxHeight: '85%', shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 10, overflow: 'hidden' },
  modalSentimentBar: { height: 6, width: '100%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingTop: 20 },
  modalHeaderButtons: { flexDirection: 'row', alignItems: 'center' },
  modalImage: { width: 80, height: 80, borderRadius: 40 },
  modalBody: { paddingHorizontal: 24, paddingBottom: Platform.OS === 'ios' ? 40 : 20 },
  modalTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: 20, marginBottom: 20 },
  modalTitleContainer: { flex: 1, marginRight: 12 },
  modalSongName: { fontSize: 28, fontWeight: '800', color: '#000', marginBottom: 4 },
  modalArtist: { fontSize: 16, color: '#666', fontWeight: '600' },
  modalDeleteButton: { width: 44, height: 44, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5F5F5', borderRadius: 22 },
  modalInfoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  modalLocation: { fontSize: 16, color: '#333', marginLeft: 10, fontWeight: '500' },
  modalDate: { fontSize: 16, color: '#333', marginLeft: 10, fontWeight: '500' },
  modalTime: { fontSize: 16, color: '#333', marginLeft: 10, fontWeight: '500' },
  modalSentimentBadge: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', backgroundColor: '#F0F0F0', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginTop: 12, marginBottom: 20 },
  sentimentBadgeDot: { width: 12, height: 12, borderRadius: 6, marginRight: 8 },
  sentimentBadgeText: { fontSize: 12, fontWeight: '800', letterSpacing: 1.5, color: '#000' },
  memorySection: { backgroundColor: '#F8F8F8', borderRadius: 16, padding: 16, marginBottom: 20 },
  memoryLabel: { fontSize: 11, fontWeight: '800', letterSpacing: 2, color: '#666', marginBottom: 8 },
  memoryText: { fontSize: 15, color: '#333', lineHeight: 22, fontStyle: 'italic' },
  playButton: { borderRadius: 24, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 5 },
  playGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16 },
  playText: { fontSize: 15, fontWeight: '800', letterSpacing: 2, color: '#FFF', marginLeft: 10 },
});