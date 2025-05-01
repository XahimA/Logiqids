// File: App.js - Main Application File with Fixed Drag & Drop

import React, { useState, useEffect, useRef } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  Text,
  View,
  Animated,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BoardList from './components/BoardList';
import AddList from './components/AddList';
import Header from './components/Header';
import Footer from './components/Footer';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const STORAGE_KEY = 'TRELLO_CLONE_DATA';
const ZOOM_PREF_KEY = 'TRELLO_CLONE_ZOOM';
const { width } = Dimensions.get('window');

const App = () => {
  const [lists, setLists] = useState([]);
  const [isListDragging, setIsListDragging] = useState(false);
  const [draggedList, setDraggedList] = useState(null);
  const [draggedListIndex, setDraggedListIndex] = useState(null);
  const [zoomedOut, setZoomedOut] = useState(false);
  
  const scrollViewRef = useRef(null);
  const listPositions = useRef([]);
  const scrollX = useRef(new Animated.Value(0)).current;
  const scrollOffset = useRef(0);
  const autoScrollInterval = useRef(null);
  
  // Initialize with sample data if no data is found
  useEffect(() => {
    loadData();
    loadZoomPreference();
  }, []);

  // Track scroll position
  useEffect(() => {
    const scrollListener = scrollX.addListener(({ value }) => {
      scrollOffset.current = value;
    });
    
    return () => {
      scrollX.removeListener(scrollListener);
      if (autoScrollInterval.current) {
        clearInterval(autoScrollInterval.current);
      }
    };
  }, [scrollX]);

  // Calculate list positions whenever lists change or zoom level changes
  useEffect(() => {
    calculateListPositions();
  }, [lists, zoomedOut]);

  const calculateListPositions = () => {
    // Reset list positions array
    listPositions.current = [];
    
    // Calculate the absolute position of each list
    const listWidth = zoomedOut ? 180 : 270; // Adjusted for zoomed out mode
    const margin = 8;
    const listTotalWidth = listWidth + 2 * margin;
    
    lists.forEach((_, index) => {
      const absolutePosition = index * listTotalWidth;
      listPositions.current.push(absolutePosition);
    });
  };

  const loadZoomPreference = async () => {
    try {
      const zoomPref = await AsyncStorage.getItem(ZOOM_PREF_KEY);
      if (zoomPref !== null) {
        setZoomedOut(JSON.parse(zoomPref));
      }
    } catch (error) {
      console.error('Error loading zoom preference:', error);
    }
  };

  const saveZoomPreference = async (value) => {
    try {
      await AsyncStorage.setItem(ZOOM_PREF_KEY, JSON.stringify(value));
    } catch (error) {
      console.error('Error saving zoom preference:', error);
    }
  };

  const loadData = async () => {
    try {
      const storedData = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedData) {
        setLists(JSON.parse(storedData));
      } else {
        // Initial sample data
        const initialData = [
          {
            id: '1',
            title: 'To Do',
            cards: [
              { id: '101', title: 'Learn React Native', description: 'Complete tutorials', dueDate: '2025-05-10' },
              { id: '102', title: 'Build Trello Clone', description: 'Implement all features', dueDate: '2025-05-20' }
            ]
          },
          {
            id: '2',
            title: 'In Progress',
            cards: [
              { id: '201', title: 'Create UI Components', description: 'Design matching Trello', dueDate: '2025-05-05' }
            ]
          },
          {
            id: '3',
            title: 'Done',
            cards: [
              { id: '301', title: 'Project Setup', description: 'Initialize project with CLI', dueDate: '2025-05-01' }
            ]
          }
        ];
        setLists(initialData);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
      }
    } catch (error) {
      console.error('Error loading data from storage:', error);
    }
  };

  const saveData = async (updatedLists) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedLists));
    } catch (error) {
      console.error('Error saving data to storage:', error);
    }
  };

  const addNewList = (title) => {
    const newList = {
      id: Date.now().toString(),
      title,
      cards: []
    };
    
    const updatedLists = [...lists, newList];
    setLists(updatedLists);
    saveData(updatedLists);
  };

  const deleteList = (listId) => {
    Alert.alert(
      "Delete List",
      "Are you sure you want to delete this list and all its cards?",
      [
        { 
          text: "Cancel",
          style: "cancel" 
        },
        { 
          text: "Delete", 
          onPress: () => {
            const updatedLists = lists.filter(list => list.id !== listId);
            setLists(updatedLists);
            saveData(updatedLists);
          },
          style: "destructive"
        }
      ]
    );
  };

  const renameList = (listId, newTitle) => {
    const updatedLists = lists.map(list => {
      if (list.id === listId) {
        return { ...list, title: newTitle };
      }
      return list;
    });
    
    setLists(updatedLists);
    saveData(updatedLists);
  };

  const addCardToList = (listId, cardTitle) => {
    const newCard = {
      id: Date.now().toString(),
      title: cardTitle,
      description: '',
      dueDate: ''
    };
    
    const updatedLists = lists.map(list => {
      if (list.id === listId) {
        return {
          ...list,
          cards: [...list.cards, newCard]
        };
      }
      return list;
    });
    
    setLists(updatedLists);
    saveData(updatedLists);
  };

  const updateCard = (listId, cardId, updatedCard) => {
    const updatedLists = lists.map(list => {
      if (list.id === listId) {
        const updatedCards = list.cards.map(card => {
          if (card.id === cardId) {
            return { ...card, ...updatedCard };
          }
          return card;
        });
        return { ...list, cards: updatedCards };
      }
      return list;
    });
    
    setLists(updatedLists);
    saveData(updatedLists);
  };

  const deleteCard = (listId, cardId) => {
    Alert.alert(
      "Delete Card",
      "Are you sure you want to delete this card?",
      [
        { 
          text: "Cancel",
          style: "cancel" 
        },
        { 
          text: "Delete", 
          onPress: () => {
            const updatedLists = lists.map(list => {
              if (list.id === listId) {
                const updatedCards = list.cards.filter(card => card.id !== cardId);
                return { ...list, cards: updatedCards };
              }
              return list;
            });
            
            setLists(updatedLists);
            saveData(updatedLists);
          },
          style: "destructive"
        }
      ]
    );
  };

  const moveCard = (sourceListId, destinationListIdOrIndex, cardId, destinationIndex) => {
    // Find the card to move
    let cardToMove = null;
    let sourceListIndex = -1;
    
    const updatedLists = [...lists];
    let destinationListId = destinationListIdOrIndex;
    
    // If destinationListId is a number (i.e., an index), convert it to an ID
    if (typeof destinationListIdOrIndex === 'number' && 
        destinationListIdOrIndex >= 0 && 
        destinationListIdOrIndex < lists.length) {
      destinationListId = lists[destinationListIdOrIndex].id;
    }
    
    // Find the card to move from the source list
    for (let i = 0; i < updatedLists.length; i++) {
      if (updatedLists[i].id === sourceListId) {
        sourceListIndex = i;
        const cardIndex = updatedLists[i].cards.findIndex(card => card.id === cardId);
        if (cardIndex !== -1) {
          cardToMove = updatedLists[i].cards[cardIndex];
          updatedLists[i].cards.splice(cardIndex, 1);
        }
        break;
      }
    }
    
    if (!cardToMove) return;
    
    // Find the destination list and insert the card
    for (let i = 0; i < updatedLists.length; i++) {
      if (updatedLists[i].id === destinationListId) {
        // If destinationIndex is provided, insert at that index, otherwise append
        if (destinationIndex !== undefined) {
          updatedLists[i].cards.splice(destinationIndex, 0, cardToMove);
        } else {
          updatedLists[i].cards.push(cardToMove);
        }
        break;
      }
    }
    
    setLists(updatedLists);
    saveData(updatedLists);
  };

  // Improved reorderLists function
  const reorderLists = (sourceIndex, destinationIndex) => {
    if (sourceIndex === destinationIndex) return;
    
    // Create a copy of the current lists array
    const updatedLists = [...lists];
    
    // Remove the list from its original position
    const [movedList] = updatedLists.splice(sourceIndex, 1);
    
    // Insert the list at the new position
    updatedLists.splice(destinationIndex, 0, movedList);
    
    // Update state and save to storage
    setLists(updatedLists);
    saveData(updatedLists);
    
    // Debug log for verification
    console.log(`Moved list from index ${sourceIndex} to index ${destinationIndex}`);
  };

  const resetBoard = () => {
    Alert.alert(
      "Reset Board",
      "Are you sure you want to clear all lists and cards?",
      [
        { 
          text: "Cancel",
          style: "cancel" 
        },
        { 
          text: "Reset", 
          onPress: async () => {
            setLists([]);
            await AsyncStorage.removeItem(STORAGE_KEY);
            // Reload sample data after reset
            loadData();
          },
          style: "destructive"
        }
      ]
    );
  };

  const startAutoScroll = (direction) => {
    if (autoScrollInterval.current) {
      clearInterval(autoScrollInterval.current);
    }
    
    const scrollAmount = direction === 'left' ? -15 : 15;
    
    autoScrollInterval.current = setInterval(() => {
      if (scrollViewRef.current) {
        const newScrollPosition = scrollOffset.current + scrollAmount;
        scrollViewRef.current.scrollTo({ x: newScrollPosition, animated: true });
      }
    }, 16); // ~60fps
  };

  const stopAutoScroll = () => {
    if (autoScrollInterval.current) {
      clearInterval(autoScrollInterval.current);
      autoScrollInterval.current = null;
    }
  };

  const onListDragStart = (list, index) => {
    setIsListDragging(true);
    setDraggedList(list);
    setDraggedListIndex(index);
    
    // Make sure list positions are calculated
    calculateListPositions();
  };

  const onListDragMove = (gestureState) => {
    // Handle auto-scrolling during drag
    const { moveX } = gestureState;
    const scrollAreaSize = 80; // pixels from edge for auto-scroll
    
    if (moveX < scrollAreaSize) {
      // Auto-scroll left
      startAutoScroll('left');
    } else if (moveX > width - scrollAreaSize) {
      // Auto-scroll right
      startAutoScroll('right');
    } else {
      // Stop auto-scroll when not near edges
      stopAutoScroll();
    }
  };

  // Improved list drag end handler
  const onListDragEnd = (dx) => {
    // Stop any auto-scrolling
    stopAutoScroll();
    
    if (draggedListIndex === null) return;
    
    // Calculate list width based on zoom level
    const listWidth = zoomedOut ? 180 : 270;
    const listMargin = 8 * 2; // 8px margin on each side
    const listTotalWidth = listWidth + listMargin;
    
    // Get the current absolute position of the dragged list
    const currentPosition = listPositions.current[draggedListIndex];
    
    // Calculate the new position after drag
    const newPosition = currentPosition + dx;
    
    // Calculate which index this new position corresponds to
    let targetIndex = Math.round(newPosition / listTotalWidth);
    
    // Constrain the target index to be within valid bounds
    targetIndex = Math.max(0, Math.min(lists.length - 1, targetIndex));
    
    // Only reorder if the position actually changed
    if (targetIndex !== draggedListIndex) {
      reorderLists(draggedListIndex, targetIndex);
    }
    
    // Clean up drag state
    setIsListDragging(false);
    setDraggedList(null);
    setDraggedListIndex(null);
  };

  const toggleZoom = () => {
    const newZoomState = !zoomedOut;
    setZoomedOut(newZoomState);
    saveZoomPreference(newZoomState);
  };

  const handleScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    scrollX.setValue(scrollPosition);
  };

  const scrollTo = (x) => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ x, animated: true });
    }
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaView style={styles.container}>
        <Header resetBoard={resetBoard} />
        
        <View style={styles.controlsContainer}>
          <TouchableOpacity
            style={styles.zoomButton}
            onPress={toggleZoom}
          >
            <FontAwesome name={zoomedOut ? "search-plus" : "search-minus"} size={18} color="#172B4D" />
            <Text style={styles.zoomButtonText}>{zoomedOut ? "Zoom In" : "Zoom Out"}</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView
          ref={scrollViewRef}
          horizontal
          contentContainerStyle={styles.boardContainer}
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          decelerationRate="normal"
        >
          {lists.map((list, index) => (
            <BoardList
              key={list.id}
              list={list}
              onRenameList={renameList}
              onDeleteList={deleteList}
              onAddCard={addCardToList}
              onUpdateCard={updateCard}
              onDeleteCard={deleteCard}
              onMoveCard={moveCard}
              onDragStart={onListDragStart}
              onDragMove={onListDragMove}
              onDragEnd={onListDragEnd}
              isDragging={isListDragging && draggedList?.id === list.id}
              listsCount={lists.length}
              listIndex={index}
              zoomedOut={zoomedOut}
              scrollViewRef={scrollViewRef}
              currentScrollPosition={scrollOffset.current}
              onScrollTo={scrollTo}
            />
          ))}
          
          <AddList onAddList={addNewList} zoomedOut={zoomedOut} />
        </ScrollView>
        
        <Footer />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },
  boardContainer: {
    paddingHorizontal: 8,
    paddingVertical: 16,
    alignItems: 'flex-start',
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  zoomButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E4E5E9',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  zoomButtonText: {
    marginLeft: 4,
    color: '#172B4D',
    fontSize: 14,
  },
});

export default App;