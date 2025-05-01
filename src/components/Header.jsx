// File: src/components/Header.js

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const Header = ({ resetBoard }) => {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>Trello Clone</Text>
      <TouchableOpacity
        style={styles.resetButton}
        onPress={resetBoard}
      >
        <Text style={styles.resetButtonText}>Reset Board</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 60,
    backgroundColor: '#026AA7',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  title: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  resetButton: {
    backgroundColor: '#EB5A46',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  resetButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
});

export default Header;