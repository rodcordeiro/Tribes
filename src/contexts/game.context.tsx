import { GameAction, gameReducer, GameState } from '@/stores/game.reducer';
import { createContext, ReactNode, useContext, useEffect, useReducer, useState } from 'react';
import { Board } from '../common/game/board';
import { GameBalance, DEFAULT_BALANCE } from '@/common/game/balance';

const GameContext = createContext<{
  state: GameState;
  balance: GameBalance;
  setBalance: React.Dispatch<React.SetStateAction<GameBalance>>;
  dispatch: React.ActionDispatch<[action: GameAction]>;
} | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [balance, setBalance] = useState<GameBalance>(DEFAULT_BALANCE);
  const [state, dispatch] = useReducer(gameReducer, {
    board: undefined,
    running: false,
    speed: 1000,
    balance,
    logs: [],
  });

  // INIT
  useEffect(() => {
    if (!state.board)
      dispatch({
        type: 'INIT',
        board: new Board({
          width: 4,
          height: 4,
          tribesCount: 4,
          balance: balance,
          logger: (entry) => dispatch({ type: 'LOG', entry: { ...entry, timestamp: new Date() } }),
        }),
      });
  }, [balance, state.board]);

  // GAME LOOP
  useEffect(() => {
    if (!state.running) return;

    const interval = setInterval(() => {
      dispatch({ type: 'TICK' });
      if (state.board?.tribes.length === 1) dispatch({ type: 'PAUSE' });
    }, state.speed);

    return () => clearInterval(interval);
  }, [state.board, state.running, state.speed]);

  return (
    <GameContext.Provider value={{ state, balance, setBalance, dispatch }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) throw new Error('GameContext not initialized');
  return context;
}
