import { useRouter } from 'expo-router';
import { Check, Search } from 'lucide-react-native';
import React, { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { colors } from '@/constants/colors';
import { currencyNames, currencySymbols } from '@/constants/currencies';
import { useWallet } from '@/hooks/useWalletStore';
import { Currency } from '@/types/wallet';

export default function CurrencySelectionScreen() {
  const router = useRouter();
  const { settings, updateSettings } = useWallet();
  const [searchQuery, setSearchQuery] = useState('');

  const currencies = Object.keys(currencyNames) as Currency[];
  
  const filteredCurrencies = currencies.filter(currency =>
    currencyNames[currency].toLowerCase().includes(searchQuery.toLowerCase()) ||
    currency.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectCurrency = (currency: Currency) => {
    updateSettings({ defaultCurrency: currency });
    router.back();
  };

  const renderCurrencyItem = ({ item }: { item: Currency }) => (
    <Pressable
      style={[
        styles.currencyItem,
        settings.defaultCurrency === item && styles.selectedCurrencyItem
      ]}
      onPress={() => handleSelectCurrency(item)}
    >
      <View style={styles.currencyInfo}>
        <Text style={styles.currencySymbol}>{currencySymbols[item]}</Text>
        <View style={styles.currencyDetails}>
          <Text style={styles.currencyName}>{currencyNames[item]}</Text>
          <Text style={styles.currencyCode}>{item}</Text>
        </View>
      </View>
      {settings.defaultCurrency === item && (
        <Check size={20} color={colors.primary} />
      )}
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={20} color={colors.text.secondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search currencies..."
            placeholderTextColor={colors.text.light}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <FlatList
        data={filteredCurrencies}
        keyExtractor={(item) => item}
        renderItem={renderCurrencyItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  searchContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.card,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text.primary,
    marginLeft: 8,
  },
  listContent: {
    padding: 16,
  },
  currencyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectedCurrencyItem: {
    borderColor: colors.primary,
    backgroundColor: colors.background,
  },
  currencyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  currencySymbol: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
    width: 40,
    textAlign: 'center',
    marginRight: 16,
  },
  currencyDetails: {
    flex: 1,
  },
  currencyName: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text.primary,
    marginBottom: 4,
  },
  currencyCode: {
    fontSize: 14,
    color: colors.text.secondary,
  },
});