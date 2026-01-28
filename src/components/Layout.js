import { View, StyleSheet, SafeAreaView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import Navbar from './Navbar';
import Menubar from './Menubar';

export default function Layout({ children, navigation }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const insets = useSafeAreaInsets();

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <SafeAreaView style={[styles.container, { paddingVertical: insets.top }]}>
      <Navbar toggleSidebar={toggleSidebar} />
      <Menubar 
        isOpen={sidebarOpen} 
        closeSidebar={closeSidebar} 
        navigation={navigation}
      />
      <View style={styles.content}>
        {children}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  content: {
    flex: 1,
  },
});
