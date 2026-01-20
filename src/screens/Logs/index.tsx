import { useGame } from '@/contexts/game.context';
import { StyleSheet, ScrollView, Text, View } from 'react-native';

export default function LogScreen() {
  const {
    state: { logs },
  } = useGame();
  return (
    <View className="mt-10 flex h-full w-full flex-1">
      <ScrollView>
        {logs
          .filter(Boolean)
          .reverse()
          .map((log, idx) => (
            <Text key={`log_entry_${idx}`} style={[styles.base, styles[log.type]]}>
              [{log.timestamp?.getHours()}:{log.timestamp?.getMinutes()}:
              {log.timestamp?.getSeconds()}]{log.content}
            </Text>
          ))}
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  base: {},
  Info: {
    color: 'green',
  },
  War: {
    color: 'red',
  },
  Marriage: {
    color: 'violet',
  },
});
