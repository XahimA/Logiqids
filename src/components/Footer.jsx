// File: src/components/Footer.js

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Footer = () => {
  return (
    <View style={styles.footer}>
      <Text style={styles.footerText}>Trello Clone © 2025</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    height: 40,
    backgroundColor: '#026AA7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    color: '#ffffff',
    fontSize: 12,
  },
});

export default Footer;