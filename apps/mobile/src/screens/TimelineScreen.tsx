import { useQuery } from '@apollo/client';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View
} from 'react-native';

import { AppCard } from '../components/AppCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useTheme } from '../contexts/ThemeContext';
import { GET_TIMELINE_APPS } from '../services/queries';
import { App } from '../types';

export const TimelineScreen: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);

  const { data, loading, error, fetchMore, refetch } = useQuery(GET_TIMELINE_APPS, {
    variables: { limit: 20, offset: 0 },
    notifyOnNetworkStatusChange: true,
  });

  const apps: App[] = data?.timelineApps || [];

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  };

  const handleLoadMore = () => {
    if (!loading && apps.length > 0) {
      fetchMore({
        variables: {
          offset: apps.length,
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;
          return {
            timelineApps: [...prev.timelineApps, ...fetchMoreResult.timelineApps],
          };
        },
      });
    }
  };

  const handleAppPress = (app: App) => {
    navigation.navigate('AppDetail', { app });
  };

  const renderApp = ({ item, index }: { item: App; index: number }) => (
    <AppCard
      app={item}
      onPress={() => handleAppPress(item)}
      index={index}
    />
  );

  const renderHeader = () => (
    <View style={[styles.header, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>
        Discover Amazing Apps
      </Text>
      <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
        Explore the latest applications across all platforms
      </Text>
    </View>
  );

  const renderFooter = () => {
    if (loading && apps.length > 0) {
      return (
        <View style={styles.footer}>
          <LoadingSpinner />
        </View>
      );
    }
    return null;
  };

  const renderEmpty = () => (
    <View style={styles.empty}>
      <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
        No apps found. Check back later!
      </Text>
    </View>
  );

  if (loading && apps.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <LoadingSpinner />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.errorText, { color: theme.colors.error }]}>
          Error loading timeline: {error.message}
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <FlatList
        data={apps}
        renderItem={renderApp}
        keyExtractor={(item: App) => item.id}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={theme.colors.primary}
          />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 20,
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 22,
  },
  footer: {
    padding: 20,
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
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    padding: 20,
  },
});
