# Next.js Template

## Estrutura do Projeto
- `app/` - App Router (Next.js 13+)
- `components/` - Componentes reutilizáveis
- `lib/` - Utilitários e configurações
- `types/` - Tipos TypeScript

## Comandos Úteis
- `npm run dev` - Servidor desenvolvimento
- `npm run build` - Build de produção  
- `npm run lint` - Executar ESLint
- `npm run type-check` - Verificar tipos

## Prompts Especializados para Claude Code

### Subagent: React/Next.js Expert
Use este agente para tarefas de frontend com Next.js.

**Contexto**: Este projeto usa Next.js 14 com App Router, TypeScript e Tailwind CSS. Sempre considere:
- Server Components vs Client Components
- Otimizações de performance
- SEO e acessibilidade
- Design responsivo com Tailwind

**Exemplo de prompt**:
"Como um expert em Next.js, crie um sistema de autenticação com middleware, páginas protegidas e estado global."