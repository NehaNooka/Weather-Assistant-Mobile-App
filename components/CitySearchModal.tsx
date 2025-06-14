import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { searchCity } from '../services/weatherService';

interface CitySearchModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectCity: (city: { name: string; latitude: number; longitude: number; country: string }) => void;
}

export default function CitySearchModal({ visible, onClose, onSelectCity }: CitySearchModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (searchQuery.trim().length < 2) return;

    setLoading(true);
    try {
      const results = await searchCity(searchQuery);
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching cities:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCity = (city: any) => {
    onSelectCity({
      name: city.name,
      latitude: city.latitude,
      longitude: city.longitude,
      country: city.country || city.country_code || ''
    });
    setSearchQuery('');
    setSearchResults([]);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalContainer}
      >
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Add City</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search for a city..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
              autoFocus
            />
            <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
              <Ionicons name="search" size={20} color="white" />
            </TouchableOpacity>
          </View>

          {loading ? (
            <ActivityIndicator size="large" color="#3B82F6" style={styles.loader} />
          ) : (
            <FlatList
              data={searchResults}
              keyExtractor={(item) => `${item.id}`}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.cityItem}
                  onPress={() => handleSelectCity(item)}
                >
                  <View>
                    <Text style={styles.cityName}>{item.name}</Text>
                    <Text style={styles.cityDetails}>
                      {item.admin1 ? `${item.admin1}, ` : ''}{item.country}
                    </Text>
                  </View>
                  <Ionicons name="add-circle-outline" size={24} color="#3B82F6" />
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                searchQuery.length > 0 && !loading ? (
                  <Text style={styles.emptyText}>No cities found</Text>
                ) : null
              }
            />
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 40,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    marginRight: 10,
  },
  searchButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 10,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loader: {
    marginTop: 20,
  },
  cityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  cityName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  cityDetails: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  emptyText: {
    textAlign: 'center',
    color: '#6B7280',
    marginTop: 20,
  },
});
