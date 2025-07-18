import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowDownRight, ArrowUpRight, Check } from 'lucide-react-native';
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

import { colors, shadows } from '@/constants/colors';
import { useWallet } from '@/hooks/useWalletStore';
import { CategoryType } from '@/types/wallet';

const categoryColors = [
  '#1E3A8A', // Deep blue
  '#0D9488', // Teal
  '#F59E0B', // Gold
  '#10B981', // Green
  '#3B82F6', // Blue
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#EF4444', // Red
  '#F97316', // Orange
  '#84CC16', // Lime
  '#06B6D4', // Cyan
  '#6366F1', // Indigo
];

export default function EditCategoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { categories, updateCategory } = useWallet();
  
  const category = categories.find(c => c.id === id);
  
  const [name, setName] = useState(category?.name || '');
  const [selectedType, setSelectedType] = useState<CategoryType>(category?.type || 'expense');
  const [color, setColor] = useState(category?.color || categoryColors[0]);
  const [icon] = useState(category?.icon || 'circle');
  
  if (!category) {
    return (
      <View style={styles.container}>
        <Text>Category not found</Text>
      </View>
    );
  }
  
  const handleSave = () => {
    if (!name.trim()) {
      alert('Please enter a category name');
      return;
    }
    
    const updatedCategory = {
      ...category,
      name: name.trim(),
      type: selectedType,
      icon,
      color,
    };
    
    updateCategory(updatedCategory);
    router.back();
  };
  
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={100}
    >
      <ScrollView style={styles.scrollView}>
        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Category Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Enter category name"
              placeholderTextColor={colors.text.light}
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Category Type</Text>
            <View style={styles.typeSelector}>
              <Pressable
                style={[
                  styles.typeButton,
                  selectedType === 'income' && styles.incomeTypeSelected,
                ]}
                onPress={() => setSelectedType('income')}
              >
                <ArrowUpRight 
                  size={20} 
                  color={selectedType === 'income' ? colors.text.white : colors.success} 
                />
                <Text
                  style={[
                    styles.typeButtonText,
                    selectedType === 'income' && styles.typeButtonTextSelected,
                  ]}
                >
                  Income
                </Text>
              </Pressable>
              
              <Pressable
                style={[
                  styles.typeButton,
                  selectedType === 'expense' && styles.expenseTypeSelected,
                ]}
                onPress={() => setSelectedType('expense')}
              >
                <ArrowDownRight 
                  size={20} 
                  color={selectedType === 'expense' ? colors.text.white : colors.danger} 
                />
                <Text
                  style={[
                    styles.typeButtonText,
                    selectedType === 'expense' && styles.typeButtonTextSelected,
                  ]}
                >
                  Expense
                </Text>
              </Pressable>
            </View>
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Category Color</Text>
            <View style={styles.colorContainer}>
              {categoryColors.map((colorOption) => (
                <Pressable
                  key={colorOption}
                  style={[
                    styles.colorOption,
                    { backgroundColor: colorOption },
                    color === colorOption && styles.colorOptionSelected,
                  ]}
                  onPress={() => setColor(colorOption)}
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
  typeSelector: {
    flexDirection: 'row',
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