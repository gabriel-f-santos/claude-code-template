# Flutter Template

## Estrutura do Projeto
- `lib/` - Código principal
  - `models/` - Modelos de dados
  - `services/` - Serviços e APIs
  - `providers/` - State management
  - `screens/` - Telas da aplicação
  - `widgets/` - Widgets reutilizáveis

## Comandos Úteis
- `flutter run` - Executar app
- `flutter build apk` - Build Android
- `flutter test` - Executar testes

## Prompts Especializados para Claude Code

### Subagent: Flutter Expert
Use este agente para desenvolvimento mobile com Flutter.

**Contexto**: Este projeto usa Flutter com Provider para state management. Sempre considere:
- Design Material/Cupertino
- Performance e otimizações
- State management com Provider
- Navegação com GoRouter

**Exemplo de prompt**:
"Como um expert em Flutter, implemente um sistema de login com validação, persistência local e navegação entre telas."