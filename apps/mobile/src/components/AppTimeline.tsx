import { format } from 'date-fns';
import React from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { useTheme } from '../contexts/ThemeContext';
import { TimelineEvent } from '../types';

interface AppTimelineProps {
  events: TimelineEvent[];
  loading: boolean;
}

export const AppTimeline: React.FC<AppTimelineProps> = ({events, loading}) => {
  const {theme} = useTheme();

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'release':
        return 'rocket-launch';
      case 'update':
        return 'update';
      case 'milestone':
        return 'star';
      case 'announcement':
        return 'campaign';
      case 'feature':
        return 'auto-awesome';
      case 'bugfix':
        return 'bug-report';
      default:
        return 'campaign';
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'release':
        return theme.colors.success;
      case 'update':
        return theme.colors.primary;
      case 'milestone':
        return theme.colors.warning;
      case 'announcement':
        return '#8b5cf6';
      case 'feature':
        return '#6366f1';
      case 'bugfix':
        return theme.colors.error;
      default:
        return theme.colors.textSecondary;
    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM d, yyyy');
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <Text style={[styles.loadingText, {color: theme.colors.textSecondary}]}>
          Loading timeline...
        </Text>
      </View>
    );
  }

  if (events.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={[styles.emptyText, {color: theme.colors.textSecondary}]}>
          No timeline events yet.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {events.map((event, index) => (
        <View key={event.id} style={styles.eventContainer}>
          {/* Timeline line */}
          {index !== events.length - 1 && (
            <View
              style={[
                styles.timelineLine,
                {backgroundColor: theme.colors.border},
              ]}
            />
          )}

          <View style={styles.eventContent}>
            {/* Event icon */}
            <View
              style={[
                styles.eventIcon,
                {backgroundColor: getEventColor(event.type) + '20'},
              ]}
            >
              <Icon
                name={getEventIcon(event.type)}
                size={20}
                color={getEventColor(event.type)}
              />
            </View>

            {/* Event details */}
            <View style={styles.eventDetails}>
              <View style={styles.eventHeader}>
                <Text style={[styles.eventTitle, {color: theme.colors.text}]}>
                  {event.title}
                </Text>
                {event.version && (
                  <View
                    style={[
                      styles.versionTag,
                      {backgroundColor: theme.colors.surface},
                    ]}
                  >
                    <Text style={[styles.versionText, {color: theme.colors.textSecondary}]}>
                      v{event.version}
                    </Text>
                  </View>
                )}
              </View>

              <View style={styles.eventMeta}>
                <Text style={[styles.eventDate, {color: theme.colors.textSecondary}]}>
                  {formatDate(event.date)}
                </Text>
                <Text style={[styles.eventType, {color: theme.colors.textSecondary}]}>
                  • {event.type}
                </Text>
              </View>

              {event.description && (
                <Text style={[styles.eventDescription, {color: theme.colors.text}]}>
                  {event.description}
                </Text>
              )}
            </View>
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingLeft: 20,
  },
  eventContainer: {
    position: 'relative',
    marginBottom: 24,
  },
  timelineLine: {
    position: 'absolute',
    left: 20,
    top: 40,
    width: 2,
    height: 24,
  },
  eventContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  eventIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  eventDetails: {
    flex: 1,
  },
  eventHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  versionTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginLeft: 8,
  },
  versionText: {
    fontSize: 12,
    fontWeight: '500',
  },
  eventMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  eventDate: {
    fontSize: 14,
  },
  eventType: {
    fontSize: 14,
    textTransform: 'capitalize',
  },
  eventDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  loading: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 14,
  },
  empty: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
  },
});
