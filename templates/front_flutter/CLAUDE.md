# Flutter Official Architecture + Feature-First + Riverpod

## 🎯 Arquitetura Baseada na Documentação Oficial Flutter

Este template implementa a **arquitetura oficial Flutter** (https://docs.flutter.dev/app-architecture) com organização **Feature-First** e **Riverpod** moderno com code generation.

## 🏗️ Estrutura Feature-First

```
lib/
├── core/                        # CORE LAYER (Shared)
│   ├── config/                 # Configurações globais
│   ├── theme/                  # Material Design themes
│   ├── utils/                  # Utilitários compartilhados
│   ├── widgets/                # Widgets reutilizáveis
│   └── routing/                # GoRouter + rotas globais
├── shared/                     # SHARED LAYER
│   ├── data/                   # Repositórios/Services compartilhados
│   │   ├── providers/          # @riverpod providers
│   │   ├── repositories/       # API clients, storage
│   │   └── models/             # DTOs compartilhados
│   └── domain/                 # Domain models compartilhados
└── features/                   # FEATURES (Feature-First)
    ├── auth/                   # Feature: Authentication
    ├── booking/                # Feature: Booking  
    └── profile/                # Feature: User Profile
        ├── data/               # Data Layer da feature
        │   ├── models/         # API DTOs
        │   ├── providers/      # @riverpod data providers
        │   ├── repositories/   # Repository implementations
        │   └── services/       # API services
        ├── domain/             # Domain Layer da feature
        │   ├── models/         # Domain entities (Freezed)
        │   └── use_cases/      # Business logic (opcional)
        └── presentation/       # UI Layer da feature
            ├── providers/      # @riverpod ViewModels (Notifiers)
            ├── screens/        # Telas da feature
            └── widgets/        # Widgets específicos da feature
```

## 🧩 Componentes Arquiteturais

### 1. Feature-First Organization
Cada feature é **autocontida** e independente:
- ✅ **Scalable**: Adicione features sem impacto
- ✅ **Team collaboration**: Múltiplos devs em paralelo
- ✅ **Clear boundaries**: Responsabilidades bem definidas
- ✅ **Monorepo ready**: Extract features facilmente

### 2. Official Flutter MVVM
Baseado na documentação oficial Flutter:
- **Views**: ConsumerWidget (UI pura)
- **ViewModels**: Riverpod Notifiers (business logic + state)
- **Repositories**: Single source of truth (SSOT)
- **Services**: API wrappers (stateless)

### 3. Riverpod Modern Stack
- **@riverpod**: Code generation automática
- **AsyncNotifier**: Para operações async
- **Freezed integration**: Estados imutáveis
- **Fine-grained rebuilds**: Performance otimizada

## 🔧 Comandos Úteis

```bash
# Gerar código (primeira vez)
flutter pub run build_runner build

# Watch mode (regenera automaticamente)
flutter pub run build_runner watch --delete-conflicting-outputs

# Executar app
flutter run

# Executar testes
flutter test

# Análise de código
flutter analyze
```

## 📝 Prompts Especializados para Claude Code

### Subagent: Flutter Feature-First Expert
Use este agente para desenvolvimento de features completas.

**Contexto**: Este projeto usa Feature-First + Official Flutter MVVM + Riverpod. Sempre considere:
- Organização Feature-First autocontida
- MVVM pattern com Riverpod Notifiers
- Code generation com @riverpod e Freezed
- Result pattern para error handling
- Separation of concerns por layers

**Tarefas que este agente pode fazer**:
- Criar features completas (data + domain + presentation)
- Implementar ViewModels com AsyncNotifier
- Criar repositories com Result pattern
- Configurar navegação com GoRouter
- Implementar testes para todas as layers

**Exemplo de prompt**:
"Como um expert em Flutter Feature-First, implemente uma feature completa de 'tasks' incluindo: domain entities com Freezed, repository com Result pattern, AsyncNotifier ViewModel, e UI com ConsumerWidget seguindo MVVM."

### Subagent: Riverpod Code Generation Expert
Use este agente para implementar state management moderno.

**Contexto**: Este projeto usa Riverpod com code generation (@riverpod). Sempre considere:
- @riverpod providers para DI automática
- AsyncNotifier para ViewModels com estado
- Freezed para estados imutáveis
- ProviderContainer para testing
- Fine-grained rebuilds com ref.watch

**Tarefas que este agente pode fazer**:
- Criar providers complexos com @riverpod
- Implementar AsyncNotifiers para ViewModels
- Configurar dependency injection automática
- Otimizar performance com fine-grained updates
- Criar testes com ProviderContainer mocking

**Exemplo de prompt**:
"Como um expert em Riverpod Code Generation, crie um sistema de cache inteligente usando @riverpod providers com invalidação automática, AsyncNotifier para state management, e testes unitários com ProviderContainer."

### Subagent: Flutter Testing Expert
Use este agente para implementar testes abrangentes.

**Contexto**: Este projeto prioriza testing com Riverpod + Mocktail. Sempre considere:
- ProviderContainer para unit testing
- Mock providers com overrides
- Widget testing com ConsumerWidget
- Integration testing com features
- Test coverage alto

**Tarefas que este agente pode fazer**:
- Criar unit tests para ViewModels
- Implementar widget tests para screens
- Configurar mocking com Mocktail
- Criar integration tests para features completas
- Otimizar test performance

**Exemplo de prompt**:
"Como um expert em Flutter Testing, implemente uma suíte completa de testes para uma feature de e-commerce, incluindo unit tests para ViewModels com ProviderContainer, widget tests para UI, e integration tests para fluxos de compra."

### Subagent: Flutter Architecture Performance Expert
Use este agente para otimizar performance e escalabilidade.

**Contexto**: Este projeto foca em performance com Riverpod + Feature-First. Sempre considere:
- Fine-grained rebuilds com Riverpod
- Lazy loading de features
- Memory management com dispose automático
- Code splitting por features
- Bundle size optimization

**Tarefas que este agente pode fazer**:
- Otimizar rebuilds com select e listen
- Implementar lazy loading avançado
- Configurar code splitting eficiente
- Analisar e otimizar bundle size
- Implementar caching inteligente

**Exemplo de prompt**:
"Como um expert em Flutter Performance, otimize uma app com 50+ screens para ter startup time <2s, memory usage estável, e rebuilds mínimos usando técnicas avançadas de Riverpod e Feature-First architecture."

## 🎨 Design Patterns Implementados

### 1. Result Pattern (Error Handling)
```dart
@freezed
sealed class Result<T> with _$Result<T> {
  const factory Result.success(T data) = Success<T>;
  const factory Result.error(String message) = Error<T>;
}
```

### 2. MVVM com AsyncNotifier
```dart
@riverpod
class FeatureViewModel extends _$FeatureViewModel {
  @override
  FutureOr<FeatureState> build() => FeatureState.initial();
  
  Future<void> loadData() async {
    state = const AsyncLoading();
    state = await AsyncValue.guard(() async {
      final data = await ref.read(repositoryProvider).getData();
      return FeatureState(data: data);
    });
  }
}
```

### 3. Repository Pattern com DI
```dart
@riverpod
FeatureRepository featureRepository(FeatureRepositoryRef ref) {
  return FeatureRepository(ref.watch(apiClientProvider));
}
```

## 🚀 Benefícios vs Outras Arquiteturas

| Vantagem | Nossa Arquitetura | Clean Architecture | BLoC Pattern |
|----------|------------------|-------------------|--------------|
| **Learning Curve** | 🟢 Moderada | 🔴 Alta | 🟡 Média |
| **Boilerplate** | 🟢 Mínimo | 🔴 Alto | 🟡 Médio |
| **Type Safety** | 🟢 Máxima | 🟡 Boa | 🟡 Boa |
| **Testing** | 🟢 Simples | 🟡 Complexo | 🟡 Médio |
| **Performance** | 🟢 Otimizada | 🟡 Boa | 🟢 Boa |
| **Code Gen** | 🟢 Nativo | ❌ Manual | ❌ Manual |
| **DI** | 🟢 Automático | 🔴 Manual | 🔴 Manual |
| **Scalability** | 🟢 Excelente | 🟢 Excelente | 🟡 Limitada |

## ✨ Quick Start

1. **Clone o template**
```bash
git clone <repo> my_app
cd my_app
```

2. **Install dependencies**
```bash
flutter pub get
```

3. **Generate code**
```bash
flutter pub run build_runner build
```

4. **Run app**
```bash
flutter run
```

5. **Create nova feature**
```bash
# Criar estrutura de pastas
mkdir -p lib/features/my_feature/{data/{models,providers,repositories},domain/models,presentation/{providers,screens,widgets}}

# Implementar seguindo os patterns do template
```

## 🎯 Evolution Path

1. **Start Simple**: Use apenas UI + Data layers
2. **Add Complexity**: Adicione Domain layer quando necessário
3. **Scale Features**: Adicione novas features independentemente
4. **Optimize**: Use performance patterns do Riverpod
5. **Test Everything**: Mantenha coverage alto

Esta arquitetura cresce com seu projeto! 🚀