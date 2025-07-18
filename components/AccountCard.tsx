import { useRouter } from 'expo-router';
import { CreditCard } from 'lucide-react-native';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, shadows } from '@/constants/colors';
import { formatCurrency } from '@/constants/currencies';
import { useWallet } from '@/hooks/useWalletStore';
import { Account } from '@/types/wallet';

interface AccountCardProps {
  account: Account;
}

export default function AccountCard({ account }: AccountCardProps) {
  const router = useRouter();
  const { settings } = useWallet();
  
  const handlePress = () => {
    router.push(`/accounts/${account.id}`);
  };
  
  const getAccountTypeIcon = () => {
    switch (account.type) {
      case 'cash':
        return <CreditCard size={24} color={account.color} />;
      case 'credit':
        return <CreditCard size={24} color={account.color} />;
      case 'bank':
        return <CreditCard size={24} color={account.color} />;
      case 'digital':
        return <CreditCard size={24} color={account.color} />;
      default:
        return <CreditCard size={24} color={account.color} />;
    }
  };
  
  return (
    <Pressable onPress={handlePress}>
      <View style={[styles.card, shadows.medium]}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            {getAccountTypeIcon()}
          </View>
          <View style={styles.titleContainer}>
            <Text style={styles.accountName}>{account.name}</Text>
            <Text style={styles.accountType}>{account.type.charAt(0).toUpperCase() + account.type.slice(1)}</Text>
          </View>
        </View>
        <View style={styles.balanceContainer}>
          <Text style={styles.balanceLabel}>Balance</Text>
          <Text style={styles.balanceAmount}>
            {settings.hideBalances ? '••••••' : formatCurrency(account.balance, account.currency)}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  titleContainer: {
    flex: 1,
  },
  accountName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
  },
  accountType: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  balanceContainer: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 12,
  },
  balanceLabel: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 4,
  },
  balanceAmount: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text.primary,
  },
});