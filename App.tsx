import React from 'react';
import { StatusBar } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CocktailsDetails from './screens/CocktailDetails';
import SearchCocktails from './screens/SearchCocktails';
import FavoritesContextProvider from './contexts/favorites';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <>
      <StatusBar barStyle='dark-content' />
      <NavigationContainer>
        <FavoritesContextProvider>
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen name='Cocktails' component={SearchCocktails} />
            <Stack.Screen
              name='Cocktail details'
              options={{ headerShown: true }}
              component={CocktailsDetails}
            />
          </Stack.Navigator>
        </FavoritesContextProvider>
      </NavigationContainer>
    </>
  );
}

export default App;
