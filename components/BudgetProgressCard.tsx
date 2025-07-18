import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { shadows } from '@/constants/colors';
import { formatCurrency } from '@/constants/currencies';
import { useTheme } from '@/hooks/useTheme';
import { useWallet } from '@/hooks/useWalletStore';
import { Budget, Category } from '@/types/wallet';

interface BudgetProgressCardProps {
  budget: Budget;
}

export default function BudgetProgressCard({ budget }: BudgetProgressCardProps) {
  const router = useRouter();
  const { colors } = useTheme();
  const { getBudgetProgress, categories, settings } = useWallet();
  
  const category = categories.find((c: Category) => c.id === budget.categoryId);
  const progress = getBudgetProgress(budget.id);
  
  const handlePress = () => {
    router.push(`/budget/${budget.id}`);
  };
  
  const styles = createStyles(colors);
  
  return (
    <Pressable onPress={handlePress}>
      <View style={[styles.card, shadows.small]}>
        <View style={styles.header}>
          <Text style={styles.budgetTitle}>{budget.title}</Text>
          <Text style={styles.categoryName}>{category?.name || 'Budget'}</Text>
          <Text style={styles.period}>
            {budget.period.charAt(0).toUpperCase() + budget.period.slice(1)}
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
          {progress.percentage.toFixed(1)}% used
        </Text>
      </View>
    </Pressable>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  header: {
    marginBottom: 12,
  },
  budgetTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 4,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text.secondary,
    marginBottom: 2,
  },
  period: {
    fontSize: 12,
    color: colors.text.light,
  },
  progressContainer: {
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.background,
    borderRadius: 4,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
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
    fontSize: 14,
    fontWeight: '500',
    color: colors.text.primary,
    textAlign: 'center',
  },
});