import arcano from '@/assets/tribes/arcano.png';
import barbaro from '@/assets/tribes/barbaro.png';
import cartografo from '@/assets/tribes/cartografo.png';
import colonizador from '@/assets/tribes/colonizador.png';
import explorador from '@/assets/tribes/explorador.png';
import pacifista from '@/assets/tribes/pacifista.png';
import conquistador from '@/assets/tribes/conquistador.png';
import defensor from '@/assets/tribes/defensor.png';
import saqueador from '@/assets/tribes/saqueador.png';
import { Tribe } from '@/common/game/tribe';
import { clsx } from 'clsx';
import { useEffect, useState } from 'react';
import { Image, ScrollView, Text, View } from 'react-native';
import { useGame } from '../../contexts/game.context';
const images = {
  arcano,
  barbaro,
  cartografo,
  colonizador,
  explorador,
  pacifista,
  conquistador,
  defensor,
  saqueador,
};
function TribeView({ tribe, position }: { tribe: Tribe; position: number }) {
  return (
    <View className={`flex h-fit w-fit max-w-md rounded bg-red-200 px-3 py-2`}>
      <Text className={clsx('text-wrap', position === 0 ? 'text-4xl' : 'text-xl')}>
        {tribe.name}
      </Text>
      <View className="flex w-full flex-row items-center justify-between bg-green-300 px-2">
        <View className="flex-1">
          <View>
            <View className="flex flex-row items-center justify-start gap-2">
              <View style={{ backgroundColor: tribe.color, height: 12, width: 12 }} />
              <Text>
                {tribe.core}: {tribe.archetype}
              </Text>
            </View>
          </View>
          <View className="flex flex-row items-center justify-start gap-2">
            <Text>X: {tribe.position?.x}</Text>
            <Text>Y: {tribe.position?.y}</Text>
          </View>
          <View>
            <Text>Population: {tribe.population}</Text>
            <Text>Supplies: {tribe.supplies}</Text>
            <Text>Cities: {tribe.cities.length}</Text>
          </View>
        </View>
        <Image
          source={images[tribe.archetype as keyof typeof images] ?? explorador}
          className="flex-2 w-fit"
          style={{
            width: 80,
            height: 80,
            // height: 'auto',
          }}
        />
      </View>
    </View>
  );
}

export function TribesScreen() {
  const [tribes, setTribes] = useState<Tribe[]>();
  const {
    state: { board },
  } = useGame();

  useEffect(() => {
    if (board?.tribes) setTribes(board.tribes.sort((a, b) => b.population - a.population));
  }, [board?.tribes]);

  return (
    <View className="mt-10 flex h-screen w-fit px-3">
      <ScrollView nestedScrollEnabled>
        {tribes && <TribeView tribe={tribes.at(0) as Tribe} position={0} />}
        <ScrollView className="mt-10" contentContainerClassName="gap-2" horizontal pagingEnabled>
          {tribes &&
            tribes
              .slice(1)
              .map((tribe, idx) => (
                <TribeView key={`tribe_view_${idx}`} tribe={tribe} position={idx + 1} />
              ))}
        </ScrollView>
      </ScrollView>
    </View>
  );
}
