import { Board } from './board';

export type GameEvent = {
  name: string;
  duration: number;
  apply: (board: Board) => void;
  revert: (board: Board) => void;
};

export const Events: GameEvent[] = [
  {
    name: 'Abundância',
    duration: 5,
    apply: (board) => {
      board.globalProductionModifier += 1;
    },
    revert: (board) => {
      board.globalProductionModifier -= 1;
    },
  },
  {
    name: 'Seca',
    duration: 5,
    apply: (board) => {
      board.globalProductionModifier -= 1;
    },
    revert: (board) => {
      board.globalProductionModifier += 1;
    },
  },
  {
    name: 'Peste',
    duration: 3,
    apply: (board) => {
      board.tribes.forEach((t) => (t.population = Math.floor(t.population * 0.7)));
    },
    revert: () => {},
  },
];
