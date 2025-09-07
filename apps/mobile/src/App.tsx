import { ApolloProvider } from '@apollo/client';
import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ThemeProvider } from './contexts/ThemeContext';
import { AppNavigator } from './navigation/AppNavigator';
import { apolloClient } from './services/apollo';

const App: React.FC = () => {
  return (
    <SafeAreaProvider>
      <ApolloProvider client={apolloClient}>
        <ThemeProvider>
          <NavigationContainer>
            <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
            <AppNavigator />
          </NavigationContainer>
        </ThemeProvider>
      </ApolloProvider>
    </SafeAreaProvider>
  );
};

export default App;
