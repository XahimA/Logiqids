// File: src/components/BoardList.js

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Animated,
  PanResponder,
  Dimensions,
} from 'react-native';
import Card from './Card';

const { width } = Dimensions.get('window');

const BoardList = ({
  list,
  onRenameList,
  onDeleteList,
  onAddCard,
  onUpdateCard,
  onDeleteCard,
  onMoveCard,
  onDragStart,
  onDragMove,
  onDragEnd,
  isDragging,
  listsCount,
  listIndex,
  zoomedOut,
  scrollViewRef,
  currentScrollPosition,
  onScrollTo,
}) => {
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState('');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(list.title);
  const [isDraggingCard, setIsDraggingCard] = useState(false);
  const [draggedCardId, setDraggedCardId] = useState(null);

  const position = useRef(new Animated.ValueXY()).current;
  const initialTouchX = useRef(0); // Store initial touch X position
  const cumulativeDragDistance = useRef(0); // Track the cumulative drag distance
  
  // Calculate list width based on zoom level
  const listWidth = zoomedOut ? 180 : 270;
  const listMargin = 8 * 2; // 8px on each side
  const listTotalWidth = listWidth + listMargin;
  
  useEffect(() => {
    // Reset position when not dragging
    if (!isDragging) {
      position.setValue({ x: 0, y: 0 });
      cumulativeDragDistance.current = 0;
    }
  }, [isDragging]);

  // Update title when list title changes externally
  useEffect(() => {
    setEditedTitle(list.title);
  }, [list.title]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gesture) => {
        // Only respond to horizontal gestures greater than 5px
        return Math.abs(gesture.dx) > 5;
      },
      onPanResponderGrant: (evt, gesture) => {
        // Save initial touch position for reference
        initialTouchX.current = gesture.x0;
        cumulativeDragDistance.current = 0;
        
        // Reset and prepare the animated value
        position.setOffset({
          x: position.x._value,
          y: position.y._value,
        });
        position.setValue({ x: 0, y: 0 });
        
        // Call parent's onDragStart with list and index
        onDragStart(list, listIndex);
      },
      onPanResponderMove: (evt, gesture) => {
        // Update animated position
        Animated.event(
          [null, { dx: position.x, dy: position.y }],
          { useNativeDriver: false }
        )(evt, gesture);
        
        // Track cumulative drag distance
        cumulativeDragDistance.current = gesture.dx;
        
        // Call onDragMove callback with gesture state for auto-scrolling
        onDragMove && onDragMove(gesture);
      },
      onPanResponderRelease: () => {
        position.flattenOffset();
        
        // Reset position with animation
        Animated.spring(position, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
          friction: 5,
        }).start(() => {
          // Pass the final drag distance for reordering
          onDragEnd(cumulativeDragDistance.current);
        });
      },
    })
  ).current;

  const handleAddCard = () => {
    if (newCardTitle.trim() !== '') {
      onAddCard(list.id, newCardTitle.trim());
      setNewCardTitle('');
      setIsAddingCard(false);
    }
  };

  const cancelAddCard = () => {
    setIsAddingCard(false);
    setNewCardTitle('');
  };

  const handleRenameList = () => {
    if (editedTitle.trim() !== '') {
      onRenameList(list.id, editedTitle.trim());
    } else {
      setEditedTitle(list.title);
    }
    setIsEditingTitle(false);
  };

  const handleCardDragStart = (cardId) => {
    setIsDraggingCard(true);
    setDraggedCardId(cardId);
  };

  const handleCardDragEnd = (destinationListId, destinationIndex) => {
    if (draggedCardId) {
      onMoveCard(list.id, destinationListId, draggedCardId, destinationIndex);
    }
    setIsDraggingCard(false);
    setDraggedCardId(null);
  };

  const animatedStyle = {
    transform: position.getTranslateTransform(),
    zIndex: isDragging ? 999 : 1,
    elevation: isDragging ? 5 : 2,
    opacity: isDragging ? 0.8 : 1,
  };

  // Only apply pan handlers to the drag handle area for better UX
  const dragHandleArea = (
    <View style={styles.dragHandle} {...panResponder.panHandlers}>
      <View style={styles.dragHandleLine} />
      <View style={styles.dragHandleLine} />
    </View>
  );

  // Adjust style based on zoom level
  const containerStyle = [
    styles.listContainer,
    animatedStyle,
    zoomedOut ? styles.zoomedOutListContainer : null
  ];

  return (
    <Animated.View style={containerStyle}>
      <View style={styles.listHeader}>
        {dragHandleArea}
        
        {isEditingTitle ? (
          <View style={styles.editTitleContainer}>
            <TextInput
              style={styles.editTitleInput}
              value={editedTitle}
              onChangeText={setEditedTitle}
              autoFocus
              onBlur={handleRenameList}
              onSubmitEditing={handleRenameList}
            />
          </View>
        ) : (
          <TouchableOpacity 
            style={styles.listTitleContainer} 
            onPress={() => setIsEditingTitle(true)}
          >
            <Text 
              style={[styles.listTitle, zoomedOut ? styles.zoomedOutText : null]}
              numberOfLines={1}
            >
              {list.title}
            </Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => onDeleteList(list.id)}
        >
          <Text style={styles.deleteButtonText}>×</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.cardsContainer}>
        {list.cards.map((card, index) => (
          <Card
            key={card.id}
            card={card}
            listId={list.id}
            onUpdateCard={onUpdateCard}
            onDeleteCard={onDeleteCard}
            onDragStart={() => handleCardDragStart(card.id)}
            onDragEnd={handleCardDragEnd}
            isDragging={isDraggingCard && draggedCardId === card.id}
            zoomedOut={zoomedOut}
          />
        ))}
      </View>
      
      {isAddingCard ? (
        <View style={styles.addCardContainer}>
          <TextInput
            style={styles.input}
            value={newCardTitle}
            onChangeText={setNewCardTitle}
            placeholder="Enter card title..."
            placeholderTextColor="#8697A8"
            autoFocus
            multiline
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.addButton} onPress={handleAddCard}>
              <Text style={styles.addButtonText}>Add Card</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={cancelAddCard}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <TouchableOpacity 
          style={styles.addCardButton} 
          onPress={() => setIsAddingCard(true)}
        >
          <Text style={[styles.addCardButtonText, zoomedOut ? styles.zoomedOutText : null]}>
            {zoomedOut ? '+' : '+ Add a card'}
          </Text>
        </TouchableOpacity>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    backgroundColor: '#EBECF0',
    borderRadius: 4,
    width: 270,
    maxHeight: '95%',
    marginHorizontal: 8,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  zoomedOutListContainer: {
    width: 180,
    padding: 4,
    maxHeight: '75%',
  },
  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  dragHandle: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 4,
    padding: 10, // Increase touch target area
  },
  dragHandleLine: {
    width: 15,
    height: 2,
    backgroundColor: '#B3BAC5',
    marginVertical: 2,
    borderRadius: 1,
  },
  listTitleContainer: {
    flex: 1,
    paddingVertical: 6,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#172B4D',
  },
  zoomedOutText: {
    fontSize: 12,
  },
  editTitleContainer: {
    flex: 1,
  },
  editTitleInput: {
    fontSize: 16,
    fontWeight: '600',
    color: '#172B4D',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#0079BF',
    borderRadius: 3,
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  deleteButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
  },
  deleteButtonText: {
    fontSize: 22,
    color: '#6B778C',
    fontWeight: 'bold',
  },
  cardsContainer: {
    marginBottom: 8,
  },
  addCardButton: {
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  addCardButtonText: {
    color: '#5E6C84',
    fontSize: 14,
  },
  addCardContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: '#DFE1E6',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 6,
    fontSize: 14,
    color: '#172B4D',
    minHeight: 60,
    maxHeight: 120,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 8,
  },
  addButton: {
    backgroundColor: '#0079BF',
    paddingVertical: 6,
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
    paddingVertical: 6, 
    paddingHorizontal: 12,
  },
  cancelButtonText: {
    color: '#172B4D',
    fontSize: 14,
  },
});

export default BoardList