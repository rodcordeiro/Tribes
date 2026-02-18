# Plano de testes (v1.1.1 -> v1.3.0)

## Objetivo

Evoluir a qualidade da simulacao com cobertura progressiva e bloqueio de build por testes no pipeline.

## Stack recomendada

- Runner: `jest`
- TS transform: `ts-jest`
- Cobertura: `jest --coverage` (provider `v8`)
- Testes de React Native: `@testing-library/react-native`
- Mocks nativos Expo/React Native: `jest-expo` + setup local

## Fase 1 (meta minima: 10%)

### Entregas

- Configurar `jest` + `ts-jest` + script `pnpm test`.
- Configurar `pnpm test:coverage`.
- Definir threshold global inicial de 10%.
- Cobrir regras criticas de dominio:
- `Board`: validacao de limites, vizinhanca, fuga, economia basica.
- `Tile`: memoria de guerra (`recordWar` e `decayWarMemory`).
- `Tribe`: avaliacao de ameaca/oportunidade e mudanca de core em clone.

### Criterio de aceite

- `pnpm test:coverage` passa localmente com cobertura global >= 10%.

## Fase 2 (meta minima: 50%)

### Entregas

- Expandir testes de dominio para fluxos de simulacao:
- fundacao de cidade;
- construcao de estrada com cor da tribo;
- conquista/raid em cidades;
- efeitos de memoria de guerra na producao.
- Adicionar testes de reducer/context:
- `gameReducer` para `INIT`, `TICK`, `PAUSE`, `RESUME`, `SET_SPEED`, `LOG`.
- Adicionar testes de componentes prioritarios:
- `TileView` (overlay de guerra, badge de cidade, cor de estrada).
- telas com estados basicos (render sem crash).
- Subir threshold global para 50%.

### Criterio de aceite

- `pnpm test:coverage` passa localmente com cobertura global >= 50%.

## Fase 3 (gate de pipeline)

### Entregas

- Criar workflow CI para PR e push nas branches principais:
- instalar dependencias;
- executar `pnpm lint`;
- executar `pnpm test:coverage`.
- Tornar job de build/deploy dependente do job de testes.
- Publicar cobertura como artifact e resumo no PR.
- Definir policy: sem testes verdes, sem build.

### Criterio de aceite

- Pull request com testes falhando bloqueia merge/build.
- Build somente inicia apos sucesso de lint + testes.

## Sequencia de implementacao sugerida

1. Configurar ferramentas e primeiros testes unitarios (Fase 1).
2. Expandir cobertura para regras de negocio e UI critica (Fase 2).
3. Integrar ao pipeline e aplicar gate obrigatorio (Fase 3).
