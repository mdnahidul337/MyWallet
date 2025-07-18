import { useLocalSearchParams, useRouter } from 'expo-router';
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

export default function EditBudgetScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors } = useTheme();
  const { budgets, categories, updateBudget, settings } = useWallet();
  
  const budget = budgets.find(b => b.id === id);
  
  const [title, setTitle] = useState(budget?.title || '');
  const [amount, setAmount] = useState(budget?.amount.toString() || '');
  const [selectedCategoryId, setSelectedCategoryId] = useState(budget?.categoryId || '');
  const [period, setPeriod] = useState<'weekly' | 'monthly' | 'yearly'>(budget?.period || 'monthly');
  
  const expenseCategories = categories.filter((c: Category) => c.type === 'expense');
  
  if (!budget) {
    return (
      <View style={createStyles(colors).container}>
        <Text>Budget not found</Text>
      </View>
    );
  }
  
  const handleSave = () => {
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
    
    const updatedBudget = {
      ...budget,
      title: title.trim(),
      categoryId: selectedCategoryId,
      amount: parseFloat(amount),
      period,
    };
    
    updateBudget(updatedBudget);
    router.back();
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
        </View>
      </ScrollView>
      
      <View style={styles.footer}>
        <Pressable style={styles.cancelButton} onPress={() => router.back()}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </Pressable>
        <Pressable style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
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
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginHorizontal: 4,
    marginBottom: 8,
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
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.border,
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
    marginLeft: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.white,
  },
});