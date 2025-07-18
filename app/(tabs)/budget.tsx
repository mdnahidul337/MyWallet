import { useRouter } from 'expo-router';
import { PieChart, Plus } from 'lucide-react-native';
import React, { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import BudgetProgressCard from '@/components/BudgetProgressCard';
import EmptyState from '@/components/EmptyState';
import { shadows } from '@/constants/colors';
import { formatCurrency } from '@/constants/currencies';
import { useTheme } from '@/hooks/useTheme';
import { useWallet } from '@/hooks/useWalletStore';

export default function BudgetScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { budgets, categories, settings, getMonthlyExpenses } = useWallet();
  const [showAddButton, setShowAddButton] = useState(true);
  
  const monthlyExpenses = getMonthlyExpenses();
  
  const handleAddBudget = () => {
    router.push('/budget/add');
  };
  
  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Monthly Budget</Text>
        <View style={styles.summaryContent}>
          <View style={styles.summaryIconContainer}>
            <PieChart size={32} color={colors.primary} />
          </View>
          <View style={styles.summaryTextContainer}>
            <Text style={styles.expensesLabel}>Total Expenses</Text>
            <Text style={styles.expensesAmount}>
              {settings.hideBalances 
                ? '••••••' 
                : formatCurrency(monthlyExpenses, settings.defaultCurrency)
              }
            </Text>
          </View>
        </View>
      </View>
      
      <Text style={styles.sectionTitle}>Your Budgets</Text>
    </View>
  );
  
  const styles = createStyles(colors);
  
  if (budgets.length === 0) {
    return (
      <View style={styles.container}>
        {renderHeader()}
        <EmptyState
          title="No Budgets Yet"
          message="Create your first budget to start tracking your spending"
          actionLabel="Create Budget"
          onAction={handleAddBudget}
          icon={<PieChart size={40} color={colors.primary} />}
        />
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <FlatList
        data={budgets}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <BudgetProgressCard budget={item} />}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContent}
        onScroll={(event) => {
          const offsetY = event.nativeEvent.contentOffset.y;
          setShowAddButton(offsetY < 50);
        }}
      />
      
      {showAddButton && (
        <Pressable style={styles.addButton} onPress={handleAddBudget}>
          <Plus size={24} color={colors.text.white} />
        </Pressable>
      )}
    </View>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 16,
    paddingTop: 24,
  },
  summaryCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    ...shadows.medium,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 16,
  },
  summaryContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  summaryTextContainer: {
    flex: 1,
  },
  expensesLabel: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 4,
  },
  expensesAmount: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text.primary,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 8,
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