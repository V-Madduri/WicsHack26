import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function AddPinScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Add Pin Screen</Text>
      <Text>Add your musical memories here</Text>
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