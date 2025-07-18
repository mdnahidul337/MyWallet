import { useRouter } from 'expo-router';
import { ArrowDownRight, ArrowUpRight, Edit2, Plus, Trash2 } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, shadows } from '@/constants/colors';
import { useWallet } from '@/hooks/useWalletStore';
import { Category } from '@/types/wallet';

export default function ManageCategoriesScreen() {
  const router = useRouter();
  const { categories, deleteCategory } = useWallet();
  const [selectedType, setSelectedType] = useState<'income' | 'expense'>('expense');

  const filteredCategories = categories.filter(category => category.type === selectedType);

  const handleAddCategory = () => {
    router.push({
      pathname: '/categories/add',
      params: { type: selectedType }
    });
  };

  const handleEditCategory = (category: Category) => {
    router.push({
      pathname: '/categories/edit',
      params: { id: category.id }
    });
  };

  const handleDeleteCategory = (category: Category) => {
    if (category.isDefault) {
      Alert.alert(
        'Cannot Delete',
        'Default categories cannot be deleted. You can only delete custom categories.',
        [{ text: 'OK' }]
      );
      return;
    }

    Alert.alert(
      'Delete Category',
      `Are you sure you want to delete "${category.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const success = deleteCategory(category.id);
            if (!success) {
              Alert.alert(
                'Cannot Delete',
                'This category cannot be deleted.',
                [{ text: 'OK' }]
              );
            }
          }
        }
      ]
    );
  };

  const renderCategoryItem = ({ item }: { item: Category }) => (
    <View style={[styles.categoryItem, shadows.small]}>
      <View style={styles.categoryInfo}>
        <View style={[styles.categoryIcon, { backgroundColor: item.color }]}>
          {item.type === 'income' ? (
            <ArrowUpRight size={16} color={colors.text.white} />
          ) : (
            <ArrowDownRight size={16} color={colors.text.white} />
          )}
        </View>
        <View style={styles.categoryDetails}>
          <Text style={styles.categoryName}>{item.name}</Text>
          <Text style={styles.categoryType}>
            {item.isDefault ? 'Default Category' : 'Custom Category'}
          </Text>
        </View>
      </View>
      
      <View style={styles.categoryActions}>
        <Pressable
          style={styles.actionButton}
          onPress={() => handleEditCategory(item)}
        >
          <Edit2 size={16} color={colors.primary} />
        </Pressable>
        
        {!item.isDefault && (
          <Pressable
            style={[styles.actionButton, { marginLeft: 8 }]}
            onPress={() => handleDeleteCategory(item)}
          >
            <Trash2 size={16} color={colors.danger} />
          </Pressable>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.typeSelector}>
          <Pressable
            style={[
              styles.typeButton,
              selectedType === 'income' && styles.selectedTypeButton
            ]}
            onPress={() => setSelectedType('income')}
          >
            <ArrowUpRight 
              size={16} 
              color={selectedType === 'income' ? colors.text.white : colors.success} 
            />
            <Text
              style={[
                styles.typeButtonText,
                selectedType === 'income' && styles.selectedTypeButtonText
              ]}
            >
              Income
            </Text>
          </Pressable>
          
          <Pressable
            style={[
              styles.typeButton,
              selectedType === 'expense' && styles.selectedTypeButton
            ]}
            onPress={() => setSelectedType('expense')}
          >
            <ArrowDownRight 
              size={16} 
              color={selectedType === 'expense' ? colors.text.white : colors.danger} 
            />
            <Text
              style={[
                styles.typeButtonText,
                selectedType === 'expense' && styles.selectedTypeButtonText
              ]}
            >
              Expense
            </Text>
          </Pressable>
        </View>
      </View>

      <FlatList
        data={filteredCategories}
        keyExtractor={(item) => item.id}
        renderItem={renderCategoryItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      <Pressable style={styles.addButton} onPress={handleAddCategory}>
        <Plus size={24} color={colors.text.white} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.card,
  },
  typeSelector: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 4,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  selectedTypeButton: {
    backgroundColor: colors.primary,
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text.primary,
    marginLeft: 6,
  },
  selectedTypeButtonText: {
    color: colors.text.white,
  },
  listContent: {
    padding: 16,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  categoryDetails: {
    flex: 1,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text.primary,
    marginBottom: 4,
  },
  categoryType: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  categoryActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.medium,
  },
});