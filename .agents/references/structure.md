# Estrutura do checkout

| Path | Responsabilidade observada |
| --- | --- |
| `src/app/` | Rotas finas e layouts do Expo Router |
| `src/screens/` | Composição das telas Home, Tribes, Logs e Settings |
| `src/components/` | UI compartilhada, inclusive tiles, tribos e controles de balanceamento |
| `src/contexts/` | Ciclo de vida do jogo e integração React |
| `src/stores/` | Estado e reducer do jogo |
| `src/common/game/` | Motor, entidades, eventos, balanceamento e testes Jest |
| `src/common/contants/` | Presets e constantes; o nome da pasta é legado |
| `src/assets/` | Imagens do app e do tabuleiro |
| `android/` | Projeto nativo gerado pelo Expo prebuild |

Entrypoint: `expo-router/entry`, configurado em `package.json`. O alias `@/` aponta para `src`.
