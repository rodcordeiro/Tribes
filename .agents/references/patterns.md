# Padrões locais

- `Board` concentra regras da simulação e opera sobre `Tile` e `Tribe`.
- Configurações de economia e infraestrutura entram por `GameBalance`, permitindo ajuste pela tela Settings.
- Tiles guardam estado espacial persistente; tribos guardam identidade, comportamento, recursos e relações.
- Conexões de estrada são recíprocas entre direções opostas.
- Componentes de tile e tribo usam `React.memo`; otimizações adicionais exigem medição antes de memoização especulativa.
- Logs de domínio passam pelo logger do board e pelo reducer.
