import React, { useCallback, useContext } from 'react';
import { useState, useEffect } from 'react';
import {
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { DeviceMotion } from 'expo-sensors';
import { StackNavigationProp } from '@react-navigation/stack';
import _ from 'lodash';
import { Drink, RootStackParamList } from '../types';
import { FavoritesContext } from '../contexts/favorites';
import { getCocktails } from '../services/cocktails';
import SearchBar from '../components/SearchBar';
import NoSearchResults from '../components/NoSearchResults';
import CocktailListElement from '../components/CocktailListElement';

interface SearchCocktailsProps {
  navigation: StackNavigationProp<RootStackParamList>;
}

export default function SearchCocktails({ navigation }: SearchCocktailsProps) {
  const [search, setSearch] = useState('');
  const [showFavorites, setShowFavorites] = useState(false);
  const [drinks, setDrinks] = useState<Drink[]>([]);
  const [loading, setLoading] = useState(false);
  const { isFavorite, savedFavorites, toggleFavorite } =
    useContext(FavoritesContext);

  const loadCocktails = useCallback(
    (onComplete = setDrinks) => {
      setLoading(true);
      const { cancel, request } = getCocktails({ name: search });
      request
        .then((cocktails) => cocktails && onComplete(cocktails))
        .finally(() => {
          setLoading(false);
        });
      return { request, cancel };
    },
    [search]
  );

  const loadMoreCocktails = useCallback(() => {
    if (!search && !loading) {
      loadCocktails((cocktails: Drink[]) =>
        setDrinks((prev) => _.uniqBy([...prev, ...(cocktails || [])], 'id'))
      );
    }
  }, [search]);

  useEffect(() => {
    const { cancel } = loadCocktails();
    return () => {
      cancel();
    };
  }, [search]);

  useEffect(() => {
    const fastMovesRequired = 10;
    const threshold = 10;
    const resetDelay = 3000;
    let passedThresholdTimes = 0;
    let lastTimePassedThrehold = Date.now();
    let lastLoad = Date.now();

    DeviceMotion.addListener(({ acceleration }) => {
      const passedThreshold =
        Math.abs(acceleration?.z || 0) > threshold ||
        Math.abs(acceleration?.x || 0) > threshold ||
        Math.abs(acceleration?.y || 0) > threshold;
      if (passedThreshold) {
        const now = Date.now();
        passedThresholdTimes++;
        if (now - lastTimePassedThrehold > resetDelay) passedThresholdTimes = 1;
        lastTimePassedThrehold = now;
        if (!loading && passedThresholdTimes === fastMovesRequired) {
          if (now - lastLoad > resetDelay) {
            lastLoad = now;
            loadCocktails();
          }
          passedThresholdTimes = 0;
        }
      }
    });
  }, []);

  const onPressDrink = (cocktailId: string) => {
    navigation.navigate('Cocktail details', { cocktailId });
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        refreshing={loading}
        onRefresh={showFavorites ? null : loadCocktails}
        ListHeaderComponent={
          <SearchBar
            {...{ search, setSearch, showFavorites, setShowFavorites }}
          />
        }
        ListEmptyComponent={
          loading ? null : (
            <NoSearchResults
              setShowFavorites={setShowFavorites}
              setSearch={setSearch}
              showFavorites={showFavorites}
            />
          )
        }
        data={showFavorites ? savedFavorites : drinks}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => onPressDrink(item.id)}>
            <CocktailListElement
              drink={item}
              toggleFavorite={toggleFavorite}
              isFavorite={isFavorite(item.id)}
            />
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
        style={styles.cocktailListContainer}
        contentContainerStyle={{ paddingBottom: 30 }}
        onEndReached={loadMoreCocktails}
        onEndReachedThreshold={0.3}
        initialNumToRender={10}
      />
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
