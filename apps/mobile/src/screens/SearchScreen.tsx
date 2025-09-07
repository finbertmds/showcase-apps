import { useQuery } from '@apollo/client';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { AppCard } from '../components/AppCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useTheme } from '../contexts/ThemeContext';
import { GET_APPS } from '../services/queries';
import { App } from '../types';

export const SearchScreen: React.FC = () => {
  const {theme} = useTheme();
  const navigation = useNavigation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('all');

  const {data, loading, error} = useQuery(GET_APPS, {
    variables: {
      limit: 50,
      search: searchTerm || undefined,
      platforms: selectedPlatform !== 'all' ? [selectedPlatform] : undefined,
      status: 'published',
    },
    skip: !searchTerm && selectedPlatform === 'all',
  });

  const apps: App[] = data?.apps || [];

  const handleAppPress = (app: App) => {
    navigation.navigate('AppDetail', {app});
  };

  const renderApp = ({item}: {item: App}) => (
    <AppCard app={item} onPress={() => handleAppPress(item)} />
  );

  const renderEmpty = () => (
    <View style={styles.empty}>
      <Icon name="search" size={64} color={theme.colors.textSecondary} />
      <Text style={[styles.emptyText, {color: theme.colors.textSecondary}]}>
        {searchTerm ? 'No apps found matching your search' : 'Search for apps'}
      </Text>
    </View>
  );

  const platforms = [
    {value: 'all', label: 'All Platforms'},
    {value: 'web', label: 'Web'},
    {value: 'ios', label: 'iOS'},
    {value: 'android', label: 'Android'},
    {value: 'desktop', label: 'Desktop'},
    {value: 'api', label: 'API'},
  ];

  return (
    <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
      {/* Search Header */}
      <View style={[styles.header, {backgroundColor: theme.colors.surface}]}>
        <View style={[styles.searchContainer, {backgroundColor: theme.colors.background}]}>
          <Icon name="search" size={20} color={theme.colors.textSecondary} />
          <TextInput
            style={[styles.searchInput, {color: theme.colors.text}]}
            placeholder="Search apps..."
            placeholderTextColor={theme.colors.textSecondary}
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
        </View>

        {/* Platform Filter */}
        <View style={styles.platformFilter}>
          <FlatList
            data={platforms}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.value}
            renderItem={({item}) => (
              <TouchableOpacity
                style={[
                  styles.platformButton,
                  {
                    backgroundColor: selectedPlatform === item.value
                      ? theme.colors.primary
                      : theme.colors.surface,
                  },
                ]}
                onPress={() => setSelectedPlatform(item.value)}
              >
                <Text
                  style={[
                    styles.platformButtonText,
                    {
                      color: selectedPlatform === item.value
                        ? 'white'
                        : theme.colors.text,
                    },
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>

      {/* Results */}
      {loading ? (
        <View style={styles.loading}>
          <LoadingSpinner />
        </View>
      ) : (
        <FlatList
          data={apps}
          renderItem={renderApp}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={renderEmpty}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    paddingBottom: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  platformFilter: {
    marginTop: 8,
  },
  platformButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  platformButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  listContent: {
    padding: 16,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
  },
});
