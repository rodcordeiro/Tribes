import { TILE_SIZE } from '@/common/contants';
import { Tribe } from '@/common/game/tribe';
import { Feather } from '@expo/vector-icons';
import React from 'react';
import { View } from 'react-native';

export const TribeView = React.memo(({ tribe }: { tribe: Tribe }) => {
  return (
    <View
    //   style={[
    //     {
    //     //   left: tribe.position!.x * TILE_SIZE,
    //     //   top: tribe.position!.y * TILE_SIZE,
    //       backgroundColor: tribe.color,
    //     //   position: 'absolute',
    //     //   width: TILE_SIZE,
    //     //   height: TILE_SIZE,
    //     },
    //   ]}
    >
      <Feather name="user" color={tribe.color} size={24} />
    </View>
  );
});
