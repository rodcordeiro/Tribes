import { TileType } from '@/common/game/enums';
import React, { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Tile } from '../common/game/tile';

export const TileView = React.memo(
  ({ tile, children }: { tile: Tile; size: number; children?: ReactNode }) => {
    return (
      <View
        className={`flex flex-1 px-3 py-2`}
        style={[tileStyles.base, tileStyles[tile.tileType!]]}>
        <View>
          <Text>X:{tile.position.x}</Text>
          <Text>Y:{tile.position.y}</Text>
        </View>
        {children}
      </View>
    );
  }
);
const tileStyles = StyleSheet.create({
  base: {
    borderStyle: 'solid',
    borderWidth: 2,
  },
  [TileType.WaterTile]: { backgroundColor: 'lightblue' },
  [TileType.LandTile]: { backgroundColor: 'yellow' },
  [TileType.Forest]: { backgroundColor: 'lightgreen' },
  [TileType.Mountain]: { backgroundColor: 'gray' },
});
