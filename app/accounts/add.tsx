import { useRouter } from 'expo-router';
import { Check } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View
} from 'react-native';

import { shadows } from '@/constants/colors';
import { currencyNames } from '@/constants/currencies';
import { useTheme } from '@/hooks/useTheme';
import { useWallet } from '@/hooks/useWalletStore';
import { AccountType, Currency } from '@/types/wallet';

const accountTypes: { value: AccountType; label: string }[] = [
  { value: 'cash', label: 'Cash' },
  { value: 'credit', label: 'Credit Card' },
  { value: 'bank', label: 'Bank Account' },
  { value: 'digital', label: 'Digital Wallet' },
];

const accountColors = [
  '#1E3A8A', // Deep blue
  '#0D9488', // Teal
  '#F59E0B', // Gold
  '#10B981', // Green
  '#3B82F6', // Blue
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#EF4444', // Red
];

export default function AddAccountScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { addAccount, settings } = useWallet();
  
  const [name, setName] = useState('');
  const [balance, setBalance] = useState('0');
  const [type, setType] = useState<AccountType>('bank');
  const [currency, setCurrency] = useState<Currency>(settings.defaultCurrency);
  const [color, setColor] = useState(accountColors[0]);
  
  const handleSave = async () => {
    try {
      if (!name.trim()) {
        alert('Please enter an account name');
        return;
      }
      
      const newAccount = {
        name: name.trim(),
        balance: parseFloat(balance) || 0,
        type,
        currency,
        color,
      };
      
      await addAccount(newAccount);
      router.back();
    } catch (error) {
      console.error('Error saving account:', error);
      alert('Failed to save account. Please try again.');
    }
  };
  
  const styles = createStyles(colors);
  
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={100}
    >
      <ScrollView style={styles.scrollView}>
        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Account Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Enter account name"
              placeholderTextColor={colors.text.light}
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Initial Balance</Text>
            <TextInput
              style={styles.input}
              value={balance}
              onChangeText={setBalance}
              placeholder="0.00"
              placeholderTextColor={colors.text.light}
              keyboardType="numeric"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Account Type</Text>
            <View style={styles.optionsContainer}>
              {accountTypes.map((item) => (
                <Pressable
                  key={item.value}
                  style={[
                    styles.optionButton,
                    type === item.value && styles.optionButtonSelected,
                  ]}
                  onPress={() => setType(item.value)}
                  android_ripple={{ color: colors.text.light }}
                >
                  <Text
                    style={[
                      styles.optionButtonText,
                      type === item.value && styles.optionButtonTextSelected,
                    ]}
                  >
                    {item.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Currency</Text>
            <Pressable style={styles.currencySelector}>
              <Text style={styles.currencySelectorText}>
                {currencyNames[currency]}
              </Text>
            </Pressable>
            <Text style={styles.helperText}>
              Using default currency from settings
            </Text>
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Account Color</Text>
            <View style={styles.colorContainer}>
              {accountColors.map((colorOption) => (
                <Pressable
                  key={colorOption}
                  style={[
                    styles.colorOption,
                    { backgroundColor: colorOption },
                    color === colorOption && styles.colorOptionSelected,
                  ]}
                  onPress={() => setColor(colorOption)}
                  android_ripple={{ color: colors.text.white }}
                >
                  {color === colorOption && (
                    <Check size={16} color={colors.text.white} />
                  )}
                </Pressable>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
      
      <View style={styles.footer}>
        <Pressable 
          style={styles.cancelButton} 
          onPress={() => router.back()}
          android_ripple={{ color: colors.text.light }}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </Pressable>
        <Pressable 
          style={styles.saveButton} 
          onPress={handleSave}
          android_ripple={{ color: colors.text.white }}
        >
          <Text style={styles.saveButtonText}>Save Account</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  formContainer: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.card,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
    fontSize: 16,
    color: colors.text.primary,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  optionButton: {
    backgroundColor: colors.card,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 4,
    marginBottom: 8,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionButtonSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  optionButtonText: {
    fontSize: 14,
    color: colors.text.primary,
  },
  optionButtonTextSelected: {
    color: colors.text.white,
  },
  currencySelector: {
    backgroundColor: colors.card,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
  },
  currencySelectorText: {
    fontSize: 16,
    color: colors.text.primary,
  },
  helperText: {
    fontSize: 14,
    color: colors.text.secondary,
    marginTop: 8,
  },
  colorContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginHorizontal: 8,
    marginBottom: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorOptionSelected: {
    borderWidth: 2,
    borderColor: colors.text.white,
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.card,
    ...shadows.medium,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 48,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  saveButton: {
    flex: 2,
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
    minHeight: 48,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.white,
  },
});