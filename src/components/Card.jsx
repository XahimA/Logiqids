import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from 'react-native';

const Card = ({
  card,
  listId,
  onUpdateCard,
  onDeleteCard,
  onDragStart,
  isDragging,
  zoomedOut,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editedTitle, setEditedTitle] = useState(card.title);
  const [editedDescription, setEditedDescription] = useState(card.description || '');
  const [editedDueDate, setEditedDueDate] = useState(card.dueDate || '');

  const openModal = () => {
    setEditedTitle(card.title);
    setEditedDescription(card.description || '');
    setEditedDueDate(card.dueDate || '');
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const handleSave = () => {
    if (editedTitle.trim() === '') {
      Alert.alert('Error', 'Card title cannot be empty');
      return;
    }

    onUpdateCard(listId, card.id, {
      title: editedTitle.trim(),
      description: editedDescription.trim(),
      dueDate: editedDueDate.trim(),
    });
    closeModal();
  };

  const handleDelete = () => {
    closeModal();
    onDeleteCard(listId, card.id);
  };

  const formattedDate = card.dueDate
    ? new Date(card.dueDate).toLocaleDateString('en-US', {
        month: 'numeric',
        day: 'numeric',
      })
    : '';

  const cardStyle = [
    styles.cardContainer,
    isDragging && styles.draggingCard,
    zoomedOut && styles.zoomedOutCard,
  ];

  return (
    <>
      <TouchableOpacity
        style={cardStyle}
        onPress={openModal}
        onLongPress={onDragStart}
      >
        <Text
          style={[styles.cardTitle, zoomedOut && styles.zoomedOutText]}
          numberOfLines={zoomedOut ? 1 : 2}
        >
          {card.title}
        </Text>
        {card.description && !zoomedOut && (
          <Text style={styles.cardDescription} numberOfLines={2}>
            {card.description}
          </Text>
        )}
        {card.dueDate && (
          <View style={styles.dueDateContainer}>
            <Text style={[styles.dueDate, zoomedOut && styles.zoomedOutText]}>
              {zoomedOut ? '📅' : `📅 Due: ${formattedDate}`}
            </Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Modal */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Card</Text>
              <TouchableOpacity onPress={closeModal}>
                <Text style={styles.closeButton}>×</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Title</Text>
              <TextInput
                style={styles.input}
                value={editedTitle}
                onChangeText={setEditedTitle}
                placeholder="Card title"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={editedDescription}
                onChangeText={setEditedDescription}
                placeholder="Card description"
                multiline
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Due Date</Text>
              <TextInput
                style={styles.input}
                value={editedDueDate}
                onChangeText={setEditedDueDate}
                placeholder="YYYY-MM-DD"
              />
            </View>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={handleDelete}
              >
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSave}
              >
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 6,
    padding: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  cardDescription: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
  },
  dueDateContainer: {
    marginTop: 6,
    backgroundColor: '#F0F0F0',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    alignSelf: 'flex-start',
  },
  dueDate: {
    fontSize: 12,
    color: '#444',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  closeButton: {
    fontSize: 26,
    color: '#999',
    fontWeight: '600',
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    color: '#666',
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
    color: '#333',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  saveButton: {
    backgroundColor: '#0079BF',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    flex: 1,
    alignItems: 'center',
    marginLeft: 8,
  },
  deleteButton: {
    backgroundColor: '#EB5A46',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    flex: 1,
    alignItems: 'center',
    marginRight: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  zoomedOutText: {
    fontSize: 13,
    color: '#333',
  },
  draggingCard: {
    opacity: 0.5,
  },
  zoomedOutCard: {
    padding: 8,
  },
});

export default Card;
