import React, { useState } from 'react';
import {
    Dimensions,
    FlatList,
    Image,
    StyleSheet,
    Text,
    View
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { useTheme } from '../contexts/ThemeContext';
import { Media } from '../types';

interface AppScreenshotsProps {
  media: Media[];
  loading: boolean;
}

const {width: screenWidth} = Dimensions.get('window');
const imageWidth = screenWidth - 32;
const imageHeight = (imageWidth * 9) / 16; // 16:9 aspect ratio

export const AppScreenshots: React.FC<AppScreenshotsProps> = ({media, loading}) => {
  const {theme} = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);

  const screenshots = media.filter(m => m.type === 'screenshot' || m.type === 'cover');
  const logo = media.find(m => m.type === 'logo');

  if (loading) {
    return (
      <View style={[styles.loadingContainer, {backgroundColor: theme.colors.surface}]}>
        <Icon name="image" size={48} color={theme.colors.textSecondary} />
        <Text style={[styles.loadingText, {color: theme.colors.textSecondary}]}>
          Loading screenshots...
        </Text>
      </View>
    );
  }

  if (screenshots.length === 0 && !logo) {
    return (
      <View style={[styles.emptyContainer, {backgroundColor: theme.colors.surface}]}>
        <Icon name="image" size={48} color={theme.colors.textSecondary} />
        <Text style={[styles.emptyText, {color: theme.colors.textSecondary}]}>
          No screenshots available
        </Text>
      </View>
    );
  }

  const renderScreenshot = ({item}: {item: Media}) => (
    <View style={styles.imageContainer}>
      <Image
        source={{uri: item.url}}
        style={[styles.image, {backgroundColor: theme.colors.surface}]}
        resizeMode="cover"
      />
    </View>
  );

  const onViewableItemsChanged = ({viewableItems}: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  };

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={screenshots.length > 0 ? screenshots : [logo]}
        renderItem={renderScreenshot}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        contentContainerStyle={styles.listContent}
      />

      {/* Pagination dots */}
      {(screenshots.length > 1 || (screenshots.length === 0 && logo)) && (
        <View style={styles.pagination}>
          {screenshots.length > 0 ? (
            screenshots.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  {
                    backgroundColor:
                      index === currentIndex
                        ? theme.colors.primary
                        : theme.colors.border,
                  },
                ]}
              />
            ))
          ) : (
            <View
              style={[
                styles.dot,
                {backgroundColor: theme.colors.primary},
              ]}
            />
          )}
        </View>
      )}

      {/* Image counter */}
      {screenshots.length > 1 && (
        <View style={styles.counter}>
          <Text style={[styles.counterText, {color: theme.colors.textSecondary}]}>
            {currentIndex + 1} of {screenshots.length}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  listContent: {
    paddingHorizontal: 16,
  },
  imageContainer: {
    width: imageWidth,
    height: imageHeight,
    marginRight: 16,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  loadingContainer: {
    height: imageHeight,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginHorizontal: 16,
  },
  loadingText: {
    marginTop: 8,
    fontSize: 14,
  },
  emptyContainer: {
    height: imageHeight,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginHorizontal: 16,
  },
  emptyText: {
    marginTop: 8,
    fontSize: 14,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  counter: {
    alignItems: 'center',
    marginTop: 8,
  },
  counterText: {
    fontSize: 12,
  },
});
