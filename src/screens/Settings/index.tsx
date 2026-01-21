import { Balance } from '@/common/contants';
import { DEFAULT_BALANCE } from '@/common/game/balance';
import { Board } from '@/common/game/board';
import { BalanceSlider } from '@/components/BalanceSlider';
import { useGame } from '@/contexts/game.context';
import { View, Text, StyleSheet, Button } from 'react-native';

export function SettingsScreen() {
  const { state, dispatch, balance, setBalance } = useGame();
  const board = state.board;

  if (!board) return null;

  const stats = board.getStats();

  return (
    <View className="flex h-fit w-full flex-1">
      <View className="mt-10 px-3">
        <Text style={styles.title}>DEBUG</Text>

        <Text>Tick: {stats.tick}</Text>
        <Text>Tribos: {stats.tribes}</Text>
        <Text>População: {stats.population}</Text>
        <Text>Suprimentos: {stats.supplies}</Text>
        <Text>Status: {state.running ? '▶️' : '⏸️'}</Text>
        <Text>Velocidade: {state.speed}ms</Text>
        {state.board?.activeEvent && (
          <Text style={styles.event}>Evento: {state.board?.activeEvent?.event.name}</Text>
        )}
        <BalanceSlider
          label="Consumo por população"
          min={0}
          max={100}
          step={0.01}
          value={balance.supplies.consumptionPerPop}
          onChange={(v) =>
            setBalance({
              ...balance,
              supplies: {
                ...balance.supplies,
                consumptionPerPop: v,
              },
            })
          }
        />
        <BalanceSlider
          label="Mínimo para dividir"
          min={0}
          max={100}
          step={0.01}
          value={balance.population.minToDivide}
          onChange={(v) =>
            setBalance({
              ...balance,
              population: {
                ...balance.population,
                minToDivide: v,
              },
            })
          }
        />
        <BalanceSlider
          label="Growth Rate"
          min={0}
          max={100}
          step={0.01}
          value={balance.population.growthRate}
          onChange={(v) =>
            setBalance({
              ...balance,
              population: {
                ...balance.population,
                growthRate: v,
              },
            })
          }
        />
        <Button
          title="Reiniciar"
          onPress={() =>
            dispatch({
              type: 'INIT',
              board: new Board({
                width: Balance.game.width,
                height: Balance.game.height,
                tribesCount: Balance.game.tribes,
                balance: balance,
                logger: (entry) =>
                  dispatch({ type: 'LOG', entry: { ...entry, timestamp: new Date() } }),
              }),
            })
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  hud: {
    position: 'absolute',
    top: 50,
    left: 10,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 8,
    borderRadius: 6,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  event: {
    marginTop: 4,
    color: '#ffcc00',
  },
});
