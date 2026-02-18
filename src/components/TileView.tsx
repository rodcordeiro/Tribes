import { TileType } from '@/common/game/enums';
import React, { ReactNode } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { Tile } from '../common/game/tile';
import WaterTile from '@/assets/tiles/agua.png';
import LandTile from '@/assets/tiles/planicie.png';
import Mountain from '@/assets/tiles/montanha.png';
import Forest from '@/assets/tiles/floresta.png';

const images = {
  WaterTile,
  LandTile,
  Mountain,
  Forest,
};

export const TileView = React.memo(
  ({ tile, children }: { tile: Tile; size: number; children?: ReactNode }) => {
    const warOverlayOpacity = tile.warMemory > 0 ? 0.25 * tile.warMemory : 0;
    const hasVerticalConnection = tile.roadConnections.up || tile.roadConnections.down;
    const hasHorizontalConnection = tile.roadConnections.left || tile.roadConnections.right;
    // console.log({tileType:tile.tileType})
    return (
      <View
        className={`flex min-h-20 w-20 min-w-20 flex-1 px-3 py-2 `}
        style={[tileStyles.base, tileStyles[tile.tileType!]]}>
        {/* <Image
          source={images[tile.tileType as unknown as keyof typeof images]}
          className="-z-1 absolute h-full  w-20"
          style={{
            ...StyleSheet.absoluteFillObject,
          }}
        /> */}
        {warOverlayOpacity > 0 && (
          <View
            pointerEvents="none"
            style={[tileStyles.warOverlay, { opacity: warOverlayOpacity }]}
          />
        )}
        {tile.roadLevel > 0 && (
          <View pointerEvents="none" style={tileStyles.roadLayer}>
            {(hasHorizontalConnection || !hasVerticalConnection) && (
              <View
                style={[
                  tileStyles.roadHorizontal,
                  {
                    opacity: Math.min(1, tile.roadLevel),
                    backgroundColor: tile.roadColor ?? tileStyles.roadHorizontal.backgroundColor,
                  },
                ]}
              />
            )}
            {hasVerticalConnection && (
              <View
                style={[
                  tileStyles.roadVertical,
                  {
                    opacity: Math.min(1, tile.roadLevel),
                    backgroundColor: tile.roadColor ?? tileStyles.roadVertical.backgroundColor,
                  },
                ]}
              />
            )}
            {tile.roadConnections.up && (
              <View
                style={[
                  tileStyles.roadUp,
                  { backgroundColor: tile.roadColor ?? tileStyles.roadHorizontal.backgroundColor },
                ]}
              />
            )}
            {tile.roadConnections.right && (
              <View
                style={[
                  tileStyles.roadRight,
                  { backgroundColor: tile.roadColor ?? tileStyles.roadHorizontal.backgroundColor },
                ]}
              />
            )}
            {tile.roadConnections.down && (
              <View
                style={[
                  tileStyles.roadDown,
                  { backgroundColor: tile.roadColor ?? tileStyles.roadHorizontal.backgroundColor },
                ]}
              />
            )}
            {tile.roadConnections.left && (
              <View
                style={[
                  tileStyles.roadLeft,
                  { backgroundColor: tile.roadColor ?? tileStyles.roadHorizontal.backgroundColor },
                ]}
              />
            )}
          </View>
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
  roadLayer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roadHorizontal: {
    position: 'absolute',
    left: '20%',
    right: '20%',
    height: 3,
    borderRadius: 2,
    backgroundColor: '#6b4e2e',
  },
  roadVertical: {
    position: 'absolute',
    top: '20%',
    bottom: '20%',
    width: 3,
    borderRadius: 2,
    backgroundColor: '#6b4e2e',
  },
  roadUp: {
    position: 'absolute',
    top: 0,
    width: 2,
    height: '50%',
    backgroundColor: '#6b4e2e',
  },
  roadRight: {
    position: 'absolute',
    right: 0,
    width: '50%',
    height: 2,
    backgroundColor: '#6b4e2e',
  },
  roadDown: {
    position: 'absolute',
    bottom: 0,
    width: 2,
    height: '50%',
    backgroundColor: '#6b4e2e',
  },
  roadLeft: {
    position: 'absolute',
    left: 0,
    width: '50%',
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
