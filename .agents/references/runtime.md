# Runtime

1. Expo Router carrega `src/app/_layout.tsx` e as rotas em `src/app/(tabs)/`.
2. `GameProvider` cria o `Board`, mantém o reducer e agenda ticks conforme velocidade/pausa.
3. `Board.tick()` processa economia, decisões, movimento, assentamento, infraestrutura, memórias e eventos.
4. O reducer substitui o board exposto à UI e limita o histórico recente de logs.

O motor é local e em memória. Não foram observados backend, autenticação, persistência remota ou pipeline de telemetria.
