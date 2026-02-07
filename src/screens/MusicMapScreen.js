import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function MusicMapScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Music Map Screen</Text>
      <Text>Your musical memories will appear here</Text>
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