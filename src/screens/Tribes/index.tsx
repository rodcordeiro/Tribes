import { useGame } from '../../contexts/game.context';
import { View, Text, ScrollView } from 'react-native';

export function TribesScreen() {
  const {
    state: { board },
  } = useGame();
  return (
    <View className="mt-10 flex px-3">
      <ScrollView className="mt-10">
        {board?.tribes &&
          board.tribes
            .sort()
            // .sort((a, b) => a.population - b.population)
            .map((tribe, idx) => (
              <View key={`tribe_view_${idx}`} className={`h-fit w-full rounded px-3 py-2`}>
                <View>
                  <Text>{tribe.name}</Text>
                  <View className="flex flex-row items-center justify-start gap-2">
                    <View style={{ backgroundColor: tribe.color, height: 12, width: 12 }} />
                    <Text>{tribe.core}</Text>
                  </View>
                </View>
                <View className="flex flex-row items-center justify-start gap-2">
                  <Text>X: {tribe.position?.x}</Text>
                  <Text>Y: {tribe.position?.y}</Text>
                </View>
                <View>
                  <Text>Population: {tribe.population}</Text>
                  <Text>Supplies: {tribe.supplies}</Text>
                </View>
              </View>
            ))}
      </ScrollView>
    </View>
  );
}
