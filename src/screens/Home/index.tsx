import { Pressable, ScrollView, Text, View } from 'react-native';
import { TileView } from '../../components/TileView';
import { TribeView } from '../../components/TribesView';
import { useGame } from '../../contexts/game.context';
import { Feather } from '@expo/vector-icons';

export default function HomeScreen() {
  const {
    state: { board, logs, speed, running },
    dispatch,
  } = useGame();

  // console.log(
  //   board?.tribes
  //     .map((tribe) => `[${tribe.name}]p: ${tribe.population} s: ${tribe.supplies}`)
  //     .join('\n')
  // );

  return (
    <View className="flex flex-1">
      <View
        className="mb-10 mt-16 flex w-full flex-row items-center justify-end gap-2 px-3 py-2"
        // style={{ backgroundColor: 'green' }}
      >
        {board?.activeEvent && (
          <Text className="rounded bg-white px-3">
            {board.activeEvent.event.name} ativa ({board.activeEvent.remaining}
            <Feather name="clock" />)
          </Text>
        )}
        <View className="flex flex-row gap-2">
          <View className="flex flex-row items-center justify-start gap-2 border-l-2 border-slate-500 bg-slate-300 py-1 pl-2 pr-4">
            <Text className="font-semibold">{board?.tribes.length}</Text>
            <Feather name="user" className="font-semibold" size={18} />
          </View>
          <View className="flex flex-row items-center justify-start gap-2 border-l-2 border-slate-500 bg-slate-300 py-1 pl-2 pr-4">
            <Text className="">{board?.ticks}</Text>
            <Feather name="clock" className="font-semibold" size={18} />
          </View>
        </View>
      </View>
      <ScrollView className="h-full w-full px-3">
        {board?.tiles.map((row, y) => (
          <View key={`board_row_${y}`} className="flex flex-row">
            {row.map((tile, x) => (
              <TileView
                key={`tile_${y}_${x}`}
                tile={tile}
                size={(board.MAX_HEIGHT ?? 1) * (board.MAX_WIDTH ?? 1)}>
                {board.tribes?.find(
                  (i) => i.position?.x === tile.position.x && i.position?.y === tile.position.y
                ) && (
                  <TribeView
                    tribe={
                      board.tribes.find(
                        (i) =>
                          i.position?.x === tile.position.x && i.position?.y === tile.position.y
                      )!
                    }
                  />
                )}
              </TileView>
            ))}
          </View>
        ))}
        <View>
          {logs.slice(logs.length - 6).map((log, idx) => (
            <Text key={`log_preview_${idx}`} style={{ opacity: idx / 4 + 0.25 }}>
              {log.content}
            </Text>
          ))}
        </View>
        <View className="mt-4 flex w-full flex-row items-center justify-center border-solid">
          <Pressable
            className="px-4 py-2"
            onPress={() => dispatch({ type: 'SET_SPEED', speed: speed * 2 })}>
            <Feather size={32} name="skip-back" />
          </Pressable>
          <Pressable
            className="px-4 py-2"
            onPress={() => dispatch({ type: running ? 'PAUSE' : 'RESUME' })}>
            <Feather size={32} name={running ? 'pause' : 'play'} />
          </Pressable>
          <Pressable className="px-4 py-2" onPress={() => dispatch({ type: 'TICK' })}>
            <Feather size={32} name="clock" />
          </Pressable>
          <Pressable
            className="px-4 py-2"
            onPress={() => dispatch({ type: 'SET_SPEED', speed: speed / 2 })}>
            <Feather size={32} name="skip-forward" />
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}
