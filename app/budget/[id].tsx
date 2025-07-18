import { useLocalSearchParams, useRouter } from 'expo-router';
import { Calendar, Edit2, Plus, Trash2 } from 'lucide-react-native';
import React from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import EmptyState from '@/components/EmptyState';
import TransactionItem from '@/components/TransactionItem';
import { shadows } from '@/constants/colors';
import { formatCurrency } from '@/constants/currencies';
import { useTheme } from '@/hooks/useTheme';
import { useWallet } from '@/hooks/useWalletStore';
import { Category, Transaction } from '@/types/wallet';

export default function BudgetDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors } = useTheme();
  const { budgets, categories, transactions, settings, deleteBudget, getBudgetProgress } = useWallet();
  
  const budget = budgets.find(b => b.id === id);
  
  if (!budget) {
    return (
      <View style={createStyles(colors).container}>
        <EmptyState
          title="Budget Not Found"
          message="The budget you're looking for doesn't exist"
          actionLabel="Go Back"
          onAction={() => router.back()}
        />
      </View>
    );
  }
  
  const category = categories.find((c: Category) => c.id === budget.categoryId);
  const progress = getBudgetProgress(budget.id);
  
  const budgetTransactions = transactions
    .filter((t: Transaction) => 
      t.type === 'expense' && 
      t.categoryId === budget.categoryId &&
      t.date >= budget.startDate &&
      (!budget.endDate || t.date <= budget.endDate)
    )
    .sort((a: Transaction, b: Transaction) => b.date - a.date);
  
  const handleEditBudget = () => {
    router.push({
      pathname: '/budget/edit',
      params: { id }
    });
  };
  
  const handleDeleteBudget = () => {
    Alert.alert(
      'Delete Budget',
      `Are you sure you want to delete the budget "${budget.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            deleteBudget(id);
            router.back();
          }
        }
      ]
    );
  };
  
  const handleAddTransaction = () => {
    router.push({
      pathname: '/transactions/add',
      params: { categoryId: budget.categoryId }
    });
  };
  
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  const styles = createStyles(colors);
  
  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[styles.budgetCard, shadows.medium]}>
          <View style={styles.budgetHeader}>
            <Text style={styles.budgetTitle}>{budget.title}</Text>
            <Text style={styles.categoryName}>{category?.name || 'Budget'}</Text>
            <Text style={styles.periodLabel}>
              {budget.period.charAt(0).toUpperCase() + budget.period.slice(1)} Budget
            </Text>
          </View>
          
          <View style={styles.dateContainer}>
            <Calendar size={16} color={colors.text.secondary} />
            <Text style={styles.dateText}>
              {formatDate(budget.startDate)}
              {budget.endDate ? ` - ${formatDate(budget.endDate)}` : ''}
            </Text>
          </View>
          
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${Math.min(progress.percentage, 100)}%` },
                  progress.percentage > 85 ? styles.dangerFill : 
                  progress.percentage > 65 ? styles.warningFill : 
                  styles.normalFill
                ]} 
              />
            </View>
            <View style={styles.progressLabels}>
              <Text style={styles.spentLabel}>
                {formatCurrency(progress.spent, settings.defaultCurrency)}
              </Text>
              <Text style={styles.totalLabel}>
                {formatCurrency(progress.total, settings.defaultCurrency)}
              </Text>
            </View>
          </View>
          
          <Text style={styles.percentageText}>
            {progress.percentage.toFixed(1)}% of budget used
          </Text>
          
          <View style={styles.actionsContainer}>
            <Pressable style={styles.iconButton} onPress={handleEditBudget}>
              <Edit2 size={20} color={colors.primary} />
            </Pressable>
            
            <Pressable style={styles.iconButton} onPress={handleDeleteBudget}>
              <Trash2 size={20} color={colors.danger} />
            </Pressable>
          </View>
        </View>
        
        <View style={styles.transactionsHeader}>
          <Text style={styles.transactionsTitle}>Related Transactions</Text>
          <Pressable style={styles.addTransactionButton} onPress={handleAddTransaction}>
            <Plus size={20} color={colors.primary} />
            <Text style={styles.addTransactionText}>Add</Text>
          </Pressable>
        </View>
        
        {budgetTransactions.length > 0 ? (
          <View style={[styles.transactionsCard, shadows.small]}>
            {budgetTransactions.map((transaction: Transaction) => (
              <TransactionItem key={transaction.id} transaction={transaction} />
            ))}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <EmptyState
              title="No Transactions"
              message="No expenses in this category yet"
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

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  budgetCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    margin: 16,
  },
  budgetHeader: {
    marginBottom: 12,
  },
  budgetTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 4,
  },
  categoryName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.secondary,
    marginBottom: 4,
  },
  periodLabel: {
    fontSize: 16,
    color: colors.text.secondary,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  dateText: {
    fontSize: 14,
    color: colors.text.secondary,
    marginLeft: 8,
  },
  progressContainer: {
    marginBottom: 8,
  },
  progressBar: {
    height: 12,
    backgroundColor: colors.background,
    borderRadius: 6,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 6,
  },
  normalFill: {
    backgroundColor: colors.success,
  },
  warningFill: {
    backgroundColor: colors.warning,
  },
  dangerFill: {
    backgroundColor: colors.danger,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  spentLabel: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  totalLabel: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  percentageText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: 20,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 16,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  transactionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 8,
    marginBottom: 12,
  },
  transactionsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
  },
  addTransactionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  addTransactionText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.primary,
    marginLeft: 4,
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