# Flutter Clean Architecture + Feature-First + Riverpod + Command Pattern

## 🎯 Arquitetura Avançada com Patterns Modernos

Este template implementa uma **arquitetura Flutter robusta** baseada na documentação oficial + patterns avançados:
- **Command/Query Pattern** para operações reativas
- **Result Pattern** para error handling funcional  
- **UseCase Pattern** para business logic isolada
- **Feature-First** para escalabilidade
- **Riverpod + Freezed** para state management moderno

## 🏗️ Estrutura Feature-First

```
lib/
├── core/                        # CORE LAYER (Shared)
│   ├── config/                 # Configurações globais
│   ├── theme/                  # Material Design themes
│   ├── utils/                  # Utilitários compartilhados
│   ├── widgets/                # Widgets reutilizáveis
│   ├── routing/                # GoRouter + rotas globais
│   └── types/                  # Types compartilhados (Result, Command, etc.)
│       ├── result.dart         # Result<T> pattern
│       ├── command.dart        # Command pattern base
│       └── exceptions.dart     # Custom exceptions
├── shared/                     # SHARED LAYER
│   ├── data/                   # Repositórios/Services compartilhados
│   │   ├── providers/          # @riverpod providers
│   │   ├── repositories/       # API clients, storage
│   │   ├── models/             # DTOs compartilhados
│   │   └── services/           # HTTP client, storage services
│   └── domain/                 # Domain models compartilhados
│       ├── models/             # Entidades base
│       └── repositories/       # Repository interfaces
└── features/                   # FEATURES (Feature-First)
    ├── auth/                   # Feature: Authentication
    ├── clinicas/               # Feature: Clinics Management
    └── profile/                # Feature: User Profile
        ├── data/               # Data Layer da feature
        │   ├── models/         # API DTOs (Freezed + JsonAnnotation)
        │   ├── providers/      # @riverpod data providers
        │   ├── repositories/   # Repository implementations
        │   └── services/       # API services específicos
        ├── domain/             # Domain Layer da feature
        │   ├── models/         # Domain entities (Freezed)
        │   ├── repositories/   # Repository interfaces
        │   └── use_cases/      # Business logic + validation
        └── presentation/       # UI Layer da feature
            ├── commands/       # Command objects para actions
            ├── providers/      # @riverpod ViewModels (AsyncNotifiers)
            ├── screens/        # Telas da feature
            └── widgets/        # Widgets específicos da feature
```

## 🧩 Patterns Arquiteturais Avançados

### 1. Result Pattern (Error Handling Funcional)
```dart
@freezed
sealed class Result<T> with _$Result<T> {
  const factory Result.ok(T value) = Ok<T>;
  const factory Result.error(Exception error, [StackTrace? stackTrace]) = Error<T>;
  
  // Helper methods
  bool get isOk => this is Ok<T>;
  bool get isError => this is Error<T>;
  T? get valueOrNull => isOk ? (this as Ok<T>).value : null;
  Exception? get errorOrNull => isError ? (this as Error<T>).error : null;
  
  // Functional operations
  Result<U> map<U>(U Function(T) mapper);
  Future<Result<U>> flatMap<U>(Future<Result<U>> Function(T) mapper);
  T getOrElse(T Function(Exception) fallback);
}
```

### 2. Command Pattern (Reactive Operations)
```dart
@freezed
sealed class CommandState<T> with _$CommandState<T> {
  const factory CommandState.idle() = _Idle<T>;
  const factory CommandState.running() = _Running<T>;
  const factory CommandState.completed(T data) = _Completed<T>;
  const factory CommandState.error(Exception error, [StackTrace? stackTrace]) = _Error<T>;
  
  bool get isRunning => this is _Running<T>;
  bool get isCompleted => this is _Completed<T>;
  bool get hasError => this is _Error<T>;
}

abstract class Command<T> {
  CommandState<T> get state;
  Future<void> execute();
  void reset();
}
```

### 3. UseCase Pattern (Business Logic Isolada)
```dart
abstract class UseCase<TResult, TParams> {
  Future<Result<TResult>> execute(TParams params);
}

class GetClinicasUseCase extends UseCase<List<Clinica>, NoParams> {
  final ClinicasRepository _repository;
  
  GetClinicasUseCase(this._repository);
  
  @override
  Future<Result<List<Clinica>>> execute(NoParams params) async {
    try {
      // Business logic e validações aqui
      final result = await _repository.getClinicas();
      return result.map((clinicas) => 
        clinicas.where((c) => c.isActive).toList()
      );
    } catch (e) {
      return Result.error(Exception('Failed to get clinicas: $e'));
    }
  }
}
```

### 4. Feature-First + Clean Architecture
Cada feature segue Clean Architecture com camadas bem definidas:
- **Presentation**: Commands + Providers + UI
- **Domain**: UseCases + Entities + Repository Interfaces  
- **Data**: Repository Implementations + API Services + DTOs

### 5. Riverpod Advanced Patterns
```dart
// Command Provider
@riverpod
class DeleteClinicaCommand extends _$DeleteClinicaCommand {
  @override
  CommandState<void> build() => const CommandState.idle();
  
  Future<void> execute(String id) async {
    state = const CommandState.running();
    
    final useCase = ref.read(deleteClinicaUseCaseProvider);
    final result = await useCase.execute(DeleteClinicaParams(id));
    
    result.fold(
      onOk: (_) => state = const CommandState.completed(null),
      onError: (error, stackTrace) => state = CommandState.error(error, stackTrace),
    );
  }
  
  void reset() => state = const CommandState.idle();
}

// Query Provider  
@riverpod
class ClinicasQuery extends _$ClinicasQuery {
  @override
  Future<Result<List<Clinica>>> build() async {
    final useCase = ref.read(getClinicasUseCaseProvider);
    return await useCase.execute(const NoParams());
  }
  
  Future<void> refresh() async {
    ref.invalidateSelf();
  }
}

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

## 🎯 Feature Development Guide

### 📋 **Step-by-Step Process for Adding New Features**

Siga este processo rigorosamente para manter a consistência arquitetural:

#### **1. 📁 Create Feature Structure**
```bash
# Exemplo: Adicionando feature "Products"
mkdir -p lib/features/products/{data/{models,providers,repositories,services},domain/{models,use_cases},presentation/{providers,screens,widgets}}
```

#### **2. 📊 Domain Layer (Business Logic)**
```bash
# 1. Create domain model
touch lib/features/products/domain/models/product.dart

# 2. Create use cases (optional for simple CRUD)
touch lib/features/products/domain/use_cases/get_products_use_case.dart
```

#### **3. 💾 Data Layer (External Data)**
```bash
# 1. Create data model with JSON serialization
touch lib/features/products/data/models/product_model.dart

# 2. Create repository implementation
touch lib/features/products/data/repositories/products_repository.dart

# 3. Create data providers (API, local storage)
touch lib/features/products/data/providers/products_api_provider.dart
touch lib/features/products/data/services/products_service.dart
```

#### **4. 🎨 Presentation Layer (UI)**
```bash
# 1. Create Riverpod providers (state management)
touch lib/features/products/presentation/providers/products_provider.dart

# 2. Create screens
touch lib/features/products/presentation/screens/products_screen.dart
touch lib/features/products/presentation/screens/product_detail_screen.dart

# 3. Create widgets
touch lib/features/products/presentation/widgets/product_card.dart
touch lib/features/products/presentation/widgets/products_list.dart
```

#### **5. 🧪 Testing**
```bash
# Create tests following the same structure
mkdir -p test/features/products/{data,domain,presentation}
touch test/features/products/data/repositories/products_repository_test.dart
touch test/features/products/presentation/providers/products_provider_test.dart
```

### 🤖 **Claude Code Prompt Templates**

#### **📝 Complete Feature Prompt**
```
Você é um especialista em Flutter com arquitetura feature-first usando Riverpod.

TAREFA: Criar a feature "Products" completa seguindo nossa arquitetura.

ARQUITETURA OBRIGATÓRIA:
lib/features/products/
├── data/
│   ├── models/product_model.dart (Freezed + JsonAnnotation)
│   ├── repositories/products_repository.dart (implementação)
│   ├── providers/products_api_provider.dart (Dio HTTP)
│   └── services/products_service.dart (business data logic)
├── domain/
│   └── models/product.dart (entidade pura)
├── presentation/
│   ├── providers/products_provider.dart (@riverpod AsyncNotifier)
│   ├── screens/products_screen.dart (ConsumerWidget)
│   └── widgets/product_card.dart (reutilizável)

REQUISITOS TÉCNICOS:
✅ Use @riverpod com code generation
✅ Freezed para modelos imutáveis  
✅ AsyncNotifier para estado assíncrono
✅ Result<T, E> para error handling
✅ Dio para HTTP requests
✅ Repository pattern
✅ Teste unitário básico

FUNCIONALIDADES:
- Listar produtos com loading/error states
- Buscar produto por ID
- Adicionar produto (POST)
- Atualizar produto (PUT) 
- Deletar produto (DELETE)

EXEMPLO DE ESTRUTURA:
- ProductModel (data) extends Product (domain)
- ProductsRepository implementa interface
- ProductsNotifier extends AsyncNotifier<List<Product>>
- ProductsScreen usa ConsumerWidget
- Error handling com Result pattern

ENTREGUE: Código completo de todos os arquivos seguindo exatamente nossa arquitetura.
```

#### **📱 UI-Only Feature Prompt**
```
TAREFA: Criar apenas a UI da feature "Settings" (sem backend).

ARQUITETURA:
lib/features/settings/
├── presentation/
│   ├── providers/settings_provider.dart (StateNotifier local)
│   ├── screens/settings_screen.dart
│   └── widgets/setting_tile.dart

REQUISITOS:
✅ Settings locais (SharedPreferences)
✅ Theme switching
✅ Language selection  
✅ Notification preferences
✅ StateNotifier para estado local
✅ Persistência automática

NÃO CRIE: data/ e domain/ layers (não precisam para settings locais)
```

#### **🔄 Extend Existing Feature Prompt**
```
TAREFA: Adicionar funcionalidade "Favorites" à feature Users existente.

MODIFICAÇÕES NECESSÁRIAS:
1. lib/features/users/domain/models/user.dart 
   - Adicionar campo isFavorite

2. lib/features/users/data/models/user_model.dart
   - Atualizar JsonAnnotation  

3. lib/features/users/data/repositories/users_repository.dart
   - Adicionar toggleFavorite method

4. lib/features/users/presentation/providers/users_provider.dart
   - Adicionar toggleFavorite action

5. lib/features/users/presentation/widgets/user_card.dart
   - Adicionar favorite button/icon

MANTENHA: Arquitetura existente, apenas estenda funcionalidades.
```

### 🏗️ **Architecture Decision Tree**

```
Nova Feature? 
├── Precisa de dados externos? 
│   ├── SIM → Criar: domain/ + data/ + presentation/
│   └── NÃO → Criar apenas: presentation/
├── É extensão de feature existente?
│   ├── SIM → Modificar arquivos existentes
│   └── NÃO → Criar nova estrutura completa
├── Complexidade alta?
│   ├── SIM → Adicionar domain/use_cases/
│   └── NÃO → Use apenas Repository pattern
```

### 📐 **Architectural Rules (NEVER BREAK)**

#### **✅ ALWAYS DO:**
1. **Feature isolation**: Nunca importe de outras features
2. **Layer separation**: Data ↔ Domain ↔ Presentation
3. **Dependency direction**: Presentation → Domain ← Data
4. **Immutable models**: Use Freezed sempre
5. **Code generation**: @riverpod, JsonAnnotation, Freezed
6. **Error handling**: Result<T, E> pattern
7. **Testing**: Pelo menos repository e provider tests

#### **❌ NEVER DO:**
1. **Cross-feature imports**: `import '../other_feature'`
2. **Direct API calls in UI**: Use sempre repositories
3. **Mutable state**: Evite setState, use Riverpod
4. **Mixed concerns**: UI logic no repository
5. **Skip error handling**: Sempre trate erros
6. **Ignore testing**: Toda feature deve ter testes

### 🔄 **Reasoning Process for Features**

#### **Before Adding Any Feature:**
1. **Define scope**: O que exatamente esta feature faz?
2. **Check dependencies**: Precisa de outras features?
3. **Choose layers**: Precisa de todas as 3 layers?
4. **Plan state**: Como o estado será gerenciado?
5. **Design API**: Como outros podem usar esta feature?

#### **During Development:**
1. **Start with domain**: Define modelos e interfaces
2. **Implement data**: Repositories e providers
3. **Build presentation**: UI e state management
4. **Add tests**: Unit tests primeiro
5. **Integrate**: Conecte com o resto do app

#### **After Implementation:**
1. **Test thoroughly**: Manual e automated
2. **Document**: Adicione à documentação  
3. **Refactor**: Melhore código se necessário
4. **Monitor**: Observe performance e bugs

### 🎯 **Quick Feature Checklist**

Antes de considerar a feature "completa":

- [ ] **Structure**: Seguiu exatamente a estrutura de pastas?
- [ ] **Models**: Usou Freezed e JsonAnnotation?
- [ ] **State**: Implementou com @riverpod AsyncNotifier?
- [ ] **Repository**: Seguiu o Repository pattern?
- [ ] **Error Handling**: Usou Result<T, E>?
- [ ] **UI**: ConsumerWidget com loading/error states?
- [ ] **Tests**: Pelo menos repository e provider?
- [ ] **Dependencies**: Não importou de outras features?

### 💡 **Pro Tips for Claude Code**

1. **Always start with the prompt**: Use os templates exatos
2. **Follow structure religiously**: Não improvise a arquitetura  
3. **Generate code incrementally**: Uma layer por vez
4. **Test as you go**: Não deixe tudo para o final
5. **Use our examples**: Features Home/Auth como referência
6. **Ask for clarification**: Se não entender, pergunte

## 🎯 Evolution Path

1. **Start Simple**: Use apenas UI + Data layers
2. **Add Complexity**: Adicione Domain layer quando necessário
3. **Scale Features**: Adicione novas features independentemente
4. **Optimize**: Use performance patterns do Riverpod
5. **Test Everything**: Mantenha coverage alto

Esta arquitetura cresce com seu projeto! 🚀