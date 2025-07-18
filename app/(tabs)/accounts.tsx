import { useRouter } from 'expo-router';
import { Plus } from 'lucide-react-native';
import React, { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import AccountCard from '@/components/AccountCard';
import EmptyState from '@/components/EmptyState';
import { colors, shadows } from '@/constants/colors';
import { formatCurrency } from '@/constants/currencies';
import { useWallet } from '@/hooks/useWalletStore';

export default function AccountsScreen() {
  const router = useRouter();
  const { accounts, settings, getTotalBalance } = useWallet();
  const [showAddButton, setShowAddButton] = useState(true);
  
  const totalBalance = getTotalBalance();
  
  const handleAddAccount = () => {
    router.push('/accounts/add');
  };
  
  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.balanceContainer}>
        <Text style={styles.balanceLabel}>Total Balance</Text>
        <Text style={styles.balanceAmount}>
          {settings.hideBalances 
            ? '••••••' 
            : formatCurrency(totalBalance, settings.defaultCurrency)
          }
        </Text>
      </View>
    </View>
  );
  
  if (accounts.length === 0) {
    return (
      <View style={styles.container}>
        {renderHeader()}
        <EmptyState
          title="No Accounts Yet"
          message="Add your first account to start tracking your finances"
          actionLabel="Add Account"
          onAction={handleAddAccount}
        />
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <FlatList
        data={accounts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <AccountCard account={item} />}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContent}
        onScroll={(event) => {
          const offsetY = event.nativeEvent.contentOffset.y;
          setShowAddButton(offsetY < 50);
        }}
      />
      
      {showAddButton && (
        <Pressable style={styles.addButton} onPress={handleAddAccount}>
          <Plus size={24} color={colors.text.white} />
        </Pressable>
      )}
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
  balanceContainer: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    ...shadows.medium,
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