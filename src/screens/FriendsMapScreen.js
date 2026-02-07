import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  TouchableOpacity,
  Animated,
  StatusBar,
  Platform,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useFonts, PlayfairDisplay_400Regular_Italic } from '@expo-google-fonts/playfair-display';

// Gradient Avatar Component
const GradientAvatar = ({ size = 90 }) => (
  <LinearGradient
    colors={['#FFFAC9', '#FFC9A0', '#FFA0C9', '#C9A0FF']}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={{ 
      width: size, 
      height: size, 
      borderRadius: size / 2, 
      justifyContent: 'center', 
      alignItems: 'center',
      borderWidth: 4,
      borderColor: '#FFF'
    }}
  >
    <Ionicons name="person" size={size * 0.55} color="#FFF" />
  </LinearGradient>
);

export default function FriendsMapScreen({ navigation }) {
  const [fontsLoaded] = useFonts({
    PlayfairDisplay_400Regular_Italic,
  });

  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [friendName, setFriendName] = useState('');
  const [friendUsername, setFriendUsername] = useState('');

  const [vibingNow, setVibingNow] = useState([
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

  const [recentAuras, setRecentAuras] = useState([
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
    {
      id: '4',
      name: 'Maya Patel',
      activity: 'Vibing at Mohawk',
      image: 'https://i.pravatar.cc/150?img=47',
    },
    {
      id: '5',
      name: 'Chris Davis',
      activity: 'Concert at Stubb\'s',
      image: 'https://i.pravatar.cc/150?img=52',
    },
  ]);

  // Multiple opacity animations for gradient crossfade
  const opacity1 = useRef(new Animated.Value(1)).current;
  const opacity2 = useRef(new Animated.Value(0)).current;
  const opacity3 = useRef(new Animated.Value(0)).current;
  const opacity4 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
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
  }, []);

  const handleAddFriend = () => {
    if (!friendName.trim() || !friendUsername.trim()) {
      Alert.alert('Error', 'Please enter both name and username');
      return;
    }

    const newFriend = {
      id: Date.now().toString(),
      name: friendName.toUpperCase(),
      image: null,
      isOnline: true,
    };

    const newAura = {
      id: Date.now().toString(),
      name: friendName,
      activity: 'Just joined!',
      image: null,
    };

    setVibingNow([...vibingNow, newFriend]);
    setRecentAuras([newAura, ...recentAuras]);

    setFriendName('');
    setFriendUsername('');
    setShowAddModal(false);

    Alert.alert('Success!', `${friendName} has been added to your friends!`);
  };

  const handleFriendClick = (friend) => {
    setSelectedFriend(friend);
    setShowDeleteModal(true);
  };

  const handleDeleteFriend = () => {
    if (!selectedFriend) return;

    setVibingNow(vibingNow.filter(f => f.id !== selectedFriend.id));
    setRecentAuras(recentAuras.filter(a => a.id !== selectedFriend.id));

    setShowDeleteModal(false);
    setSelectedFriend(null);

    Alert.alert('Removed', `${selectedFriend.name} has been removed from your friends.`);
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.fullScreen}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      
      {/* Animated gradients */}
      <View style={StyleSheet.absoluteFillObject}>
        <Animated.View style={[StyleSheet.absoluteFillObject, { opacity: opacity1 }]}>
          <LinearGradient
            colors={['#E8F4FF', '#FFEEF7', '#FFF9E8']}
            style={StyleSheet.absoluteFillObject}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
          />
        </Animated.View>

        <Animated.View style={[StyleSheet.absoluteFillObject, { opacity: opacity2 }]}>
          <LinearGradient
            colors={['#FFE8F7', '#FFF4E8', '#FFFDE8']}
            style={StyleSheet.absoluteFillObject}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
          />
        </Animated.View>

        <Animated.View style={[StyleSheet.absoluteFillObject, { opacity: opacity3 }]}>
          <LinearGradient
            colors={['#FFF4E8', '#FFFDE8', '#FFFFE8']}
            style={StyleSheet.absoluteFillObject}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
          />
        </Animated.View>

        <Animated.View style={[StyleSheet.absoluteFillObject, { opacity: opacity4 }]}>
          <LinearGradient
            colors={['#FFFDE8', '#F4E8FF', '#E8F4FF']}
            style={StyleSheet.absoluteFillObject}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
          />
        </Animated.View>
      </View>
      
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <View>
            <Text style={styles.networkText}>AURA NETWORK</Text>
            <Text style={styles.socialText}>Social</Text>
          </View>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => setShowAddModal(true)}
          >
            <Ionicons name="person-add" size={22} color="#000" />
          </TouchableOpacity>
        </View>

        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* VIBING NOW SECTION */}
          <View style={styles.section}>
            <View style={styles.vibingHeader}>
              <View style={styles.pastelGreenDot} />
              <Text style={styles.sectionTitle}>VIBING NOW</Text>
            </View>

            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.vibingScroll}
              contentContainerStyle={styles.vibingScrollContent}
            >
              {vibingNow.map((friend) => (
                <TouchableOpacity 
                  key={friend.id} 
                  style={styles.vibingCard}
                  onPress={() => handleFriendClick(friend)}
                >
                  <View style={styles.avatarContainer}>
                    {friend.image ? (
                      <Image 
                        source={{ uri: friend.image }} 
                        style={styles.vibingAvatar}
                      />
                    ) : (
                      <GradientAvatar size={90} />
                    )}
                    {friend.isOnline && <View style={styles.onlineDot} />}
                  </View>
                  <Text style={styles.vibingName}>{friend.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* RECENT AURAS SECTION */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>RECENT AURAS</Text>

            {recentAuras.map((aura) => (
              <TouchableOpacity 
                key={aura.id} 
                style={styles.auraCard}
                onPress={() => handleFriendClick(aura)}
              >
                <View style={styles.auraLeft}>
                  {aura.image ? (
                    <Image 
                      source={{ uri: aura.image }} 
                      style={styles.auraAvatar}
                    />
                  ) : (
                    <GradientAvatar size={64} />
                  )}
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
      </SafeAreaView>

      {/* Add Friend Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddModal(false)}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <TouchableOpacity 
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={() => setShowAddModal(false)}
          />
          
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Friend</Text>
              <TouchableOpacity 
                onPress={() => setShowAddModal(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={28} color="#000" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>FRIEND'S NAME</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter name"
                  value={friendName}
                  onChangeText={setFriendName}
                  placeholderTextColor="#999"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>USERNAME</Text>
                <TextInput
                  style={styles.input}
                  placeholder="@username"
                  value={friendUsername}
                  onChangeText={setFriendUsername}
                  placeholderTextColor="#999"
                  autoCapitalize="none"
                />
              </View>

              <TouchableOpacity 
                style={styles.addFriendButton}
                onPress={handleAddFriend}
              >
                <LinearGradient
                  colors={['#FFA0C9', '#C9A0FF']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.addFriendGradient}
                >
                  <Ionicons name="person-add" size={20} color="#FFF" />
                  <Text style={styles.addFriendText}>ADD FRIEND</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Delete Friend Modal */}
      <Modal
        visible={showDeleteModal}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <View style={styles.deleteModalOverlay}>
          <TouchableOpacity 
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={() => setShowDeleteModal(false)}
          />
          
          <View style={styles.deleteModalContent}>
            {selectedFriend && (
              <>
                <View style={styles.deleteModalAvatar}>
                  {selectedFriend.image ? (
                    <Image 
                      source={{ uri: selectedFriend.image }} 
                      style={styles.deleteAvatarImage}
                    />
                  ) : (
                    <GradientAvatar size={80} />
                  )}
                </View>

                <Text style={styles.deleteModalTitle}>Remove Friend?</Text>
                <Text style={styles.deleteModalSubtitle}>
                  Are you sure you want to remove {selectedFriend.name} from your friends?
                </Text>

                <View style={styles.deleteModalButtons}>
                  <TouchableOpacity 
                    style={styles.cancelButton}
                    onPress={() => setShowDeleteModal(false)}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={styles.deleteButton}
                    onPress={handleDeleteFriend}
                  >
                    <Text style={styles.deleteButtonText}>Remove</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 24,
    paddingTop: 10,
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
    fontFamily: 'PlayfairDisplay_400Regular_Italic',
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
  pastelGreenDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#B4E7CE',
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 2.5,
    color: '#000',
    marginBottom: 4,
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
    backgroundColor: '#B4E7CE',
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
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 28,
    padding: 18,
    marginBottom: 16,
    marginTop: 8,
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
    marginBottom: 6,
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
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#000',
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBody: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 2,
    color: '#000',
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#F8F8F8',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    fontSize: 16,
    color: '#000',
    borderWidth: 2,
    borderColor: '#F0F0F0',
  },
  addFriendButton: {
    marginTop: 12,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  addFriendGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
  },
  addFriendText: {
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 2,
    color: '#FFF',
    marginLeft: 10,
  },
  deleteModalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  deleteModalContent: {
    backgroundColor: '#FFF',
    borderRadius: 30,
    padding: 30,
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
  },
  deleteModalAvatar: {
    marginBottom: 20,
  },
  deleteAvatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  deleteModalTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#000',
    marginBottom: 12,
    textAlign: 'center',
  },
  deleteModalSubtitle: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  deleteModalButtons: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F0F0F0',
    borderRadius: 20,
    paddingVertical: 16,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
  },
  deleteButton: {
    flex: 1,
    backgroundColor: '#FF6B6B',
    borderRadius: 20,
    paddingVertical: 16,
    alignItems: 'center',
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
  },
});