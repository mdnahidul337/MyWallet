import { useRouter } from 'expo-router';
import { ArrowDownRight, ArrowUpRight, Plus } from 'lucide-react-native';
import React, { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import EmptyState from '@/components/EmptyState';
import TransactionItem from '@/components/TransactionItem';
import { colors, shadows } from '@/constants/colors';
import { useWallet } from '@/hooks/useWalletStore';

export default function TransactionsScreen() {
  const router = useRouter();
  const { transactions } = useWallet();
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');
  
  const filteredTransactions = transactions
    .filter(transaction => {
      if (filter === 'all') return true;
      return transaction.type === filter;
    })
    .sort((a, b) => b.date - a.date);
  
  const handleAddTransaction = () => {
    router.push('/transactions/add');
  };
  
  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.title}>Transactions</Text>
      <View style={styles.filterContainer}>
        <Pressable
          style={[
            styles.filterButton,
            filter === 'all' && styles.filterButtonActive
          ]}
          onPress={() => setFilter('all')}
        >
          <Text
            style={[
              styles.filterButtonText,
              filter === 'all' && styles.filterButtonTextActive
            ]}
          >
            All
          </Text>
        </Pressable>
        
        <Pressable
          style={[
            styles.filterButton,
            filter === 'income' && styles.filterButtonActive
          ]}
          onPress={() => setFilter('income')}
        >
          <ArrowUpRight size={16} color={filter === 'income' ? colors.text.white : colors.success} />
          <Text
            style={[
              styles.filterButtonText,
              filter === 'income' && styles.filterButtonTextActive
            ]}
          >
            Income
          </Text>
        </Pressable>
        
        <Pressable
          style={[
            styles.filterButton,
            filter === 'expense' && styles.filterButtonActive
          ]}
          onPress={() => setFilter('expense')}
        >
          <ArrowDownRight size={16} color={filter === 'expense' ? colors.text.white : colors.danger} />
          <Text
            style={[
              styles.filterButtonText,
              filter === 'expense' && styles.filterButtonTextActive
            ]}
          >
            Expense
          </Text>
        </Pressable>
      </View>
    </View>
  );
  
  if (filteredTransactions.length === 0) {
    return (
      <View style={styles.container}>
        {renderHeader()}
        <EmptyState
          title="No Transactions"
          message={
            filter === 'all' 
              ? "Add your first transaction to get started"
              : `No ${filter} transactions found`
          }
          actionLabel="Add Transaction"
          onAction={handleAddTransaction}
        />
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <FlatList
        data={filteredTransactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <TransactionItem transaction={item} />}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
      
      <Pressable style={styles.addButton} onPress={handleAddTransaction}>
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
    paddingTop: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 4,
    ...shadows.small,
  },
  filterButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text.primary,
    marginLeft: 4,
  },
  filterButtonTextActive: {
    color: colors.text.white,
  },
  listContent: {
    padding: 16,
    paddingTop: 0,
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