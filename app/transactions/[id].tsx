import { useLocalSearchParams, useRouter } from 'expo-router';
import { Calendar, Edit2, MapPin, Trash2 } from 'lucide-react-native';
import React from 'react';
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import EmptyState from '@/components/EmptyState';
import { colors, shadows } from '@/constants/colors';
import { formatCurrency } from '@/constants/currencies';
import { useWallet } from '@/hooks/useWalletStore';
import { Account, Category } from '@/types/wallet';

export default function TransactionDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { transactions, accounts, categories, deleteTransaction } = useWallet();
  
  const transaction = transactions.find(t => t.id === id);
  
  if (!transaction) {
    return (
      <View style={styles.container}>
        <EmptyState
          title="Transaction Not Found"
          message="The transaction you're looking for doesn't exist"
          actionLabel="Go Back"
          onAction={() => router.back()}
        />
      </View>
    );
  }
  
  const account = accounts.find((a: Account) => a.id === transaction.accountId);
  const category = categories.find((c: Category) => c.id === transaction.categoryId);
  
  const handleEditTransaction = () => {
    router.push({
      pathname: '/transactions/edit',
      params: { id }
    });
  };
  
  const handleDeleteTransaction = () => {
    Alert.alert(
      'Delete Transaction',
      'Are you sure you want to delete this transaction?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            deleteTransaction(id);
            router.back();
          }
        }
      ]
    );
  };
  
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[styles.transactionCard, shadows.medium]}>
          <View style={styles.header}>
            <View style={styles.typeContainer}>
              <View 
                style={[
                  styles.typeIndicator, 
                  transaction.type === 'income' ? styles.incomeIndicator : styles.expenseIndicator
                ]} 
              />
              <Text style={styles.typeText}>
                {transaction.type === 'income' ? 'Income' : 'Expense'}
              </Text>
            </View>
            
            <Text style={styles.amount}>
              {transaction.type === 'income' ? '+' : '-'} 
              {account ? formatCurrency(transaction.amount, account.currency) : `$${transaction.amount.toFixed(2)}`}
            </Text>
          </View>
          
          <View style={styles.detailsContainer}>
            <Text style={styles.descriptionLabel}>Description</Text>
            <Text style={styles.description}>{transaction.description}</Text>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Category</Text>
              <Text style={styles.detailValue}>{category?.name || 'Unknown'}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Account</Text>
              <Text style={styles.detailValue}>{account?.name || 'Unknown'}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Date</Text>
              <View style={styles.dateContainer}>
                <Calendar size={16} color={colors.text.secondary} />
                <Text style={styles.dateText}>{formatDate(transaction.date)}</Text>
              </View>
            </View>
            
            {transaction.location && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Location</Text>
                <View style={styles.locationContainer}>
                  <MapPin size={16} color={colors.text.secondary} />
                  <Text style={styles.locationText}>{transaction.location}</Text>
                </View>
              </View>
            )}
            
            {transaction.isRecurring && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Recurring</Text>
                <Text style={styles.detailValue}>
                  {transaction.recurringFrequency?.charAt(0).toUpperCase() + 
                   (transaction.recurringFrequency?.slice(1) || '')}
                </Text>
              </View>
            )}
          </View>
          
          {transaction.receiptImage && (
            <View style={styles.receiptContainer}>
              <Text style={styles.receiptLabel}>Receipt</Text>
              <Image 
                source={{ uri: transaction.receiptImage }} 
                style={styles.receiptImage}
                resizeMode="contain"
              />
            </View>
          )}
          
          <View style={styles.actionsContainer}>
            <Pressable 
              style={[styles.actionButton, styles.editButton]} 
              onPress={handleEditTransaction}
            >
              <Edit2 size={20} color={colors.primary} />
              <Text style={styles.editButtonText}>Edit</Text>
            </Pressable>
            
            <Pressable 
              style={[styles.actionButton, styles.deleteButton]} 
              onPress={handleDeleteTransaction}
            >
              <Trash2 size={20} color={colors.danger} />
              <Text style={styles.deleteButtonText}>Delete</Text>
            </Pressable>
          </View>
        </View>
        
        <View style={styles.createdContainer}>
          <Text style={styles.createdText}>
            Created: {formatDate(transaction.createdAt)}
          </Text>
          {transaction.updatedAt !== transaction.createdAt && (
            <Text style={styles.createdText}>
              Updated: {formatDate(transaction.updatedAt)}
            </Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  transactionCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    margin: 16,
    overflow: 'hidden',
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  typeIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  incomeIndicator: {
    backgroundColor: colors.success,
  },
  expenseIndicator: {
    backgroundColor: colors.danger,
  },
  typeText: {
    fontSize: 16,
    color: colors.text.secondary,
  },
  amount: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text.primary,
  },
  detailsContainer: {
    padding: 20,
  },
  descriptionLabel: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 4,
  },
  description: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 16,
    color: colors.text.secondary,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text.primary,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text.primary,
    marginLeft: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text.primary,
    marginLeft: 8,
  },
  receiptContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  receiptLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 12,
  },
  receiptImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  actionsContainer: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
  },
  editButton: {
    backgroundColor: colors.background,
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  deleteButton: {
    backgroundColor: colors.background,
    marginLeft: 8,
    borderWidth: 1,
    borderColor: colors.danger,
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    marginLeft: 8,
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.danger,
    marginLeft: 8,
  },
  createdContainer: {
    padding: 16,
    alignItems: 'center',
  },
  createdText: {
    fontSize: 14,
    color: colors.text.light,
  },
});