# Convenções de mudança

## Código

- TypeScript com 2 espaços, aspas simples, largura 100 e trailing comma ES5.
- Componentes React em `PascalCase`; rotas seguem convenções do Expo Router.
- Use NativeWind em `className` e `StyleSheet.create` para estilos calculados/estruturais já existentes.
- Mantenha rotas finas e regras de simulação fora da UI.
- Funções e métodos novos devem receber JSDoc quando o contrato não for evidente.
- Não adicione dependências sem justificar impacto técnico e operacional.

## Validação

| Comando | Finalidade |
| --- | --- |
| `pnpm test` | Jest da simulação |
| `pnpm test:coverage` | Cobertura Jest |
| `pnpm lint` | ESLint com correções e limite de warnings |
| `pnpm web` | Smoke test web do Expo |
| `pnpm release` | Formata, atualiza versão e changelog sem criar tag |

Não altere testes sem solicitação explícita. Commits seguem Conventional Commits; mudanças visuais devem incluir screenshot ou gravação quando possível.
