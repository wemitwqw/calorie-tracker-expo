import { useMealStore } from '@/stores/useMealStore';
import React from 'react';
import MealItem from './MealItem';
import { FlatList, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import Reanimated, { 
  SharedValue, 
  useAnimatedStyle 
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Meal } from '@/types/meal';
import { deleteMeal } from '@/services/meal.service';

export default function MealList() {
  const meals = useMealStore(state => state.meals);

  const handleDelete = (id: string) => {
    deleteMeal(id);
  };

  const renderItem = ({ item }: { item: Meal }) => {
    const renderRightActions = (progress: SharedValue<number>, dragX: SharedValue<number>) => {
      const style = useAnimatedStyle(() => {
        return {
          transform: [{ translateX: dragX.value + 80 }],
        };
      });
  
      return (
        <Reanimated.View style={[styles.deleteContainer, style]}>
          <TouchableOpacity
            onPress={() => handleDelete(item.id)}
          >
            <Ionicons 
              name="trash-outline" 
              size={24} 
              color="white" 
            />
          </TouchableOpacity>
        </Reanimated.View>
      );
    };

    return (
      <ReanimatedSwipeable
        friction={2}
        rightThreshold={40}
        renderRightActions={renderRightActions}
      >
        <MealItem meal={item} />
      </ReanimatedSwipeable>
    );
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <FlatList
        data={meals}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        style={styles.mealsList}
      />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  mealsList: {
    flex: 1,
  },
  deleteContainer: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '100%',
  },
});