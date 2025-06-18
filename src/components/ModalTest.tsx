import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';

export default function ModalTest() {
  const [visible, setVisible] = useState(false);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setVisible(true)}
      >
        <Text style={styles.buttonText}>Open Test Modal</Text>
      </TouchableOpacity>
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <View style={styles.backdrop}>
          <View style={styles.modalContent}>
            <Text style={{ fontSize: 20, marginBottom: 20 }}>This is a test modal!</Text>
            <TouchableOpacity onPress={() => setVisible(false)}>
              <Text style={{ color: 'blue', fontSize: 18 }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  button: { backgroundColor: '#007AFF', padding: 20, borderRadius: 10 },
  buttonText: { color: 'white', fontSize: 18 },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: 'white', padding: 40, borderRadius: 20, alignItems: 'center' }
}); 