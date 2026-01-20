import { GameProvider } from '../contexts/game.context';
import '../../global.css';

import { Slot } from 'expo-router';

export default function TabLayout() {
  return (
    <GameProvider>
      <Slot />
    </GameProvider>
  );
}
