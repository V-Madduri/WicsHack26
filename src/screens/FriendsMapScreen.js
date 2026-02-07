import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function FriendsMapScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Friends Screen</Text>
      <Text>View your friends' musical maps</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});