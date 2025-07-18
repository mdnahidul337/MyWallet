import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowDownRight, ArrowUpRight, Calendar, Camera } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    Image,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View
} from 'react-native';

import { colors, shadows } from '@/constants/colors';
import { useWallet } from '@/hooks/useWalletStore';
import { Account, Category, TransactionType } from '@/types/wallet';

export default function EditTransactionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { transactions, accounts, categories, updateTransaction } = useWallet();
  
  const transaction = transactions.find(t => t.id === id);
  
  const [type, setType] = useState<TransactionType>(transaction?.type || 'expense');
  const [amount, setAmount] = useState(transaction?.amount.toString() || '');
  const [description, setDescription] = useState(transaction?.description || '');
  const [selectedAccountId, setSelectedAccountId] = useState(transaction?.accountId || '');
  const [selectedCategoryId, setSelectedCategoryId] = useState(transaction?.categoryId || '');
  const [date, setDate] = useState(new Date(transaction?.date || Date.now()));
  const [receiptImage, setReceiptImage] = useState<string | undefined>(transaction?.receiptImage);
  
  if (!transaction) {
    return (
      <View style={styles.container}>
        <Text>Transaction not found</Text>
      </View>
    );
  }
  
  const handleSave = () => {
    if (!amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    
    if (!description.trim()) {
      alert('Please enter a description');
      return;
    }
    
    if (!selectedAccountId) {
      alert('Please select an account');
      return;
    }
    
    if (!selectedCategoryId) {
      alert('Please select a category');
      return;
    }
    
    const updatedTransaction = {
      ...transaction,
      accountId: selectedAccountId,
      amount: parseFloat(amount),
      type,
      categoryId: selectedCategoryId,
      description: description.trim(),
      date: date.getTime(),
      receiptImage,
    };
    
    updateTransaction(updatedTransaction);
    router.back();
  };
  
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });
    
    if (!result.canceled) {
      setReceiptImage(result.assets[0].uri);
    }
  };
  
  const filteredCategories = categories.filter((c: Category) => c.type === type);
  
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={100}
    >
      <ScrollView style={styles.scrollView}>
        <View style={styles.formContainer}>
          <View style={styles.typeSelector}>
            <Pressable
              style={[
                styles.typeButton,
                type === 'income' && styles.incomeTypeSelected,
              ]}
              onPress={() => setType('income')}
            >
              <ArrowUpRight 
                size={20} 
                color={type === 'income' ? colors.text.white : colors.success} 
              />
              <Text
                style={[
                  styles.typeButtonText,
                  type === 'income' && styles.typeButtonTextSelected,
                ]}
              >
                Income
              </Text>
            </Pressable>
            
            <Pressable
              style={[
                styles.typeButton,
                type === 'expense' && styles.expenseTypeSelected,
              ]}
              onPress={() => setType('expense')}
            >
              <ArrowDownRight 
                size={20} 
                color={type === 'expense' ? colors.text.white : colors.danger} 
              />
              <Text
                style={[
                  styles.typeButtonText,
                  type === 'expense' && styles.typeButtonTextSelected,
                ]}
              >
                Expense
              </Text>
            </Pressable>
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Amount</Text>
            <TextInput
              style={styles.amountInput}
              value={amount}
              onChangeText={setAmount}
              placeholder="0.00"
              placeholderTextColor={colors.text.light}
              keyboardType="numeric"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={styles.input}
              value={description}
              onChangeText={setDescription}
              placeholder="What was this for?"
              placeholderTextColor={colors.text.light}
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Account</Text>
            <View style={styles.optionsContainer}>
              {accounts.map((account: Account) => (
                <Pressable
                  key={account.id}
                  style={[
                    styles.optionButton,
                    selectedAccountId === account.id && styles.optionButtonSelected,
                    { borderColor: account.color },
                    selectedAccountId === account.id && { backgroundColor: account.color },
                  ]}
                  onPress={() => setSelectedAccountId(account.id)}
                >
                  <Text
                    style={[
                      styles.optionButtonText,
                      selectedAccountId === account.id && styles.optionButtonTextSelected,
                    ]}
                  >
                    {account.name}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Category</Text>
            <View style={styles.optionsContainer}>
              {filteredCategories.map((category: Category) => (
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
            <Text style={styles.label}>Date</Text>
            <Pressable style={styles.dateSelector}>
              <Calendar size={20} color={colors.text.secondary} />
              <Text style={styles.dateSelectorText}>
                {date.toLocaleDateString('en-US', { 
                  weekday: 'short', 
                  month: 'short', 
                  day: 'numeric',
                  year: 'numeric'
                })}
              </Text>
            </Pressable>
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Receipt Photo</Text>
            {receiptImage ? (
              <View style={styles.receiptContainer}>
                <Image source={{ uri: receiptImage }} style={styles.receiptImage} />
                <Pressable style={styles.changeReceiptButton} onPress={pickImage}>
                  <Text style={styles.changeReceiptText}>Change Photo</Text>
                </Pressable>
              </View>
            ) : (
              <Pressable style={styles.addReceiptButton} onPress={pickImage}>
                <Camera size={24} color={colors.primary} />
                <Text style={styles.addReceiptText}>Add Receipt Photo</Text>
              </Pressable>
            )}
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

const styles = StyleSheet.create({
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
  typeSelector: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 12,
    marginHorizontal: 4,
  },
  incomeTypeSelected: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  expenseTypeSelected: {
    backgroundColor: colors.danger,
    borderColor: colors.danger,
  },
  typeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginLeft: 8,
  },
  typeButtonTextSelected: {
    color: colors.text.white,
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
  addReceiptButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
    padding: 16,
  },
  addReceiptText: {
    fontSize: 16,
    color: colors.primary,
    marginLeft: 8,
  },
  receiptContainer: {
    alignItems: 'center',
  },
  receiptImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 8,
  },
  changeReceiptButton: {
    backgroundColor: colors.background,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  changeReceiptText: {
    fontSize: 14,
    color: colors.text.primary,
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