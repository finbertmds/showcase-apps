import { format } from 'date-fns';
import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { useTheme } from '../contexts/ThemeContext';
import { App } from '../types';

interface AppCardProps {
  app: App;
  onPress: () => void;
  index?: number;
}

export const AppCard: React.FC<AppCardProps> = ({app, onPress, index = 0}) => {
  const {theme} = useTheme();

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'ios':
      case 'android':
        return 'phone-android';
      case 'desktop':
        return 'computer';
      case 'web':
        return 'language';
      case 'api':
        return 'code';
      default:
        return 'apps';
    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM d, yyyy');
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Timeline indicator */}
      {index > 0 && (
        <View
          style={[
            styles.timelineLine,
            {backgroundColor: theme.colors.border},
          ]}
        />
      )}

      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={[styles.title, {color: theme.colors.text}]}>
              {app.title}
            </Text>
            <Text style={[styles.author, {color: theme.colors.textSecondary}]}>
              by {app.createdBy.name}
            </Text>
          </View>
          
          <View style={styles.stats}>
            <View style={styles.stat}>
              <Icon name="visibility" size={16} color={theme.colors.textSecondary} />
              <Text style={[styles.statText, {color: theme.colors.textSecondary}]}>
                {app.viewCount}
              </Text>
            </View>
            <View style={styles.stat}>
              <Icon name="favorite" size={16} color={theme.colors.textSecondary} />
              <Text style={[styles.statText, {color: theme.colors.textSecondary}]}>
                {app.likeCount}
              </Text>
            </View>
          </View>
        </View>

        {/* Description */}
        <Text
          style={[styles.description, {color: theme.colors.text}]}
          numberOfLines={2}
        >
          {app.shortDesc}
        </Text>

        {/* Platforms */}
        {app.platforms && app.platforms.length > 0 && (
          <View style={styles.platforms}>
            {app.platforms.slice(0, 3).map((platform) => (
              <View
                key={platform}
                style={[
                  styles.platformTag,
                  {backgroundColor: theme.colors.primary + '20'},
                ]}
              >
                <Icon
                  name={getPlatformIcon(platform)}
                  size={14}
                  color={theme.colors.primary}
                />
                <Text
                  style={[
                    styles.platformText,
                    {color: theme.colors.primary},
                  ]}
                >
                  {platform.toUpperCase()}
                </Text>
              </View>
            ))}
            {app.platforms.length > 3 && (
              <Text style={[styles.moreText, {color: theme.colors.textSecondary}]}>
                +{app.platforms.length - 3}
              </Text>
            )}
          </View>
        )}

        {/* Tags */}
        {app.tags && app.tags.length > 0 && (
          <View style={styles.tags}>
            {app.tags.slice(0, 3).map((tag) => (
              <View
                key={tag}
                style={[
                  styles.tag,
                  {backgroundColor: theme.colors.surface},
                ]}
              >
                <Text style={[styles.tagText, {color: theme.colors.textSecondary}]}>
                  {tag}
                </Text>
              </View>
            ))}
            {app.tags.length > 3 && (
              <Text style={[styles.moreText, {color: theme.colors.textSecondary}]}>
                +{app.tags.length - 3}
              </Text>
            )}
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.date, {color: theme.colors.textSecondary}]}>
            {app.releaseDate
              ? formatDate(app.releaseDate)
              : formatDate(app.createdAt)}
          </Text>
          
          <View style={styles.actions}>
            {app.demoUrl && (
              <Icon name="play-arrow" size={20} color={theme.colors.primary} />
            )}
            {app.downloadUrl && (
              <Icon name="download" size={20} color={theme.colors.primary} />
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  timelineLine: {
    position: 'absolute',
    left: 20,
    top: -16,
    width: 2,
    height: 16,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  titleContainer: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 2,
  },
  author: {
    fontSize: 14,
  },
  stats: {
    flexDirection: 'row',
    gap: 12,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  platforms: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  platformTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  platformText: {
    fontSize: 10,
    fontWeight: '600',
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tagText: {
    fontSize: 12,
  },
  moreText: {
    fontSize: 12,
    alignSelf: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    fontSize: 12,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
});
