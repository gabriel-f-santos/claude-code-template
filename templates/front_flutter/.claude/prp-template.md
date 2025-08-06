# 📋 Flutter + Riverpod PRP Template

## Meta Information
- **Feature Name**: `{FEATURE_NAME}`
- **Priority**: `{PRIORITY}`
- **Estimated Time**: `{DURATION}`
- **Architecture**: Flutter + Clean Architecture + Riverpod + Command Pattern + Result Pattern

## Purpose
{FEATURE_DESCRIPTION}

## Core Principles
1. **Clean Architecture**: Clear separation between presentation, domain, and data layers
2. **Command/Query Pattern**: Reactive operations with state tracking
3. **Result Pattern**: Functional error handling without exceptions
4. **UseCase Pattern**: Business logic isolation and reusability
5. **Feature-First**: Self-contained, scalable feature modules
6. **Riverpod + Freezed**: Modern state management with code generation

---

## Goal
{DETAILED_GOAL}

## Why
{BUSINESS_JUSTIFICATION}

## What
{SPECIFIC_DELIVERABLES}

### Success Criteria
- [ ] Feature working on all platforms (iOS, Android, Web)
- [ ] Responsive design adapting to different screen sizes
- [ ] >90% test coverage (unit, widget, integration)
- [ ] Accessibility compliance with screen readers
- [ ] Smooth 60fps animations and transitions
- [ ] No memory leaks or performance issues

## All Needed Context

### Documentation & References
```yaml
# MUST READ - Include these in your context window
- file: CLAUDE.md
  why: Flutter + Riverpod architecture patterns and conventions
  
- file: MULTI_AGENT_PLAN.md  
  why: Current development plan and coordination
```

### Visual References
```yaml
# DESIGN REFERENCES - Visual mockups and UI specifications
- directory: PRPs/{FEATURE_NAME}/images/
  contents:
    # Mobile Designs (Primary)
    - mobile/{feature}-main-screen.png    # Main feature screen layout
    - mobile/{feature}-list-view.png      # List/grid view designs
    - mobile/{feature}-detail-screen.png  # Detail page layout
    - mobile/{feature}-forms.png          # Form layouts and validation
    
    # Tablet Responsive Designs
    - tablet/{feature}-tablet-layout.png  # Tablet-optimized layout
    - tablet/{feature}-landscape.png      # Landscape orientation
    
    # Component Specifications
    - components/widgets.png              # Custom widget designs
    - components/buttons.png              # Button variations and states
    - components/cards.png                # Card component designs
    - components/loading-states.png       # Loading indicators and shimmer
    - components/error-states.png         # Error messages and empty states
    
    # User Flow Diagrams
    - flows/{feature}-user-journey.png    # Complete user interaction flow
    - flows/{feature}-navigation.png      # Navigation patterns
    - flows/{feature}-state-machine.png   # State transitions
    
  why: Visual guidance for implementing pixel-perfect, responsive Flutter UI
  note: |
    FrontendEngineer MUST read these images to understand:
    - Exact widget layouts and Material Design implementation
    - Responsive behavior across device sizes
    - Custom widget specifications and animations
    - Navigation patterns and user interaction flows
```

### Current Project Structure
```bash
# Flutter Clean Architecture + Feature-First
lib/
├── core/                              # Core app functionality
│   ├── constants/
│   │   ├── app_colors.dart           # Material Design 3 color scheme
│   │   ├── app_text_styles.dart      # Typography system
│   │   └── app_constants.dart        # App-wide constants
│   ├── theme/
│   │   ├── app_theme.dart            # Material 3 theme configuration
│   │   └── theme_extensions.dart     # Custom theme extensions
│   ├── widgets/                      # Shared widgets
│   │   ├── app_bar_widget.dart
│   │   ├── loading_widget.dart
│   │   └── error_widget.dart
│   ├── types/                        # Shared types and patterns
│   │   ├── result.dart               # Result<T> pattern
│   │   ├── command.dart              # Command pattern base
│   │   ├── use_case.dart             # UseCase base class
│   │   └── exceptions.dart           # Custom exceptions
│   └── utils/
│       ├── extensions.dart           # Dart extensions
│       ├── validators.dart           # Form validation utilities
│       └── formatters.dart           # Text formatters
├── shared/                           # Shared across features
│   ├── data/                         # Shared data layer
│   │   ├── providers/                # @riverpod providers
│   │   ├── repositories/             # API clients, storage
│   │   ├── models/                   # DTOs compartilhados
│   │   └── services/                 # HTTP client, storage services
│   └── domain/                       # Shared domain layer
│       ├── models/                   # Base entities
│       └── repositories/             # Repository interfaces
├── features/                         # Feature-first organization
│   └── {feature_name}/              # Feature module (Clean Architecture)
│       ├── data/                     # Data Layer
│       │   ├── models/               # API DTOs (Freezed + JsonAnnotation)
│       │   │   └── {entity}_model.dart
│       │   ├── providers/            # @riverpod data providers
│       │   │   └── {entity}_api_provider.dart
│       │   ├── repositories/         # Repository implementations
│       │   │   └── {entity}_repository_impl.dart
│       │   └── services/             # API services específicos
│       │       └── {entity}_service.dart
│       ├── domain/                   # Domain Layer
│       │   ├── models/               # Domain entities (Freezed)
│       │   │   └── {entity}.dart
│       │   ├── repositories/         # Repository interfaces
│       │   │   └── {entity}_repository.dart
│       │   └── use_cases/            # Business logic + validation
│       │       ├── get_{entity}_use_case.dart
│       │       ├── create_{entity}_use_case.dart
│       │       └── delete_{entity}_use_case.dart
│       └── presentation/             # Presentation Layer
│           ├── commands/             # Command objects para actions
│           │   ├── create_{entity}_command.dart
│           │   ├── update_{entity}_command.dart
│           │   └── delete_{entity}_command.dart
│           ├── providers/            # @riverpod ViewModels (AsyncNotifiers)
│           │   ├── {entity}_query.dart      # Query provider
│           │   └── {entity}_commands.dart   # Commands provider
│           ├── screens/              # Screen widgets
│           │   ├── {entity}_list_screen.dart
│           │   ├── {entity}_detail_screen.dart
│           │   └── {entity}_form_screen.dart
│           └── widgets/              # Feature-specific widgets
│               ├── {entity}_card.dart
│               ├── {entity}_list_tile.dart
│               └── {entity}_form.dart
├── main.dart                        # App entry point
└── app.dart                         # App widget with providers
```

### Technology Stack Context
```yaml
# Flutter Clean Architecture Stack
Framework: Flutter 3.16+ (stable channel)
Language: Dart 3.2+
Architecture: Clean Architecture + Feature-First
State Management: Riverpod 2.4+ (flutter_riverpod) with code generation
Code Generation: Freezed + json_annotation + riverpod_generator
HTTP Client: Dio 5.3+ with interceptors and Result pattern
Error Handling: Result<T> pattern (functional programming)
Business Logic: UseCase pattern with dependency injection
Local Storage: SharedPreferences + Hive (if needed)
Navigation: Go Router 12.0+ (declarative routing)
Testing: Flutter Test + Mockito + Integration Test
UI Components: Material 3 design system
Icons: Material Icons + custom icon fonts
Animation: Built-in Flutter animations + Rive (if needed)
Platform: iOS, Android, Web support
```

## Implementation Blueprint

### Core Types (Result & Command)
```dart
// core/types/result.dart
import 'package:freezed_annotation/freezed_annotation.dart';

part 'result.freezed.dart';

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
  Result<U> map<U>(U Function(T) mapper) {
    return switch (this) {
      Ok(:final value) => Result.ok(mapper(value)),
      Error(:final error, :final stackTrace) => Result.error(error, stackTrace),
    };
  }
  
  Future<Result<U>> flatMap<U>(Future<Result<U>> Function(T) mapper) async {
    return switch (this) {
      Ok(:final value) => await mapper(value),
      Error(:final error, :final stackTrace) => Result.error(error, stackTrace),
    };
  }
  
  T getOrElse(T Function(Exception) fallback) {
    return switch (this) {
      Ok(:final value) => value,
      Error(:final error) => fallback(error),
    };
  }
}

// core/types/command.dart
@freezed
sealed class CommandState<T> with _$CommandState<T> {
  const factory CommandState.idle() = _Idle<T>;
  const factory CommandState.running() = _Running<T>;
  const factory CommandState.completed(T data) = _Completed<T>;
  const factory CommandState.error(Exception error, [StackTrace? stackTrace]) = _Error<T>;
  
  bool get isRunning => this is _Running<T>;
  bool get isCompleted => this is _Completed<T>;
  bool get hasError => this is _Error<T>;
  T? get data => switch (this) {
    _Completed(:final data) => data,
    _ => null,
  };
}
```

### Domain Entity (Clean Architecture)
```dart
// features/{feature}/domain/models/{entity}.dart
import 'package:freezed_annotation/freezed_annotation.dart';

part '{entity}.freezed.dart';

@freezed
class {Entity} with _${Entity} {
  const factory {Entity}({
    required String id,
    required String name,
    String? description,
    @Default(true) bool isActive,
    required DateTime createdAt,
    DateTime? updatedAt,
  }) = _{Entity};
  
  // Business methods can be added here
  const {Entity}._();
  
  bool get canBeEdited => isActive && DateTime.now().difference(createdAt).inDays < 30;
  String get displayName => name.trim().isEmpty ? 'Unnamed {Entity}' : name;
}

@freezed
class {Entity}Params with _${Entity}Params {
  const factory {Entity}Params({
    required String name,
    String? description,
    @Default(true) bool isActive,
  }) = _{Entity}Params;
}
```

### Data Model (API DTO)
```dart
// features/{feature}/data/models/{entity}_model.dart
import 'package:freezed_annotation/freezed_annotation.dart';
import '../../domain/models/{entity}.dart';

part '{entity}_model.freezed.dart';
part '{entity}_model.g.dart';

@freezed
class {Entity}Model with _${Entity}Model {
  const factory {Entity}Model({
    required String id,
    required String name,
    String? description,
    @JsonKey(name: 'is_active') @Default(true) bool isActive,
    @JsonKey(name: 'created_at') required DateTime createdAt,
    @JsonKey(name: 'updated_at') DateTime? updatedAt,
  }) = _{Entity}Model;

  factory {Entity}Model.fromJson(Map<String, dynamic> json) =>
      _${Entity}ModelFromJson(json);
      
  const {Entity}Model._();
  
  // Convert to domain entity
  {Entity} toDomain() => {Entity}(
    id: id,
    name: name,
    description: description,
    isActive: isActive,
    createdAt: createdAt,
    updatedAt: updatedAt,
  );
  
  // Create from domain entity
  factory {Entity}Model.fromDomain({Entity} entity) => {Entity}Model(
    id: entity.id,
    name: entity.name,
    description: entity.description,
    isActive: entity.isActive,
    createdAt: entity.createdAt,
    updatedAt: entity.updatedAt,
  );
}

@freezed
class Create{Entity}Request with _$Create{Entity}Request {
  const factory Create{Entity}Request({
    required String name,
    String? description,
    @JsonKey(name: 'is_active') @Default(true) bool isActive,
  }) = _Create{Entity}Request;

  factory Create{Entity}Request.fromJson(Map<String, dynamic> json) =>
      _$Create{Entity}RequestFromJson(json);
      
  factory Create{Entity}Request.fromParams({Entity}Params params) =>
      Create{Entity}Request(
        name: params.name,
        description: params.description,
        isActive: params.isActive,
      );
}
```

### Repository Interface & Implementation
```dart
// features/{feature}/domain/repositories/{entity}_repository.dart
import '../../../core/types/result.dart';
import '../models/{entity}.dart';

abstract class {Entity}Repository {
  Future<Result<List<{Entity}>>> getAll();
  Future<Result<{Entity}>> getById(String id);
  Future<Result<{Entity}>> create({Entity}Params params);
  Future<Result<{Entity}>> update(String id, {Entity}Params params);
  Future<Result<void>> delete(String id);
}

// features/{feature}/data/repositories/{entity}_repository_impl.dart
import 'package:riverpod_annotation/riverpod_annotation.dart';
import '../../../core/types/result.dart';
import '../../domain/models/{entity}.dart';
import '../../domain/repositories/{entity}_repository.dart';
import '../services/{entity}_service.dart';

part '{entity}_repository_impl.g.dart';

class {Entity}RepositoryImpl implements {Entity}Repository {
  final {Entity}Service _service;

  {Entity}RepositoryImpl(this._service);

  @override
  Future<Result<List<{Entity}>>> getAll() async {
    try {
      final models = await _service.getAll();
      final entities = models.map((model) => model.toDomain()).toList();
      return Result.ok(entities);
    } catch (e) {
      return Result.error(Exception('Failed to fetch {entities}: $e'));
    }
  }

  @override
  Future<Result<{Entity}>> getById(String id) async {
    try {
      final model = await _service.getById(id);
      return Result.ok(model.toDomain());
    } catch (e) {
      return Result.error(Exception('Failed to fetch {entity}: $e'));
    }
  }

  @override
  Future<Result<{Entity}>> create({Entity}Params params) async {
    try {
      final request = Create{Entity}Request.fromParams(params);
      final model = await _service.create(request);
      return Result.ok(model.toDomain());
    } catch (e) {
      return Result.error(Exception('Failed to create {entity}: $e'));
    }
  }

  @override
  Future<Result<{Entity}>> update(String id, {Entity}Params params) async {
    try {
      final request = Create{Entity}Request.fromParams(params);
      final model = await _service.update(id, request);
      return Result.ok(model.toDomain());
    } catch (e) {
      return Result.error(Exception('Failed to update {entity}: $e'));
    }
  }

  @override
  Future<Result<void>> delete(String id) async {
    try {
      await _service.delete(id);
      return const Result.ok(null);
    } catch (e) {
      return Result.error(Exception('Failed to delete {entity}: $e'));
    }
  }
}

@riverpod
{Entity}Repository {entity}Repository({Entity}RepositoryRef ref) {
  final service = ref.read({entity}ServiceProvider);
  return {Entity}RepositoryImpl(service);
}
```

### UseCase Pattern (Business Logic)
```dart
// core/types/use_case.dart
import 'result.dart';

abstract class UseCase<TResult, TParams> {
  Future<Result<TResult>> execute(TParams params);
}

abstract class NoParams {
  const NoParams();
}

const noParams = NoParams();

// features/{feature}/domain/use_cases/get_{entities}_use_case.dart
import 'package:riverpod_annotation/riverpod_annotation.dart';
import '../../../core/types/use_case.dart';
import '../../../core/types/result.dart';
import '../models/{entity}.dart';
import '../repositories/{entity}_repository.dart';
import '../../data/repositories/{entity}_repository_impl.dart';

part 'get_{entities}_use_case.g.dart';

class Get{Entities}UseCase extends UseCase<List<{Entity}>, NoParams> {
  final {Entity}Repository _repository;
  
  Get{Entities}UseCase(this._repository);

  @override
  Future<Result<List<{Entity}>>> execute(NoParams params) async {
    try {
      final result = await _repository.getAll();
      
      return result.map((entities) {
        // Business logic: filter only active entities
        final activeEntities = entities.where((e) => e.isActive).toList();
        
        // Business logic: sort by creation date
        activeEntities.sort((a, b) => b.createdAt.compareTo(a.createdAt));
        
        return activeEntities;
      });
    } catch (e) {
      return Result.error(Exception('Failed to get {entities}: $e'));
    }
  }
}

@riverpod
Get{Entities}UseCase get{Entities}UseCase(Get{Entities}UseCaseRef ref) {
  final repository = ref.read({entity}RepositoryProvider);
  return Get{Entities}UseCase(repository);
}

// features/{feature}/domain/use_cases/create_{entity}_use_case.dart
class Create{Entity}UseCase extends UseCase<{Entity}, {Entity}Params> {
  final {Entity}Repository _repository;
  
  Create{Entity}UseCase(this._repository);

  @override
  Future<Result<{Entity}>> execute({Entity}Params params) async {
    // Business validations
    if (params.name.trim().isEmpty) {
      return Result.error(Exception('{Entity} name cannot be empty'));
    }
    
    if (params.name.length < 2) {
      return Result.error(Exception('{Entity} name must be at least 2 characters'));
    }
    
    if (params.name.length > 100) {
      return Result.error(Exception('{Entity} name cannot exceed 100 characters'));
    }
    
    // Create entity
    return await _repository.create(params);
  }
}

@riverpod
Create{Entity}UseCase create{Entity}UseCase(Create{Entity}UseCaseRef ref) {
  final repository = ref.read({entity}RepositoryProvider);
  return Create{Entity}UseCase(repository);
}
```

### Command & Query Providers (Presentation)
```dart
// features/{feature}/presentation/providers/{entity}_query.dart
import 'package:riverpod_annotation/riverpod_annotation.dart';
import '../../../core/types/result.dart';
import '../../../core/types/use_case.dart';
import '../../domain/models/{entity}.dart';
import '../../domain/use_cases/get_{entities}_use_case.dart';

part '{entity}_query.g.dart';

@riverpod
class {Entity}Query extends _${Entity}Query {
  @override
  Future<Result<List<{Entity}>>> build() async {
    final useCase = ref.read(get{Entities}UseCaseProvider);
    return await useCase.execute(noParams);
  }
  
  Future<void> refresh() async {
    ref.invalidateSelf();
  }
}

// features/{feature}/presentation/commands/create_{entity}_command.dart
import 'package:riverpod_annotation/riverpod_annotation.dart';
import '../../../core/types/command.dart';
import '../../../core/types/result.dart';
import '../../domain/models/{entity}.dart';
import '../../domain/use_cases/create_{entity}_use_case.dart';
import '../providers/{entity}_query.dart';

part 'create_{entity}_command.g.dart';

@riverpod
class Create{Entity}Command extends _$Create{Entity}Command {
  @override
  CommandState<{Entity}> build() => const CommandState.idle();
  
  Future<void> execute({Entity}Params params) async {
    if (state.isRunning) return;
    
    state = const CommandState.running();
    
    final useCase = ref.read(create{Entity}UseCaseProvider);
    final result = await useCase.execute(params);
    
    switch (result) {
      case Ok(:final value):
        state = CommandState.completed(value);
        // Invalidate query to refresh the list
        ref.invalidate({entity}QueryProvider);
        
      case Error(:final error, :final stackTrace):
        state = CommandState.error(error, stackTrace);
    }
  }
  
  void reset() => state = const CommandState.idle();
}

// features/{feature}/presentation/commands/update_{entity}_command.dart
@riverpod
class Update{Entity}Command extends _$Update{Entity}Command {
  @override
  CommandState<{Entity}> build() => const CommandState.idle();
  
  Future<void> execute(String id, {Entity}Params params) async {
    if (state.isRunning) return;
    
    state = const CommandState.running();
    
    final useCase = ref.read(update{Entity}UseCaseProvider);
    final result = await useCase.execute(Update{Entity}UseCaseParams(id: id, params: params));
    
    switch (result) {
      case Ok(:final value):
        state = CommandState.completed(value);
        ref.invalidate({entity}QueryProvider);
        
      case Error(:final error, :final stackTrace):
        state = CommandState.error(error, stackTrace);
    }
  }
  
  void reset() => state = const CommandState.idle();
}

// features/{feature}/presentation/commands/delete_{entity}_command.dart
@riverpod
class Delete{Entity}Command extends _$Delete{Entity}Command {
  @override
  CommandState<void> build() => const CommandState.idle();
  
  Future<void> execute(String id) async {
    if (state.isRunning) return;
    
    state = const CommandState.running();
    
    final useCase = ref.read(delete{Entity}UseCaseProvider);
    final result = await useCase.execute(Delete{Entity}UseCaseParams(id: id));
    
    switch (result) {
      case Ok():
        state = const CommandState.completed(null);
        ref.invalidate({entity}QueryProvider);
        
      case Error(:final error, :final stackTrace):
        state = CommandState.error(error, stackTrace);
    }
  }
  
  void reset() => state = const CommandState.idle();
}
```

### Screen with Command/Query Pattern
```dart
// features/{feature}/presentation/screens/{entity}_list_screen.dart
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../core/types/result.dart';
import '../providers/{entity}_query.dart';
import '../commands/create_{entity}_command.dart';
import '../commands/delete_{entity}_command.dart';
import '../widgets/{entity}_card.dart';
import '../widgets/{entity}_form.dart';
import '../../../../core/widgets/loading_widget.dart';
import '../../../../core/widgets/error_widget.dart';

class {Entity}ListScreen extends ConsumerWidget {
  const {Entity}ListScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final queryState = ref.watch({entity}QueryProvider);
    final createCommand = ref.watch(create{Entity}CommandProvider);
    final deleteCommand = ref.watch(delete{Entity}CommandProvider);
    
    // Listen to command completions for feedback
    ref.listen(create{Entity}CommandProvider, (previous, next) {
      if (next.isCompleted) {
        _showSnackBar(context, '{Entity} created successfully');
        ref.read(create{Entity}CommandProvider.notifier).reset();
      } else if (next.hasError) {
        _showErrorSnackBar(context, next.errorOrNull?.toString() ?? 'Failed to create {entity}');
      }
    });
    
    ref.listen(delete{Entity}CommandProvider, (previous, next) {
      if (next.isCompleted) {
        _showSnackBar(context, '{Entity} deleted successfully');
        ref.read(delete{Entity}CommandProvider.notifier).reset();
      } else if (next.hasError) {
        _showErrorSnackBar(context, next.errorOrNull?.toString() ?? 'Failed to delete {entity}');
      }
    });
    
    return Scaffold(
      appBar: AppBar(
        title: const Text('{Entities}'),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: () => ref.read({entity}QueryProvider.notifier).refresh(),
          ),
        ],
      ),
      body: queryState.when(
        loading: () => const LoadingWidget(),
        error: (error, stack) => ErrorWidget(
          message: error.toString(),
          onRetry: () => ref.read({entity}QueryProvider.notifier).refresh(),
        ),
        data: (result) => _buildContent(context, ref, result),
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: createCommand.isRunning 
          ? null 
          : () => _showCreate{Entity}Dialog(context, ref),
        icon: createCommand.isRunning 
          ? const SizedBox(
              width: 20, 
              height: 20, 
              child: CircularProgressIndicator(strokeWidth: 2)
            )
          : const Icon(Icons.add),
        label: Text(createCommand.isRunning ? 'Creating...' : 'Add {Entity}'),
      ),
    );
  }

  Widget _buildContent(BuildContext context, WidgetRef ref, Result<List<{Entity}>> result) {
    return switch (result) {
      Ok(:final value) when value.isEmpty => const _EmptyState(),
      Ok(:final value) => RefreshIndicator(
          onRefresh: () async => ref.read({entity}QueryProvider.notifier).refresh(),
          child: _build{Entity}List(context, ref, value),
        ),
      Error(:final error) => ErrorWidget(
          message: error.toString(),
          onRetry: () => ref.read({entity}QueryProvider.notifier).refresh(),
        ),
    };
  }

  Widget _build{Entity}List(BuildContext context, WidgetRef ref, List<{Entity}> {entities}) {
    return ListView.separated(
      padding: const EdgeInsets.all(16.0),
      itemCount: {entities}.length,
      separatorBuilder: (context, index) => const SizedBox(height: 12),
      itemBuilder: (context, index) {
        final {entity} = {entities}[index];
        return {Entity}Card(
          {entity}: {entity},
          onTap: () => _navigateTo{Entity}Detail(context, {entity}),
          onEdit: () => _showEdit{Entity}Dialog(context, ref, {entity}),
          onDelete: () => _showDelete{Entity}Dialog(context, ref, {entity}),
        );
      },
    );
  }

  void _navigateTo{Entity}Detail(BuildContext context, {Entity} {entity}) {
    context.push('/{entities}/${{entity}.id}');
  }

  void _showCreate{Entity}Dialog(BuildContext context, WidgetRef ref) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      useSafeArea: true,
      builder: (context) => DraggableScrollableSheet(
        expand: false,
        builder: (context, scrollController) => {Entity}Form(
          scrollController: scrollController,
          onSubmit: (params) async {
            await ref.read(create{Entity}CommandProvider.notifier).execute(params);
            if (context.mounted) Navigator.of(context).pop();
          },
        ),
      ),
    );
  }

  void _showEdit{Entity}Dialog(BuildContext context, WidgetRef ref, {Entity} {entity}) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      useSafeArea: true,
      builder: (context) => DraggableScrollableSheet(
        expand: false,
        builder: (context, scrollController) => {Entity}Form(
          scrollController: scrollController,
          initial{Entity}: {entity},
          onSubmit: (params) async {
            await ref.read(update{Entity}CommandProvider.notifier).execute({entity}.id, params);
            if (context.mounted) Navigator.of(context).pop();
          },
        ),
      ),
    );
  }

  void _showDelete{Entity}Dialog(BuildContext context, WidgetRef ref, {Entity} {entity}) {
    final deleteCommand = ref.read(delete{Entity}CommandProvider);
    
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Delete {Entity}'),
        content: Text('Are you sure you want to delete "${{entity}.displayName}"?'),
        actions: [
          TextButton(
            onPressed: deleteCommand.isRunning ? null : () => Navigator.of(context).pop(),
            child: const Text('Cancel'),
          ),
          FilledButton(
            onPressed: deleteCommand.isRunning 
              ? null 
              : () async {
                  await ref.read(delete{Entity}CommandProvider.notifier).execute({entity}.id);
                  if (context.mounted) Navigator.of(context).pop();
                },
            child: deleteCommand.isRunning 
              ? const SizedBox(
                  width: 16, 
                  height: 16, 
                  child: CircularProgressIndicator(strokeWidth: 2)
                )
              : const Text('Delete'),
          ),
        ],
      ),
    );
  }
  
  void _showSnackBar(BuildContext context, String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: Colors.green,
      ),
    );
  }
  
  void _showErrorSnackBar(BuildContext context, String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: Colors.red,
      ),
    );
  }
}

class _EmptyState extends StatelessWidget {
  const _EmptyState();

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.inbox_outlined,
            size: 72,
            color: Theme.of(context).colorScheme.outline,
          ),
          const SizedBox(height: 16),
          Text(
            'No {entities} yet',
            style: Theme.of(context).textTheme.headlineSmall?.copyWith(
              color: Theme.of(context).colorScheme.outline,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            'Create your first {entity} to get started',
            style: Theme.of(context).textTheme.bodyMedium?.copyWith(
              color: Theme.of(context).colorScheme.outline,
            ),
          ),
        ],
      ),
    );
  }
}
```

### Custom Widget Component
```dart
// features/{feature}/presentation/widgets/{entity}_card.dart
import 'package:flutter/material.dart';
import '../../data/models/{entity}.dart';

class {Entity}Card extends StatelessWidget {
  final {Entity} {entity};
  final VoidCallback? onTap;
  final VoidCallback? onEdit;
  final VoidCallback? onDelete;

  const {Entity}Card({
    super.key,
    required this.{entity},
    this.onTap,
    this.onEdit,
    this.onDelete,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;
    
    return Card(
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
        side: BorderSide(color: colorScheme.outline.withOpacity(0.2)),
      ),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          {entity}.name,
                          style: theme.textTheme.titleMedium?.copyWith(
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                        if ({entity}.description != null) ...[
                          const SizedBox(height: 4),
                          Text(
                            {entity}.description!,
                            style: theme.textTheme.bodyMedium?.copyWith(
                              color: colorScheme.onSurfaceVariant,
                            ),
                            maxLines: 2,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ],
                      ],
                    ),
                  ),
                  const SizedBox(width: 8),
                  PopupMenuButton<String>(
                    icon: Icon(
                      Icons.more_vert,
                      color: colorScheme.onSurfaceVariant,
                    ),
                    onSelected: (value) {
                      switch (value) {
                        case 'edit':
                          onEdit?.call();
                          break;
                        case 'delete':
                          onDelete?.call();
                          break;
                      }
                    },
                    itemBuilder: (context) => [
                      const PopupMenuItem(
                        value: 'edit',
                        child: Row(
                          children: [
                            Icon(Icons.edit_outlined),
                            SizedBox(width: 12),
                            Text('Edit'),
                          ],
                        ),
                      ),
                      const PopupMenuItem(
                        value: 'delete',
                        child: Row(
                          children: [
                            Icon(Icons.delete_outline, color: Colors.red),
                            SizedBox(width: 12),
                            Text('Delete', style: TextStyle(color: Colors.red)),
                          ],
                        ),
                      ),
                    ],
                  ),
                ],
              ),
              const SizedBox(height: 12),
              Row(
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: {entity}.isActive 
                        ? colorScheme.primaryContainer 
                        : colorScheme.surfaceVariant,
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Text(
                      {entity}.isActive ? 'Active' : 'Inactive',
                      style: theme.textTheme.labelSmall?.copyWith(
                        color: {entity}.isActive 
                          ? colorScheme.onPrimaryContainer 
                          : colorScheme.onSurfaceVariant,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ),
                  const Spacer(),
                  Text(
                    'Created ${{entity}.createdAt.day}/${{entity}.createdAt.month}/${{entity}.createdAt.year}',
                    style: theme.textTheme.bodySmall?.copyWith(
                      color: colorScheme.onSurfaceVariant,
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
```

### Form Widget with Validation
```dart
// features/{feature}/presentation/widgets/{entity}_form.dart
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../data/models/{entity}.dart';
import '../providers/{entity}_state_provider.dart';

class {Entity}Form extends ConsumerStatefulWidget {
  final ScrollController? scrollController;
  final {Entity}? initial{Entity};
  final Function({Entity}Create) onSubmit;

  const {Entity}Form({
    super.key,
    this.scrollController,
    this.initial{Entity},
    required this.onSubmit,
  });

  @override
  ConsumerState<{Entity}Form> createState() => _{Entity}FormState();
}

class _{Entity}FormState extends ConsumerState<{Entity}Form> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _descriptionController = TextEditingController();
  bool _isActive = true;
  
  bool get _isEditing => widget.initial{Entity} != null;

  @override
  void initState() {
    super.initState();
    _initializeForm();
  }

  void _initializeForm() {
    final initial = widget.initial{Entity};
    if (initial != null) {
      _nameController.text = initial.name;
      _descriptionController.text = initial.description ?? '';
      _isActive = initial.isActive;
    }
  }

  @override
  void dispose() {
    _nameController.dispose();
    _descriptionController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final {entity}State = ref.watch({entity}NotifierProvider);
    final isSubmitting = _isEditing ? {entity}State.isUpdating : {entity}State.isCreating;

    return Container(
      padding: EdgeInsets.only(
        left: 16,
        right: 16,
        top: 16,
        bottom: MediaQuery.of(context).viewInsets.bottom + 16,
      ),
      child: Form(
        key: _formKey,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Handle bar
            Center(
              child: Container(
                width: 40,
                height: 4,
                decoration: BoxDecoration(
                  color: theme.colorScheme.outline.withOpacity(0.4),
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
            ),
            const SizedBox(height: 16),
            
            // Title
            Text(
              _isEditing ? 'Edit {Entity}' : 'Create New {Entity}',
              style: theme.textTheme.headlineSmall?.copyWith(
                fontWeight: FontWeight.w600,
              ),
            ),
            const SizedBox(height: 24),
            
            // Name field
            TextFormField(
              controller: _nameController,
              decoration: const InputDecoration(
                labelText: 'Name',
                hintText: 'Enter {entity} name',
                border: OutlineInputBorder(),
              ),
              textInputAction: TextInputAction.next,
              validator: (value) {
                if (value?.trim().isEmpty ?? true) {
                  return 'Name is required';
                }
                if (value!.trim().length < 2) {
                  return 'Name must be at least 2 characters';
                }
                if (value.trim().length > 100) {
                  return 'Name must not exceed 100 characters';
                }
                return null;
              },
            ),
            const SizedBox(height: 16),
            
            // Description field
            TextFormField(
              controller: _descriptionController,
              decoration: const InputDecoration(
                labelText: 'Description (Optional)',
                hintText: 'Enter description',
                border: OutlineInputBorder(),
              ),
              maxLines: 3,
              textInputAction: TextInputAction.newline,
              validator: (value) {
                if (value != null && value.trim().length > 500) {
                  return 'Description must not exceed 500 characters';
                }
                return null;
              },
            ),
            const SizedBox(height: 16),
            
            // Active status switch
            SwitchListTile.adaptive(
              title: const Text('Active Status'),
              subtitle: Text(_isActive ? 'This {entity} is active' : 'This {entity} is inactive'),
              value: _isActive,
              onChanged: (value) => setState(() => _isActive = value),
              contentPadding: EdgeInsets.zero,
            ),
            const SizedBox(height: 24),
            
            // Error message
            if ({entity}State.error != null) ...[
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: theme.colorScheme.errorContainer,
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Row(
                  children: [
                    Icon(
                      Icons.error_outline,
                      color: theme.colorScheme.onErrorContainer,
                      size: 20,
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        {entity}State.error!,
                        style: TextStyle(color: theme.colorScheme.onErrorContainer),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 16),
            ],
            
            // Action buttons
            Row(
              children: [
                Expanded(
                  child: OutlinedButton(
                    onPressed: isSubmitting ? null : () => Navigator.of(context).pop(),
                    child: const Text('Cancel'),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: FilledButton(
                    onPressed: isSubmitting ? null : _handleSubmit,
                    child: isSubmitting
                      ? const SizedBox(
                          height: 20,
                          width: 20,
                          child: CircularProgressIndicator(strokeWidth: 2),
                        )
                      : Text(_isEditing ? 'Update' : 'Create'),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
          ],
        ),
      ),
    );
  }

  void _handleSubmit() {
    if (!_formKey.currentState!.validate()) return;
    
    final data = {Entity}Create(
      name: _nameController.text.trim(),
      description: _descriptionController.text.trim().isEmpty 
        ? null 
        : _descriptionController.text.trim(),
      isActive: _isActive,
    );
    
    widget.onSubmit(data);
  }
}
```

## Task Breakdown

### Phase 1: Models & Data Layer (FrontendEngineer)
- [ ] Create Freezed models with proper JSON serialization
- [ ] Implement repository pattern with proper error handling
- [ ] Set up API providers with Dio and interceptors
- [ ] **Quality Gate**: Models generated correctly, API integration working

### Phase 2: State Management (FrontendEngineer)
- [ ] Implement Riverpod providers with proper state management
- [ ] Create state notifiers for all business logic
- [ ] Add proper error handling and loading states
- [ ] **Quality Gate**: State management reactive, no memory leaks

### Phase 3: UI Implementation (FrontendEngineer)
- [ ] **CRITICAL**: Read all design images first from PRPs/{FEATURE_NAME}/images/
- [ ] Study mobile layouts, tablet responsive designs, component specs
- [ ] Create screens using Material Design 3 components exactly matching designs
- [ ] Implement custom widgets per component specifications
- [ ] Add proper responsive layout for different screen sizes
- [ ] Implement smooth animations and transitions
- [ ] **Quality Gate**: UI matches designs pixel-perfect, responsive across devices

### Phase 4: Forms & Validation (FrontendEngineer)
- [ ] Create form widgets with proper validation
- [ ] Implement user-friendly error messages
- [ ] Add accessibility support (screen readers, keyboard navigation)
- [ ] Test form submission and validation flows
- [ ] **Quality Gate**: Forms working smoothly, accessible

### Phase 5: Navigation & Routing (FrontendEngineer)
- [ ] Set up Go Router with proper navigation structure
- [ ] Implement deep linking and route parameters
- [ ] Add navigation animations and transitions
- [ ] Test navigation flows on all platforms
- [ ] **Quality Gate**: Navigation working seamlessly

### Phase 6: Testing & Quality (QAEngineer)
- [ ] Write unit tests for models and repositories
- [ ] Create widget tests for all custom widgets
- [ ] Add integration tests for complete user flows
- [ ] Test on different screen sizes and orientations
- [ ] Accessibility testing with screen readers
- [ ] **Quality Gate**: >90% test coverage, accessibility compliant

### Phase 7: Performance & Polish (IntegrationExpert)
- [ ] Optimize widget rebuilds and memory usage
- [ ] Test performance on different devices
- [ ] Ensure smooth 60fps animations
- [ ] Test on iOS, Android, and Web platforms
- [ ] **Quality Gate**: No performance issues, smooth animations

## Validation Commands

### Flutter Development
```bash
# Run the app in debug mode
flutter run

# Run on specific platform
flutter run -d chrome    # Web
flutter run -d ios       # iOS Simulator
flutter run -d android   # Android Emulator

# Hot reload during development
# Press 'r' in terminal or use IDE hot reload
```

### Code Generation
```bash
# Generate Freezed and JSON serialization code
flutter packages pub run build_runner build

# Watch mode for continuous generation
flutter packages pub run build_runner watch --delete-conflicting-outputs
```

### Testing
```bash
# Run all tests
flutter test

# Run with coverage
flutter test --coverage
genhtml coverage/lcov.info -o coverage/html

# Run integration tests
flutter drive --target=test_driver/app.dart
```

### Code Quality
```bash
# Analyze code for issues
flutter analyze

# Check formatting
dart format --set-exit-if-changed .

# Fix formatting
dart format .
```

### Build and Release
```bash
# Build APK (Android)
flutter build apk --release

# Build app bundle (Android)
flutter build appbundle --release

# Build iOS
flutter build ios --release

# Build web
flutter build web --release
```

## Quality Gates

### Model & Data Quality Gates
- [ ] All models properly defined with Freezed
- [ ] JSON serialization working correctly
- [ ] Repository pattern implemented with proper error handling
- [ ] API integration working with proper HTTP status handling

### State Management Quality Gates  
- [ ] Riverpod providers properly structured and scoped
- [ ] State updates reactive and efficient
- [ ] Error states handled gracefully
- [ ] Loading states implemented for all async operations
- [ ] No memory leaks in state management

### UI/UX Quality Gates
- [ ] All screens match design specifications exactly
- [ ] Responsive layout working on all screen sizes
- [ ] Material Design 3 components used consistently
- [ ] Animations smooth and purposeful
- [ ] Accessibility features implemented (semantic labels, etc.)
- [ ] Custom widgets reusable and well-documented

### Performance Quality Gates
- [ ] App launches in <3 seconds on average devices
- [ ] Smooth 60fps animations and scrolling
- [ ] Memory usage optimized (no memory leaks)
- [ ] Widget rebuilds minimized with proper use of const constructors
- [ ] Image loading optimized with proper caching

### Testing Quality Gates
- [ ] >90% test coverage for business logic
- [ ] All widgets have basic widget tests
- [ ] Integration tests cover main user flows
- [ ] Testing on different screen sizes and orientations
- [ ] Accessibility testing passed

### Platform Quality Gates
- [ ] Feature working identically on iOS and Android
- [ ] Web version functional (if applicable)
- [ ] Platform-specific UI guidelines followed
- [ ] Performance acceptable on low-end devices

## Anti-Patterns to Avoid
- ❌ Don't use setState in large widgets (use Riverpod instead)
- ❌ Don't ignore responsive design for different screen sizes
- ❌ Don't skip code generation for Freezed models
- ❌ Don't use hard-coded colors/sizes (use theme system)
- ❌ Don't skip accessibility features
- ❌ Don't create God widgets (keep widgets focused and small)
- ❌ Don't ignore platform-specific design guidelines
- ❌ Don't skip error handling in async operations

## Final Validation Checklist
- [ ] All screens implemented matching design specifications exactly
- [ ] Feature working on all target platforms (iOS, Android, Web)
- [ ] Responsive design working on all screen sizes
- [ ] >90% test coverage achieved
- [ ] Accessibility compliance verified
- [ ] Performance requirements met (smooth animations, fast loading)
- [ ] Code generation setup and working correctly
- [ ] Navigation and routing working seamlessly
- [ ] Ready for app store submission

---

## Notes
- Follow Flutter and Dart best practices consistently
- Use Feature-First architecture to keep code organized
- Leverage Riverpod for reactive state management
- Implement proper error boundaries and fallback UI
- Use Freezed for immutable data classes
- Follow Material Design 3 guidelines for consistent UI
- Test thoroughly on different devices and screen sizes