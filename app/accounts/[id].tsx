import { useLocalSearchParams, useRouter } from 'expo-router';
import { Edit2, Trash2 } from 'lucide-react-native';
import React from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import EmptyState from '@/components/EmptyState';
import TransactionItem from '@/components/TransactionItem';
import { colors, shadows } from '@/constants/colors';
import { formatCurrency } from '@/constants/currencies';
import { useWallet } from '@/hooks/useWalletStore';

export default function AccountDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { accounts, transactions, deleteAccount } = useWallet();
  
  const account = accounts.find(a => a.id === id);
  
  if (!account) {
    return (
      <View style={styles.container}>
        <EmptyState
          title="Account Not Found"
          message="The account you're looking for doesn't exist"
          actionLabel="Go Back"
          onAction={() => router.back()}
        />
      </View>
    );
  }
  
  const accountTransactions = transactions
    .filter(t => t.accountId === id)
    .sort((a, b) => b.date - a.date);
  
  const handleAddTransaction = () => {
    router.push({
      pathname: '/transactions/add',
      params: { accountId: id }
    });
  };
  
  const handleEditAccount = () => {
    router.push({
      pathname: '/accounts/edit',
      params: { id }
    });
  };
  
  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      `Are you sure you want to delete "${account.name}"? This will also delete all transactions associated with this account.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            deleteAccount(id);
            router.back();
          }
        }
      ]
    );
  };
  
  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[styles.accountCard, shadows.medium]}>
          <View style={styles.accountHeader}>
            <Text style={styles.accountName}>{account.name}</Text>
            <Text style={styles.accountType}>
              {account.type.charAt(0).toUpperCase() + account.type.slice(1)}
            </Text>
          </View>
          
          <View style={styles.balanceContainer}>
            <Text style={styles.balanceLabel}>Balance</Text>
            <Text style={styles.balanceAmount}>
              {formatCurrency(account.balance, account.currency)}
            </Text>
          </View>
          
          <View style={styles.actionsContainer}>
            <Pressable style={styles.actionButton} onPress={handleAddTransaction}>
              <Text style={styles.actionButtonText}>Add Transaction</Text>
            </Pressable>
            
            <View style={styles.iconButtonsContainer}>
              <Pressable style={styles.iconButton} onPress={handleEditAccount}>
                <Edit2 size={20} color={colors.primary} />
              </Pressable>
              
              <Pressable style={styles.iconButton} onPress={handleDeleteAccount}>
                <Trash2 size={20} color={colors.danger} />
              </Pressable>
            </View>
          </View>
        </View>
        
        <View style={styles.transactionsHeader}>
          <Text style={styles.transactionsTitle}>Transactions</Text>
        </View>
        
        {accountTransactions.length > 0 ? (
          <View style={[styles.transactionsCard, shadows.small]}>
            {accountTransactions.map(transaction => (
              <TransactionItem key={transaction.id} transaction={transaction} />
            ))}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <EmptyState
              title="No Transactions"
              message="Add your first transaction to this account"
              actionLabel="Add Transaction"
              onAction={handleAddTransaction}
            />
          </View>
        )}
        
        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  accountCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    margin: 16,
  },
  accountHeader: {
    marginBottom: 16,
  },
  accountName: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 4,
  },
  accountType: {
    fontSize: 16,
    color: colors.text.secondary,
  },
  balanceContainer: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 16,
    marginBottom: 20,
  },
  balanceLabel: {
    fontSize: 16,
    color: colors.text.secondary,
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text.primary,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 12,
  },
  actionButtonText: {
    color: colors.text.white,
    fontSize: 16,
    fontWeight: '600',
  },
  iconButtonsContainer: {
    flexDirection: 'row',
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  transactionsHeader: {
    paddingHorizontal: 16,
    marginTop: 8,
    marginBottom: 12,
  },
  transactionsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
  },
  transactionsCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    margin: 16,
    marginTop: 8,
  },
  emptyContainer: {
    marginTop: 32,
  },
  bottomPadding: {
    height: 100,
  },
});