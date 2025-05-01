// File: src/components/AddList.js

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native';

const AddList = ({ onAddList, zoomedOut }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [listTitle, setListTitle] = useState('');

  const handleAddList = () => {
    if (listTitle.trim() !== '') {
      onAddList(listTitle.trim());
      setListTitle('');
      setIsAdding(false);
    }
  };

  const cancelAddList = () => {
    setIsAdding(false);
    setListTitle('');
  };

  // Adjust container width based on zoom level
  const containerStyle = [
    styles.container,
    zoomedOut ? styles.zoomedOutContainer : null
  ];

  return (
    <View style={containerStyle}>
      {isAdding ? (
        <>
          <TextInput
            style={styles.input}
            value={listTitle}
            onChangeText={setListTitle}
            placeholder="Enter list title..."
            placeholderTextColor="#8697A8"
            autoFocus
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.addButton} onPress={handleAddList}>
              <Text style={styles.addButtonText}>Add List</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={cancelAddList}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <TouchableOpacity 
          style={styles.addListButton} 
          onPress={() => setIsAdding(true)}
        >
          <Text style={[styles.addListButtonText, zoomedOut ? styles.zoomedOutText : null]}>
            {zoomedOut ? '+ List' : '+ Add another list'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(235, 236, 240, 0.6)',
    borderRadius: 4,
    width: 270,
    marginHorizontal: 8,
    padding: 8,
    alignSelf: 'flex-start',
  },
  zoomedOutContainer: {
    width: 180,
    padding: 4,
  },
  zoomedOutText: {
    fontSize: 12,
  },
  addListButton: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  addListButtonText: {
    color: '#5E6C84',
    fontSize: 14,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#DFE1E6',
    borderRadius: 4,
    backgroundColor: '#ffffff',
    paddingHorizontal: 8,
    paddingVertical: 8,
    fontSize: 14,
    color: '#172B4D',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 8,
  },
  addButton: {
    backgroundColor: '#0079BF',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginRight: 8,
  },
  addButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
  cancelButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  cancelButtonText: {
    color: '#172B4D',
    fontSize: 14,
  },
});

export default AddList;