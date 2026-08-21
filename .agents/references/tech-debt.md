# Dívida técnica

| Prioridade | Dívida observada | Impacto |
| --- | --- | --- |
| Alta | `Board.clone()` compartilha arrays/objetos internos | Ticks podem mutar estado anterior e dificultar previsibilidade/testes |
| Alta | Decisão, economia, combate, território e infraestrutura estão concentrados em `Board` | Crescimento do roadmap reduz localidade e testabilidade |
| Média | O caminho Manhattan provisório não contorna obstáculos | A* permanece planejado para v1.3.0 |
| Média | Não há persistência da partida | Reinício perde mundo, alianças, domínio e rotas |
| Média | Não há teste automatizado de UI ou smoke test de dispositivo | Regressões visuais exigem validação manual |
| Baixa | Pasta `src/common/contants/` contém typo legado | Descoberta e imports ficam menos claros |

O guideline mobile recomenda lógica de feature em hooks; o checkout ainda mantém o loop global em contexto e as regras do jogo no domínio. Reestruturar isso está fora da v1.1.2.
