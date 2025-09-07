import { useQuery } from '@apollo/client';
import { useNavigation, useRoute } from '@react-navigation/native';
import React from 'react';
import {
    Alert,
    Linking,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { AppScreenshots } from '../components/AppScreenshots';
import { AppTimeline } from '../components/AppTimeline';
import { useTheme } from '../contexts/ThemeContext';
import { GET_MEDIA_BY_APP, GET_TIMELINE_EVENTS_BY_APP } from '../services/queries';
import { App, Media, TimelineEvent } from '../types';

interface RouteParams {
  app: App;
}

export const AppDetailScreen: React.FC = () => {
  const {theme} = useTheme();
  const route = useRoute();
  const navigation = useNavigation();
  const {app} = route.params as RouteParams;

  const {data: mediaData, loading: mediaLoading} = useQuery(GET_MEDIA_BY_APP, {
    variables: {appId: app.id},
  });

  const {data: timelineData, loading: timelineLoading} = useQuery(GET_TIMELINE_EVENTS_BY_APP, {
    variables: {appId: app.id, isPublic: true},
  });

  const media: Media[] = mediaData?.mediaByApp || [];
  const timelineEvents: TimelineEvent[] = timelineData?.timelineEventsByApp || [];

  const handleLinkPress = async (url: string) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Error', 'Cannot open this link');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to open link');
    }
  };

  const renderActionButton = (title: string, url: string, icon: string) => {
    if (!url) return null;

    return (
      <TouchableOpacity
        key={title}
        style={[styles.actionButton, {backgroundColor: theme.colors.primary}]}
        onPress={() => handleLinkPress(url)}
      >
        <Icon name={icon} size={20} color="white" />
        <Text style={styles.actionButtonText}>{title}</Text>
      </TouchableOpacity>
    );
  };

  const renderPlatforms = () => {
    if (!app.platforms || app.platforms.length === 0) return null;

    return (
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, {color: theme.colors.text}]}>
          Platforms
        </Text>
        <View style={styles.platformsContainer}>
          {app.platforms.map((platform) => (
            <View
              key={platform}
              style={[styles.platformTag, {backgroundColor: theme.colors.surface}]}
            >
              <Text style={[styles.platformText, {color: theme.colors.text}]}>
                {platform.toUpperCase()}
              </Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderTags = () => {
    if (!app.tags || app.tags.length === 0) return null;

    return (
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, {color: theme.colors.text}]}>
          Tags
        </Text>
        <View style={styles.tagsContainer}>
          {app.tags.slice(0, 10).map((tag) => (
            <View
              key={tag}
              style={[styles.tag, {backgroundColor: theme.colors.primary + '20'}]}
            >
              <Text style={[styles.tagText, {color: theme.colors.primary}]}>
                {tag}
              </Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderActions = () => {
    const actions = [
      {title: 'Try Demo', url: app.demoUrl, icon: 'play-arrow'},
      {title: 'Download', url: app.downloadUrl, icon: 'download'},
      {title: 'Website', url: app.website, icon: 'open-in-new'},
      {title: 'Source Code', url: app.repository, icon: 'code'},
      {title: 'App Store', url: app.appStoreUrl, icon: 'store'},
      {title: 'Play Store', url: app.playStoreUrl, icon: 'store'},
    ].filter(action => action.url);

    if (actions.length === 0) return null;

    return (
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, {color: theme.colors.text}]}>
          Get Started
        </Text>
        <View style={styles.actionsContainer}>
          {actions.map((action) => renderActionButton(action.title, action.url, action.icon))}
        </View>
      </View>
    );
  };

  return (
    <ScrollView
      style={[styles.container, {backgroundColor: theme.colors.background}]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={[styles.header, {backgroundColor: theme.colors.surface}]}>
        <Text style={[styles.title, {color: theme.colors.text}]}>
          {app.title}
        </Text>
        <Text style={[styles.subtitle, {color: theme.colors.textSecondary}]}>
          by {app.createdBy.name}
        </Text>
        <Text style={[styles.description, {color: theme.colors.text}]}>
          {app.shortDesc}
        </Text>
      </View>

      {/* Screenshots */}
      <View style={styles.section}>
        <AppScreenshots media={media} loading={mediaLoading} />
      </View>

      {/* Platforms */}
      {renderPlatforms()}

      {/* Tags */}
      {renderTags()}

      {/* Actions */}
      {renderActions()}

      {/* Description */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, {color: theme.colors.text}]}>
          About
        </Text>
        <Text style={[styles.description, {color: theme.colors.text}]}>
          {app.longDesc}
        </Text>
      </View>

      {/* Timeline */}
      {timelineEvents.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, {color: theme.colors.text}]}>
            Timeline
          </Text>
          <AppTimeline events={timelineEvents} loading={timelineLoading} />
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 22,
  },
  section: {
    padding: 20,
    paddingTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  platformsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  platformTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  platformText: {
    fontSize: 12,
    fontWeight: '600',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '500',
  },
  actionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});
