import { useRouter } from 'expo-router';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react-native';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/constants/colors';
import { formatCurrency } from '@/constants/currencies';
import { useWallet } from '@/hooks/useWalletStore';
import { Account, Category, Transaction } from '@/types/wallet';

interface TransactionItemProps {
  transaction: Transaction;
}

export default function TransactionItem({ transaction }: TransactionItemProps) {
  const router = useRouter();
  const { accounts, categories } = useWallet();
  
  const account = accounts.find((a: Account) => a.id === transaction.accountId);
  const category = categories.find((c: Category) => c.id === transaction.categoryId);
  
  const handlePress = () => {
    router.push(`/transactions/${transaction.id}`);
  };
  
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  return (
    <Pressable onPress={handlePress} style={styles.container}>
      <View style={styles.iconContainer}>
        {transaction.type === 'income' ? (
          <ArrowUpRight size={20} color={colors.success} />
        ) : (
          <ArrowDownRight size={20} color={colors.danger} />
        )}
      </View>
      
      <View style={styles.detailsContainer}>
        <Text style={styles.description} numberOfLines={1}>
          {transaction.description}
        </Text>
        <Text style={styles.metadata}>
          {category?.name} • {account?.name} • {formatDate(transaction.date)}
        </Text>
      </View>
      
      <View style={styles.amountContainer}>
        <Text style={[
          styles.amount, 
          transaction.type === 'income' ? styles.incomeAmount : styles.expenseAmount
        ]}>
          {transaction.type === 'income' ? '+' : '-'} 
          {account && formatCurrency(transaction.amount, account.currency)}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  detailsContainer: {
    flex: 1,
  },
  description: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text.primary,
    marginBottom: 4,
  },
  metadata: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  amountContainer: {
    marginLeft: 12,
  },
  amount: {
    fontSize: 16,
    fontWeight: '600',
  },
  incomeAmount: {
    color: colors.success,
  },
  expenseAmount: {
    color: colors.danger,
  },
});