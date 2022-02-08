import React, { useCallback, useContext } from 'react';
import { useState, useEffect } from 'react';
import {
  FlatList,
  StyleSheet,
  SafeAreaView,
  Text,
  TouchableOpacity,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import _ from 'lodash';
import { Drink, RootStackParamList } from '../types';
import { FavoritesContext, FavoritesContextValue } from '../contexts/favorites';
import DrinkListElement from '../components/CocktailListElement';
import { getCocktails } from '../services/cocktails';
import SearchBar from '../components/SearchBar';
import NoSearchResults from '../components/NoSearchResults';

export default function SearchCocktails({
  navigation,
}: {
  navigation: StackNavigationProp<RootStackParamList>;
}) {
  return (
    <SafeAreaView style={styles.container}>
      <Text>Main screen</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  cocktailListContainer: {
    width: '100%',
  },
});
