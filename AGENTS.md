# Tribes Agent Guide

Tribes v1.1.2 is an Expo 54 / React Native 0.81 autonomous strategy simulation. Expo Router starts in `src/app/`; simulation behavior lives primarily in `src/common/game/board.ts` and state orchestration in `src/contexts/game.context.tsx`.

## Como usar este contexto

| Quando | Ler |
| --- | --- |
| Entender domínio e roadmap | `.agents/references/domain.md` e `CONTEXT.md` |
| Alterar simulação, telas ou estado | `.agents/references/structure.md`, `runtime.md` e `patterns.md` |
| Implementar ou validar mudanças | `.agents/references/conventions.md` |
| Avaliar limitações conhecidas | `.agents/references/tech-debt.md` |
| Aplicar padrões mobile | `$nero` → `references/guidelines/mobile-guidelines.md` |

## Regras rápidas

- Faça mudanças pequenas e preserve as fronteiras atuais; não reestruture o código sem pedido explícito.
- Não invente regras de negócio. Use `CONTEXT.md` e os ADRs; registre hipóteses quando ainda não houver decisão.
- Não altere migrations, CI/CD, infraestrutura, dependências ou testes sem solicitação explícita.
- Use `pnpm`; valide mudanças com `pnpm test` e `pnpm lint` quando aplicável.
- Após cada mudança, execute `pnpm release` e mantenha `package.json`, `CHANGELOG.md` e esta versão coerentes.

## Skills condicionais

- Em qualquer tarefa deste app mobile, use `$nero`, `$vercel-react-native-skills` e `$react-native-best-practices`.
- Para modelagem de termos ou decisões duráveis, use `domain-modeling`; para decisões ainda ambíguas, use `grilling` antes de implementar.
