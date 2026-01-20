import { GameAction, gameReducer, GameState } from '@/stores/game.reducer';
import { createContext, ReactNode, useContext, useEffect, useReducer } from 'react';
import { Board } from '../common/game/board';

const GameContext = createContext<{
  state: GameState;
  dispatch: React.ActionDispatch<[action: GameAction]>;
} | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, {
    board: undefined,
    running: false,
    speed: 1000,
    logs: [],
  });

  // INIT
  useEffect(() => {
    dispatch({
      type: 'INIT',
      board: new Board({
        width: 4,
        height: 4,
        tribesCount: 4,
        logger: (entry) => dispatch({ type: 'LOG', entry: { ...entry, timestamp: new Date() } }),
      }),
    });
  }, []);

  // GAME LOOP
  useEffect(() => {
    console.log({ running: state.running, speed: state.speed });
    if (!state.running) return;

    const interval = setInterval(() => {
      dispatch({ type: 'TICK' });
      if (state.board?.tribes.length === 1) dispatch({ type: 'PAUSE' });
    }, state.speed);

    return () => clearInterval(interval);
  }, [state.board, state.running, state.speed]);

  return <GameContext.Provider value={{ state, dispatch }}>{children}</GameContext.Provider>;
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) throw new Error('GameContext not initialized');
  return context;
}
