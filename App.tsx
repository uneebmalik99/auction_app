/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {
  Alert,
  LogBox,
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
} from 'react-native';
import { Provider } from 'react-redux';
import { RootNavigator } from './src/routes';
import { store } from './src/redux/store';
import Toast from 'react-native-toast-message';
import { I18nProvider } from './src/i18n';
// import { GoogleSignin } from '@react-native-google-signin/google-signin';

LogBox.ignoreAllLogs();

// Configure (call this once on app start)
// GoogleSignin.configure({
//   webClientId: 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com', // Required for ID token / server auth
//   // iosClientId: 'YOUR_IOS_CLIENT_ID.apps.googleusercontent.com', // Optional for iOS-only
//   // offlineAccess: true, // If you need refresh tokens
//   // scopes: ['profile', 'email'], // Default scopes
// });

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  // useNotifications({
  //   onTokenReceived: token => {
  //     console.log('FCM Token:', token);
  //     // Send token to your backend
  //   },
  //   onNotificationOpened: data => {
  //     console.log('Notification opened with data:', data);
  //     Alert.alert('Notification Tapped', JSON.stringify(data ?? {}));
  //     // Navigate based on data, e.g., navigation.navigate('SomeScreen')
  //   },
  //   // onForegroundMessage: (message) => { /* custom logic */ }
  // });

  return (
    <Provider store={store}>
      <I18nProvider>
        <View style={styles.container}>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        {/* Remove NewAppScreen once you're done with the starter template */}
        {/* <NewAppScreen templateFileName="App.tsx" /> */}
        <RootNavigator />
        <Toast />
        </View>
      </I18nProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
