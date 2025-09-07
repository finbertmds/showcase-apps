import React from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { useTheme } from '../contexts/ThemeContext';

export const ProfileScreen: React.FC = () => {
  const {theme, isDark, toggleTheme} = useTheme();

  const handleSignIn = () => {
    Alert.alert('Sign In', 'Authentication will be implemented with Clerk');
  };

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Sign out functionality will be implemented');
  };

  const menuItems = [
    {
      title: 'Favorites',
      icon: 'favorite',
      onPress: () => Alert.alert('Favorites', 'Favorites feature coming soon'),
    },
    {
      title: 'Downloaded Apps',
      icon: 'download',
      onPress: () => Alert.alert('Downloads', 'Download history coming soon'),
    },
    {
      title: 'Settings',
      icon: 'settings',
      onPress: () => Alert.alert('Settings', 'Settings panel coming soon'),
    },
    {
      title: 'About',
      icon: 'info',
      onPress: () => Alert.alert('About', 'Showcase Apps v1.0.0'),
    },
  ];

  return (
    <ScrollView
      style={[styles.container, {backgroundColor: theme.colors.background}]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={[styles.header, {backgroundColor: theme.colors.surface}]}>
        <View style={styles.avatarContainer}>
          <View style={[styles.avatar, {backgroundColor: theme.colors.primary}]}>
            <Icon name="person" size={40} color="white" />
          </View>
        </View>
        
        <Text style={[styles.title, {color: theme.colors.text}]}>
          Guest User
        </Text>
        <Text style={[styles.subtitle, {color: theme.colors.textSecondary}]}>
          Sign in to sync your data
        </Text>

        <TouchableOpacity
          style={[styles.signInButton, {backgroundColor: theme.colors.primary}]}
          onPress={handleSignIn}
        >
          <Text style={styles.signInButtonText}>Sign In</Text>
        </TouchableOpacity>
      </View>

      {/* Theme Toggle */}
      <View style={[styles.section, {backgroundColor: theme.colors.surface}]}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, {color: theme.colors.text}]}>
            Appearance
          </Text>
        </View>
        
        <TouchableOpacity
          style={styles.menuItem}
          onPress={toggleTheme}
        >
          <View style={styles.menuItemLeft}>
            <Icon
              name={isDark ? 'light-mode' : 'dark-mode'}
              size={24}
              color={theme.colors.textSecondary}
            />
            <Text style={[styles.menuItemText, {color: theme.colors.text}]}>
              {isDark ? 'Light Mode' : 'Dark Mode'}
            </Text>
          </View>
          <Icon name="chevron-right" size={24} color={theme.colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Menu Items */}
      <View style={[styles.section, {backgroundColor: theme.colors.surface}]}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, {color: theme.colors.text}]}>
            Account
          </Text>
        </View>
        
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={item.title}
            style={[
              styles.menuItem,
              index < menuItems.length - 1 && {borderBottomColor: theme.colors.border},
            ]}
            onPress={item.onPress}
          >
            <View style={styles.menuItemLeft}>
              <Icon name={item.icon} size={24} color={theme.colors.textSecondary} />
              <Text style={[styles.menuItemText, {color: theme.colors.text}]}>
                {item.title}
              </Text>
            </View>
            <Icon name="chevron-right" size={24} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        ))}
      </View>

      {/* App Info */}
      <View style={[styles.footer, {backgroundColor: theme.colors.surface}]}>
        <Text style={[styles.footerText, {color: theme.colors.textSecondary}]}>
          Showcase Apps v1.0.0
        </Text>
        <Text style={[styles.footerText, {color: theme.colors.textSecondary}]}>
          Discover amazing applications
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
  },
  signInButton: {
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  signInButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    marginBottom: 16,
  },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 16,
    marginLeft: 16,
  },
  footer: {
    padding: 24,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    marginBottom: 4,
  },
});
