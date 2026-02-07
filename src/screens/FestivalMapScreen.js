import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function FestivalMapScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Festival Map Screen</Text>
      <Text>Festival sentiment heatmap coming soon</Text>
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