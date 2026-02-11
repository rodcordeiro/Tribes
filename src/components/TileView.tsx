import { TileType } from '@/common/game/enums';
import React, { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Tile } from '../common/game/tile';

export const TileView = React.memo(
  ({ tile, children }: { tile: Tile; size: number; children?: ReactNode }) => {
    const warOverlayOpacity = tile.warMemory > 0 ? 0.25 * tile.warMemory : 0;
    return (
      <View
        className={`flex flex-1 px-3 py-2`}
        style={[tileStyles.base, tileStyles[tile.tileType!]]}>
        {warOverlayOpacity > 0 && (
          <View
            pointerEvents="none"
            style={[tileStyles.warOverlay, { opacity: warOverlayOpacity }]}
          />
        )}
        {tile.roadLevel > 0 && (
          <View
            pointerEvents="none"
            style={[tileStyles.road, { opacity: Math.min(1, tile.roadLevel) }]}
          />
        )}
        {tile.city && (
          <View style={tileStyles.cityBadge}>
            <Text style={tileStyles.cityText}>C</Text>
          </View>
        )}
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
    position: 'relative',
  },
  [TileType.WaterTile]: { backgroundColor: 'lightblue' },
  [TileType.LandTile]: { backgroundColor: 'yellow' },
  [TileType.Forest]: { backgroundColor: 'lightgreen' },
  [TileType.Mountain]: { backgroundColor: 'gray' },
  warOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'red',
  },
  road: {
    position: 'absolute',
    left: 4,
    right: 4,
    bottom: 4,
    height: 2,
    backgroundColor: '#6b4e2e',
  },
  cityBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    height: 16,
    width: 16,
    borderRadius: 4,
    backgroundColor: '#1f2933',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cityText: {
    color: '#f5f7fa',
    fontSize: 10,
    fontWeight: '700',
  },
});
