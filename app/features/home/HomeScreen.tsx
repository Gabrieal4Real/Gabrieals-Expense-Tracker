// File: /app/(features)/(tabs)/index.tsx

import React, { useEffect } from 'react';
import { TitleText, BiggerText, TinyText } from '@/app/util/widgets/CustomText';
import { Colors } from '@/constants/Colors';
import { baseStyles } from '@/constants/Styles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HorizontalDivider, RoundedBox, VerticalDivider, SpacerVertical } from '@/app/util/widgets/CustomBox';
import { View, FlatList, ActivityIndicator } from 'react-native';
import { IconButton, TinyButton } from '@/app/util/widgets/CustomButton';
import { TransactionType, Category } from '@/app/data/TransactionItem';
import { useHomeViewModel } from './HomeViewModel';

export default function HomeScreen() {
  const { 
    transactions, 
    loading, 
    error, 
    loadTransactions, 
    addNewTransaction 
  } = useHomeViewModel();
  
  const insets = useSafeAreaInsets();

  useEffect(() => {
    loadTransactions();
  }, []);

  return (
    <View style={[baseStyles.baseBackground, { paddingTop: 18 + insets.top }]}>
      <TitleText text="Gabrieal's Appspensive" color={Colors.textPrimary} textAlign="center" />
      <RoundedBox style={{ marginVertical: 16}}>
        <View style={{ alignItems: 'center' }}>
          <BiggerText text="RM 7000" color={Colors.greenAccent} textAlign="center" style={{ paddingTop: 4, paddingBottom: 4, paddingHorizontal: 48 }} />
          <TinyText text="REMAINING" color={Colors.textPrimary} textAlign="center" style={{ paddingBottom: 4}} />
        </View>
        <IconButton
          onPress={() => console.log('Fingerprint pressed')}
          icon="finger-print"
          size={32}
          color={Colors.textPrimary}
        />
        <SpacerVertical size={8} />
        <HorizontalDivider/>
        <SpacerVertical size={8} />
        <View style={{ flexDirection: 'row',  justifyContent: 'center', alignItems: 'center'}}>
          <TinyButton 
            text="- Expense" 
            color={Colors.redAccent} 
            onPress={() => addNewTransaction(TransactionType.Expense, 20, Category.Food, '')} 
            style={{ padding: 4}} 
          />
          <VerticalDivider/>
          <TinyButton 
            text="+ Income" 
            color={Colors.greenAccent} 
            onPress={() => addNewTransaction(TransactionType.Income, 50, Category.Other, 'Salary')} 
            style={{ padding: 4}} 
          />
        </View>
      </RoundedBox>
      <TitleText text="Expenses" color={Colors.textPrimary} textAlign="left" style={{ marginVertical: 8}} />
      <HorizontalDivider/>
      
      {loading && (
        <View style={{ padding: 20, alignItems: 'center' }}>
          <ActivityIndicator size="large" color={Colors.textPrimary} />
        </View>
      )}
      
      {error && (
        <View style={{ padding: 20, alignItems: 'center' }}>
          <TinyText text={error} color={Colors.redAccent} textAlign="center" />
        </View>
      )}
      
      <FlatList
        data={transactions}
        renderItem={({ item }) => (
          <RoundedBox>
            <View>
              <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                <BiggerText 
                  text={item.amount.toString()} 
                  color={item.type === TransactionType.Income ? Colors.greenAccent : Colors.textPrimary} 
                  textAlign="left" 
                />
                <TinyText text={item.type} color={Colors.textPrimary} textAlign="right" />
              </View>
              <TinyText text={item.description || 'No description'} color={Colors.textPrimary} textAlign="left" style={{ paddingBottom: 4}} />
            </View>
          </RoundedBox>
        )}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        contentContainerStyle={{ paddingVertical: 16 }}
        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
      />
    </View>
  );
}