import { useRouter } from 'expo-router';
import { ArrowDownRight, ArrowUpRight, PieChart, Plus, Send } from 'lucide-react-native';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import AccountCard from '@/components/AccountCard';
import TransactionItem from '@/components/TransactionItem';
import { colors, shadows } from '@/constants/colors';
import { formatCurrency } from '@/constants/currencies';
import { useWallet } from '@/hooks/useWalletStore';

export default function DashboardScreen() {
  const router = useRouter();
  const { 
    accounts, 
    transactions, 
    settings,
    getMonthlyIncome,
    getMonthlyExpenses,
    getTotalBalance,
  } = useWallet();
  
  const totalBalance = getTotalBalance();
  const monthlyIncome = getMonthlyIncome();
  const monthlyExpenses = getMonthlyExpenses();
  
  const recentTransactions = [...transactions]
    .sort((a, b) => b.date - a.date)
    .slice(0, 5);
  
  const navigateToAddTransaction = () => {
    router.push('/transactions/add');
  };
  
  const navigateToAllTransactions = () => {
    router.push('/transactions');
  };
  
  const navigateToAllAccounts = () => {
    router.push('/accounts');
  };

  const quickActions = [
    {
      id: 'add-income',
      title: 'Add Income',
      icon: <ArrowUpRight size={20} color={colors.success} />,
      onPress: () => router.push({ pathname: '/transactions/add', params: { type: 'income' } }),
    },
    {
      id: 'add-expense',
      title: 'Add Expense',
      icon: <ArrowDownRight size={20} color={colors.danger} />,
      onPress: () => router.push({ pathname: '/transactions/add', params: { type: 'expense' } }),
    },
    {
      id: 'transfer',
      title: 'Transfer',
      icon: <Send size={20} color={colors.primary} />,
      onPress: () => router.push({ pathname: '/transactions/add', params: { type: 'transfer' } }),
    },
    {
      id: 'budget',
      title: 'Budget',
      icon: <PieChart size={20} color={colors.secondary} />,
      onPress: () => router.push('/budget'),
    },
  ];
  
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Hello!</Text>
        <Text style={styles.date}>
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            month: 'long', 
            day: 'numeric' 
          })}
        </Text>
      </View>
      
      <View style={[styles.balanceCard, shadows.medium]}>
        <Text style={styles.balanceLabel}>Total Balance</Text>
        <Text style={styles.balanceAmount}>
          {settings.hideBalances 
            ? '••••••' 
            : formatCurrency(totalBalance, settings.defaultCurrency)
          }
        </Text>
        
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <View style={styles.statIconContainer}>
              <ArrowUpRight size={16} color={colors.success} />
            </View>
            <View>
              <Text style={styles.statLabel}>Income</Text>
              <Text style={styles.statValue}>
                {settings.hideBalances 
                  ? '••••••' 
                  : formatCurrency(monthlyIncome, settings.defaultCurrency)
                }
              </Text>
            </View>
          </View>
          
          <View style={styles.statDivider} />
          
          <View style={styles.statItem}>
            <View style={styles.statIconContainer}>
              <ArrowDownRight size={16} color={colors.danger} />
            </View>
            <View>
              <Text style={styles.statLabel}>Expenses</Text>
              <Text style={styles.statValue}>
                {settings.hideBalances 
                  ? '••••••' 
                  : formatCurrency(monthlyExpenses, settings.defaultCurrency)
                }
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
      </View>
      
      <View style={styles.quickActionsContainer}>
        {quickActions.map((action) => (
          <Pressable
            key={action.id}
            style={[styles.quickActionButton, shadows.small]}
            onPress={action.onPress}
          >
            <View style={styles.quickActionIcon}>
              {action.icon}
            </View>
            <Text style={styles.quickActionText}>{action.title}</Text>
          </Pressable>
        ))}
      </View>
      
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>My Accounts</Text>
        <Pressable onPress={navigateToAllAccounts}>
          <Text style={styles.seeAllText}>See All</Text>
        </Pressable>
      </View>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.accountsContainer}
      >
        {accounts.slice(0, 3).map(account => (
          <View key={account.id} style={styles.accountCardContainer}>
            <AccountCard account={account} />
          </View>
        ))}
        
        <Pressable 
          style={[styles.addAccountCard, shadows.small]} 
          onPress={() => router.push('/accounts/add')}
        >
          <Plus size={24} color={colors.primary} />
          <Text style={styles.addAccountText}>Add Account</Text>
        </Pressable>
      </ScrollView>
      
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recent Transactions</Text>
        <Pressable onPress={navigateToAllTransactions}>
          <Text style={styles.seeAllText}>See All</Text>
        </Pressable>
      </View>
      
      <View style={[styles.transactionsCard, shadows.small]}>
        {recentTransactions.length > 0 ? (
          recentTransactions.map(transaction => (
            <TransactionItem key={transaction.id} transaction={transaction} />
          ))
        ) : (
          <View style={styles.emptyTransactions}>
            <Text style={styles.emptyText}>No transactions yet</Text>
            <Pressable 
              style={styles.addTransactionButton} 
              onPress={navigateToAddTransaction}
            >
              <Text style={styles.addTransactionText}>Add Transaction</Text>
            </Pressable>
          </View>
        )}
      </View>
      
      <View style={styles.bottomPadding} />
    </ScrollView>
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
  greeting: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 4,
  },
  date: {
    fontSize: 16,
    color: colors.text.secondary,
  },
  balanceCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    margin: 16,
    marginTop: 8,
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
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 16,
  },
  statItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  statLabel: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  statDivider: {
    width: 1,
    height: '100%',
    backgroundColor: colors.border,
    marginHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 24,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
  },
  seeAllText: {
    fontSize: 14,
    color: colors.primary,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  quickActionButton: {
    width: '48%',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
    marginHorizontal: '1%',
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text.primary,
    textAlign: 'center',
  },
  accountsContainer: {
    paddingHorizontal: 16,
  },
  accountCardContainer: {
    width: 280,
    marginRight: 16,
  },
  addAccountCard: {
    width: 140,
    height: 180,
    backgroundColor: colors.card,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  addAccountText: {
    fontSize: 14,
    color: colors.primary,
    marginTop: 8,
  },
  transactionsCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    margin: 16,
    marginTop: 8,
  },
  emptyTransactions: {
    alignItems: 'center',
    padding: 24,
  },
  emptyText: {
    fontSize: 16,
    color: colors.text.secondary,
    marginBottom: 16,
  },
  addTransactionButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addTransactionText: {
    fontSize: 14,
    color: colors.text.white,
    fontWeight: '500',
  },
  bottomPadding: {
    height: 100,
  },
});