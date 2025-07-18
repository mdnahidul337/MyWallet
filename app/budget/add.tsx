import { useRouter } from 'expo-router';
import { Calendar } from 'lucide-react-native';
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
import { useTheme } from '@/hooks/useTheme';
import { useWallet } from '@/hooks/useWalletStore';
import { Category } from '@/types/wallet';

export default function AddBudgetScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { categories, addBudget, settings } = useWallet();
  
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [period, setPeriod] = useState<'weekly' | 'monthly' | 'yearly'>('monthly');
  
  const expenseCategories = categories.filter((c: Category) => c.type === 'expense');
  
  const handleSave = async () => {
    try {
      if (!title.trim()) {
        alert('Please enter a budget title');
        return;
      }
      
      if (!amount || parseFloat(amount) <= 0) {
        alert('Please enter a valid amount');
        return;
      }
      
      if (!selectedCategoryId) {
        alert('Please select a category');
        return;
      }
      
      const now = new Date();
      let startDate: Date;
      
      switch (period) {
        case 'weekly':
          const day = now.getDay();
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - day);
          break;
        case 'monthly':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        case 'yearly':
          startDate = new Date(now.getFullYear(), 0, 1);
          break;
      }
      
      const newBudget = {
        title: title.trim(),
        categoryId: selectedCategoryId,
        amount: parseFloat(amount),
        period,
        startDate: startDate.getTime(),
      };
      
      await addBudget(newBudget);
      router.back();
    } catch (error) {
      console.error('Error saving budget:', error);
      alert('Failed to save budget. Please try again.');
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
            <Text style={styles.label}>Budget Title</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="e.g., Monthly Groceries"
              placeholderTextColor={colors.text.light}
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Budget Amount</Text>
            <TextInput
              style={styles.amountInput}
              value={amount}
              onChangeText={setAmount}
              placeholder="0.00"
              placeholderTextColor={colors.text.light}
              keyboardType="numeric"
            />
            <Text style={styles.currencyLabel}>
              {settings.defaultCurrency}
            </Text>
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Category</Text>
            <View style={styles.optionsContainer}>
              {expenseCategories.map((category: Category) => (
                <Pressable
                  key={category.id}
                  style={[
                    styles.optionButton,
                    selectedCategoryId === category.id && styles.optionButtonSelected,
                    { borderColor: category.color },
                    selectedCategoryId === category.id && { backgroundColor: category.color },
                  ]}
                  onPress={() => setSelectedCategoryId(category.id)}
                  android_ripple={{ color: colors.text.light }}
                >
                  <Text
                    style={[
                      styles.optionButtonText,
                      selectedCategoryId === category.id && styles.optionButtonTextSelected,
                    ]}
                  >
                    {category.name}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Budget Period</Text>
            <View style={styles.periodContainer}>
              <Pressable
                style={[
                  styles.periodButton,
                  period === 'weekly' && styles.periodButtonSelected,
                ]}
                onPress={() => setPeriod('weekly')}
                android_ripple={{ color: colors.text.light }}
              >
                <Text
                  style={[
                    styles.periodButtonText,
                    period === 'weekly' && styles.periodButtonTextSelected,
                  ]}
                >
                  Weekly
                </Text>
              </Pressable>
              
              <Pressable
                style={[
                  styles.periodButton,
                  period === 'monthly' && styles.periodButtonSelected,
                ]}
                onPress={() => setPeriod('monthly')}
                android_ripple={{ color: colors.text.light }}
              >
                <Text
                  style={[
                    styles.periodButtonText,
                    period === 'monthly' && styles.periodButtonTextSelected,
                  ]}
                >
                  Monthly
                </Text>
              </Pressable>
              
              <Pressable
                style={[
                  styles.periodButton,
                  period === 'yearly' && styles.periodButtonSelected,
                ]}
                onPress={() => setPeriod('yearly')}
                android_ripple={{ color: colors.text.light }}
              >
                <Text
                  style={[
                    styles.periodButtonText,
                    period === 'yearly' && styles.periodButtonTextSelected,
                  ]}
                >
                  Yearly
                </Text>
              </Pressable>
            </View>
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Start Date</Text>
            <Pressable style={styles.dateSelector}>
              <Calendar size={20} color={colors.text.secondary} />
              <Text style={styles.dateSelectorText}>
                {period === 'weekly' ? 'Current Week' : 
                 period === 'monthly' ? 'Current Month' : 'Current Year'}
              </Text>
            </Pressable>
            <Text style={styles.helperText}>
              Budget will start from the beginning of the current {
                period === 'weekly' ? 'week' : 
                period === 'monthly' ? 'month' : 'year'
              }
            </Text>
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
          <Text style={styles.saveButtonText}>Create Budget</Text>
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
  amountInput: {
    backgroundColor: colors.card,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
    fontSize: 24,
    fontWeight: '700',
    color: colors.text.primary,
    textAlign: 'center',
  },
  currencyLabel: {
    position: 'absolute',
    right: 16,
    top: 50,
    fontSize: 16,
    color: colors.text.secondary,
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
  periodContainer: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  periodButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  periodButtonSelected: {
    backgroundColor: colors.primary,
  },
  periodButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text.primary,
  },
  periodButtonTextSelected: {
    color: colors.text.white,
  },
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
  },
  dateSelectorText: {
    fontSize: 16,
    color: colors.text.primary,
    marginLeft: 8,
  },
  helperText: {
    fontSize: 14,
    color: colors.text.secondary,
    marginTop: 8,
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