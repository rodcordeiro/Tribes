import { Tribe } from '@/common/game/tribe';
import { useGame } from '../../contexts/game.context';
import { Image, View, Text, ScrollView } from 'react-native';
import { useEffect, useState } from 'react';
import Pacifista from '@/assets/tribes/pacifista.png';
import Explorador from '@/assets/tribes/explorador.png';
import Barbaro from '@/assets/tribes/barbaro.png';
import { TribeCore } from '@/common/game/enums';
import { clsx } from 'clsx';

function getImage(tribe: Tribe) {
  switch (tribe.core) {
    case TribeCore.War:
      return (
        <Image
          source={Barbaro}
          className="flex-2 w-fit"
          style={{
            width: 80,
            height: 80,
            // height: 'auto',
          }}
        />
      );
    case TribeCore.Peace:
      return (
        <Image
          source={Pacifista}
          className="flex-2 w-fit"
          style={{
            width: 80,
            height: 80,
            // height: 'auto',
          }}
        />
      );
    case TribeCore.Exploration:
      return (
        <Image
          source={Explorador}
          className="flex-2 w-fit"
          style={{
            width: 80,
            height: 80,
            // height: 80,
          }}
        />
      );

    default:
      return (
        <Image
          source={Explorador}
          className="flex-2 w-fit"
          style={{
            width: 80,
            height: 80,
            // height: 'auto',
          }}
        />
      );
  }
}
function TribeView({ tribe, position }: { tribe: Tribe; position: number }) {
  return (
    <View className={`flex h-fit w-screen max-w-screen-sm  rounded px-3 py-2`}>
      <Text className={clsx('text-wrap ', position === 0 ? 'text-4xl' : 'text-xl')}>
        {tribe.name}
      </Text>
      <View className="flex flex-row items-center justify-between ">
        <View className="flex-1">
          <View>
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
        {getImage(tribe)}
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
        <ScrollView className="mt-10" horizontal pagingEnabled>
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
