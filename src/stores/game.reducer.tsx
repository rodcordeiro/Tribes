import { GameBalance } from '@/common/game/balance';
import { Board } from '@/common/game/board';

export type LogEntry = {
  type: 'Info' | 'War' | 'Marriage';
  content: string;
  timestamp?: Date;
};

export type GameAction =
  | { type: 'INIT'; board: Board }
  | { type: 'TICK' }
  | { type: 'PAUSE' }
  | { type: 'RESUME' }
  | { type: 'SET_SPEED'; speed: number }
  | { type: 'LOG'; entry: LogEntry };

export type GameState = {
  board?: Board;
  running: boolean;
  balance: GameBalance;
  speed: number;
  logs: LogEntry[];
  lastEvent?: string;
};

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'INIT':
      return {
        ...state,
        board: action.board,
        running: true,
        logs: [],
      };

    case 'TICK':
      if (!state.board) return state;
      return {
        ...state,
        board: state.board.tick(),
      };

    case 'PAUSE':
      return {
        ...state,
        running: false,
        logs: [...state.logs, { type: 'Info', content: 'Game paused' }],
      };

    case 'RESUME':
      return {
        ...state,
        running: true,
        speed: 1000,
        logs: [...state.logs, { type: 'Info', content: 'Game resumed' }],
      };

    case 'SET_SPEED':
      return { ...state, speed: action.speed };
    case 'LOG':
      return { ...state, logs: [...state.logs, action.entry] };

    default:
      return state;
  }
}
