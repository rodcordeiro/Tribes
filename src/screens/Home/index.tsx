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
  // flex-grow flex-row items-center justify-start
  console.log(
    board?.tribes
      .map((tribe) => `[${tribe.name}]p: ${tribe.population} s: ${tribe.supplies}`)
      .join('\n')
  );

  return (
    <View className="flex flex-1">
      <View
        className="mt-10  flex w-full flex-row items-center justify-end gap-2 px-3 py-2"
        // style={{ backgroundColor: 'green' }}
      >
        {board?.activeEvent && (
          <Text className="rounded bg-white px-3">
            {board.activeEvent.event.name} ativa ({board.activeEvent.remaining}
            <Feather name="clock" />)
          </Text>
        )}
        <View className="flex flex-row gap-2">
          <Text className="">
            {board?.tribes.length}
            <Feather name="user" />
          </Text>
          <Text className="">
            {board?.ticks} <Feather name="clock" />
          </Text>
        </View>
        <View className="border-1 flex w-fit flex-row border-solid border-slate-400">
          <Pressable
            className="px-4 py-2"
            onPress={() => dispatch({ type: 'SET_SPEED', speed: speed * 2 })}>
            <Feather name="skip-back" />
          </Pressable>
          <Pressable
            className="px-4 py-2"
            onPress={() => dispatch({ type: running ? 'PAUSE' : 'RESUME' })}>
            <Feather name={running ? 'pause' : 'play'} />
          </Pressable>
          <Pressable className="px-4 py-2" onPress={() => dispatch({ type: 'TICK' })}>
            <Feather name="clock" />
          </Pressable>
          <Pressable
            className="px-4 py-2"
            onPress={() => dispatch({ type: 'SET_SPEED', speed: speed / 2 })}>
            <Feather name="skip-forward" />
          </Pressable>
        </View>
      </View>
      <ScrollView className="flex h-full w-full px-3">
        {board?.tiles.map((row, x) => (
          <View key={`board_row_${x}`} className="flex flex-row">
            {row.map((tile, y) => (
              <TileView
                key={`tile_${x}_${y}`}
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
      </ScrollView>
    </View>
  );
}
