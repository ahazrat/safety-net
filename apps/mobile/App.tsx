import 'react-native-gesture-handler';
import React from 'react';

import useCachedResources from './hooks/useCachedResources';
import AppComponent from './components/App';

export default function App() {
  const isLoadingComplete = useCachedResources();

  if (!isLoadingComplete) {
    return null;
  }
  return <AppComponent />;
}
