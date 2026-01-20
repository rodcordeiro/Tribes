export enum TileType {
  WaterTile = 'WaterTile',
  LandTile = 'LandTile',
  Mountain = 'Mountain',
  Forest = 'Forest',
}

export enum TribeCore {
  // ☮️ Paz
  //   Nunca ataca
  //   Ao encontrar outra tribo:
  //     cria nova tribo
  //     ambas perdem população
  //   Não luta nem foge
  Peace = 'peace',
  // ⚔️ Guerra
  //   Ataca qualquer tribo encontrada
  //   Nunca foge
  //   Sempre resolve por combate
  War = 'war',
  // 🧭 Exploração
  //   Evita combate
  //   Se tribo de guerra estiver próxima → foge
  //   Prioriza terrenos não explorados
  Exploration = 'exploration',
}
