import { NavigationContainer } from '@react-navigation/native';

import { Button, StyleSheet, Text, View } from 'react-native';
import { AuthProvider } from './hooks/useAuth';
import StackNavigator from './StackNavigator';

export default function App() {
  return (
    <NavigationContainer>
      {/* Higher order componen AppProvider */}
      <AuthProvider> 
        <StackNavigator/>
      </AuthProvider>
    </NavigationContainer>
  );
}
