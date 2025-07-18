import * as Haptics from 'expo-haptics';
import { X } from 'lucide-react-native';
import React, { useState } from 'react';
import { Dimensions, Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/constants/colors';

interface PinPadProps {
  onComplete: (pin: string) => void;
  pinLength?: number;
  title?: string;
  subtitle?: string;
}

export default function PinPad({ 
  onComplete, 
  pinLength = 4, 
  title = 'Enter PIN',
  subtitle = 'Please enter your security PIN'
}: PinPadProps) {
  const [pin, setPin] = useState<string>('');
  
  const handleNumberPress = (number: number) => {
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync();
    }
    
    if (pin.length < pinLength) {
      const newPin = pin + number.toString();
      setPin(newPin);
      
      if (newPin.length === pinLength) {
        onComplete(newPin);
      }
    }
  };
  
  const handleDeletePress = () => {
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync();
    }
    
    if (pin.length > 0) {
      setPin(pin.slice(0, -1));
    }
  };
  
  const renderPinDots = () => {
    const dots = [];
    for (let i = 0; i < pinLength; i++) {
      dots.push(
        <View 
          key={i} 
          style={[
            styles.pinDot, 
            i < pin.length ? styles.pinDotFilled : null
          ]} 
        />
      );
    }
    return dots;
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
      
      <View style={styles.pinDotsContainer}>
        {renderPinDots()}
      </View>
      
      <View style={styles.keypadContainer}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
          <Pressable
            key={number}
            style={styles.keypadButton}
            onPress={() => handleNumberPress(number)}
          >
            <Text style={styles.keypadButtonText}>{number}</Text>
          </Pressable>
        ))}
        
        <View style={styles.keypadButton} />
        
        <Pressable
          style={styles.keypadButton}
          onPress={() => handleNumberPress(0)}
        >
          <Text style={styles.keypadButtonText}>0</Text>
        </Pressable>
        
        <Pressable
          style={styles.keypadButton}
          onPress={handleDeletePress}
        >
          <X size={24} color={colors.text.primary} />
        </Pressable>
      </View>
    </View>
  );
}

const { width } = Dimensions.get('window');
const buttonSize = (width - 64) / 3;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.background,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  pinDotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 40,
  },
  pinDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.primary,
    marginHorizontal: 8,
  },
  pinDotFilled: {
    backgroundColor: colors.primary,
  },
  keypadContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 300,
  },
  keypadButton: {
    width: buttonSize,
    height: buttonSize,
    borderRadius: buttonSize / 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  keypadButtonText: {
    fontSize: 28,
    fontWeight: '500',
    color: colors.text.primary,
  },
});