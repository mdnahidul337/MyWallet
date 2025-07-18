import { useRouter } from 'expo-router';
import {
  ChevronRight,
  Eye,
  Globe,
  HelpCircle,
  LogOut,
  Moon,
  Shield,
  Sun,
  Tags,
  Trash2
} from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';

import PinPad from '@/components/PinPad';
import { shadows } from '@/constants/colors';
import { currencyNames } from '@/constants/currencies';
import { useTheme } from '@/hooks/useTheme';
import { useWallet } from '@/hooks/useWalletStore';

export default function SettingsScreen() {
  const router = useRouter();
  const { settings, updateSettings, logout } = useWallet();
  const { theme, colors, updateTheme } = useTheme();
  const [showPinSetup, setShowPinSetup] = useState(false);
  
  const handleToggleHideBalances = () => {
    updateSettings({ hideBalances: !settings.hideBalances });
  };
  
  const handleTogglePinEnabled = () => {
    if (settings.pinEnabled) {
      // Disable PIN
      updateSettings({ pinEnabled: false, pinCode: undefined });
    } else {
      // Show PIN setup
      setShowPinSetup(true);
    }
  };
  
  const handleSetPin = (pin: string) => {
    updateSettings({ pinEnabled: true, pinCode: pin });
    setShowPinSetup(false);
    
    Alert.alert(
      'PIN Set Successfully',
      'Your wallet is now protected with a PIN',
      [{ text: 'OK' }]
    );
  };
  
  const handleChangeCurrency = () => {
    router.push('/settings/currency');
  };

  const handleManageCategories = () => {
    router.push('/categories/manage');
  };

  const handleToggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    updateTheme(newTheme);
  };
  
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: () => {
            logout();
          }
        }
      ]
    );
  };
  
  const handleClearData = () => {
    Alert.alert(
      'Clear All Data',
      'This will permanently delete all your accounts, transactions, and budgets. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete Everything', 
          style: 'destructive',
          onPress: () => {
            // In a real app, this would clear all data
            Alert.alert(
              'Data Cleared',
              'All your data has been deleted',
              [{ text: 'OK' }]
            );
          }
        }
      ]
    );
  };
  
  if (showPinSetup) {
    return (
      <PinPad 
        onComplete={handleSetPin}
        title="Set PIN"
        subtitle="Create a 4-digit PIN to secure your wallet"
      />
    );
  }
  
  const styles = createStyles(colors);
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Security</Text>
        
        <View style={[styles.card, shadows.small]}>
          <View style={styles.settingItem}>
            <View style={styles.settingIconContainer}>
              <Shield size={20} color={colors.primary} />
            </View>
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingTitle}>PIN Protection</Text>
              <Text style={styles.settingDescription}>
                Secure your wallet with a PIN code
              </Text>
            </View>
            <Switch
              value={settings.pinEnabled}
              onValueChange={handleTogglePinEnabled}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.card}
            />
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.settingItem}>
            <View style={styles.settingIconContainer}>
              <Eye size={20} color={colors.primary} />
            </View>
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingTitle}>Hide Balances</Text>
              <Text style={styles.settingDescription}>
                Hide your account balances for privacy
              </Text>
            </View>
            <Switch
              value={settings.hideBalances}
              onValueChange={handleToggleHideBalances}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.card}
            />
          </View>
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Appearance</Text>
        
        <View style={[styles.card, shadows.small]}>
          <View style={styles.settingItem}>
            <View style={styles.settingIconContainer}>
              {theme === 'light' ? (
                <Sun size={20} color={colors.primary} />
              ) : (
                <Moon size={20} color={colors.primary} />
              )}
            </View>
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingTitle}>Dark Mode</Text>
              <Text style={styles.settingDescription}>
                Switch between light and dark themes
              </Text>
            </View>
            <Switch
              value={theme === 'dark'}
              onValueChange={handleToggleTheme}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.card}
            />
          </View>
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        
        <View style={[styles.card, shadows.small]}>
          <Pressable style={styles.settingItem} onPress={handleChangeCurrency}>
            <View style={styles.settingIconContainer}>
              <Globe size={20} color={colors.primary} />
            </View>
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingTitle}>Default Currency</Text>
              <Text style={styles.settingDescription}>
                {currencyNames[settings.defaultCurrency]}
              </Text>
            </View>
            <ChevronRight size={20} color={colors.text.secondary} />
          </Pressable>

          <View style={styles.divider} />

          <Pressable style={styles.settingItem} onPress={handleManageCategories}>
            <View style={styles.settingIconContainer}>
              <Tags size={20} color={colors.primary} />
            </View>
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingTitle}>Manage Categories</Text>
              <Text style={styles.settingDescription}>
                Add, edit, or remove transaction categories
              </Text>
            </View>
            <ChevronRight size={20} color={colors.text.secondary} />
          </Pressable>
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        
        <View style={[styles.card, shadows.small]}>
          <Pressable style={styles.settingItem}>
            <View style={styles.settingIconContainer}>
              <HelpCircle size={20} color={colors.primary} />
            </View>
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingTitle}>Help & Support</Text>
              <Text style={styles.settingDescription}>
                Get help with using the app
              </Text>
            </View>
            <ChevronRight size={20} color={colors.text.secondary} />
          </Pressable>
          
          <View style={styles.divider} />
          
          <View style={styles.settingItem}>
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingTitle}>App Version</Text>
              <Text style={styles.settingDescription}>
                1.0.0
              </Text>
            </View>
          </View>
        </View>
      </View>
      
      <View style={styles.section}>
        <Pressable 
          style={[styles.dangerButton, shadows.small]} 
          onPress={handleLogout}
        >
          <LogOut size={20} color={colors.danger} />
          <Text style={styles.dangerButtonText}>Logout</Text>
        </Pressable>
        
        <Pressable 
          style={[styles.dangerButton, shadows.small, { marginTop: 16 }]} 
          onPress={handleClearData}
        >
          <Trash2 size={20} color={colors.danger} />
          <Text style={styles.dangerButtonText}>Clear All Data</Text>
        </Pressable>
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Personal Wallet System © 2025
        </Text>
      </View>
    </ScrollView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 16,
    paddingTop: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text.primary,
  },
  section: {
    padding: 16,
    paddingTop: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.secondary,
    marginBottom: 12,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text.primary,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: 16,
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.danger,
  },
  dangerButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.danger,
    marginLeft: 8,
  },
  footer: {
    padding: 24,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: colors.text.light,
  },
});