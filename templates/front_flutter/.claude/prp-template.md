# 📋 Flutter + Riverpod PRP Template

## Meta Information
- **Feature Name**: `{FEATURE_NAME}`
- **Priority**: `{PRIORITY}`
- **Estimated Time**: `{DURATION}`
- **Architecture**: Flutter + Riverpod + Feature-First + MVVM + Freezed

## Purpose
{FEATURE_DESCRIPTION}

## Core Principles
1. **Feature-First Architecture**: Self-contained feature modules
2. **Riverpod State Management**: Reactive, testable state management
3. **MVVM Pattern**: Clear separation of concerns
4. **Freezed Models**: Immutable data classes with code generation
5. **Material Design 3**: Modern, accessible UI components

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
# Flutter Feature-First project structure
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
│   └── utils/
│       ├── extensions.dart           # Dart extensions
│       ├── validators.dart           # Form validation utilities
│       └── formatters.dart           # Text formatters
├── features/                         # Feature-first organization
│   └── {feature_name}/              # Feature module
│       ├── data/
│       │   ├── models/              # Data models (Freezed)
│       │   │   └── {entity}.dart    # {Entity} data model
│       │   ├── providers/           # Data providers (APIs, local storage)
│       │   │   └── {entity}_provider.dart
│       │   └── repositories/        # Repository pattern
│       │       └── {entity}_repository.dart
│       ├── domain/
│       │   ├── models/              # Domain models (clean architecture)
│       │   │   └── {entity}.dart
│       │   └── usecases/            # Business logic
│       │       └── {entity}_usecases.dart
│       └── presentation/
│           ├── providers/           # Riverpod providers (state management)
│           │   ├── {entity}_provider.dart
│           │   └── {entity}_state_provider.dart
│           ├── screens/             # Screen widgets
│           │   ├── {entity}_list_screen.dart
│           │   ├── {entity}_detail_screen.dart
│           │   └── {entity}_form_screen.dart
│           └── widgets/             # Feature-specific widgets
│               ├── {entity}_card.dart
│               ├── {entity}_list_tile.dart
│               └── {entity}_form.dart
├── shared/                          # Shared across features
│   ├── providers/                   # Global providers
│   │   ├── auth_provider.dart
│   │   └── app_state_provider.dart
│   ├── widgets/                     # Shared UI components
│   └── utils/                       # Shared utilities
├── main.dart                        # App entry point
└── app.dart                         # App widget with providers
```

### Technology Stack Context
```yaml
# Flutter Stack Specifics
Framework: Flutter 3.16+ (stable channel)
Language: Dart 3.2+
State Management: Riverpod 2.4+ (flutter_riverpod)
Code Generation: Freezed + json_annotation
HTTP Client: Dio 5.3+ with interceptors
Local Storage: SharedPreferences + Hive (if needed)
Navigation: Go Router 12.0+ (declarative routing)
Testing: Flutter Test + Mockito + Integration Test
UI Components: Material 3 design system
Icons: Material Icons + custom icon fonts
Animation: Built-in Flutter animations + Rive (if needed)
Platform: iOS, Android, Web support
```

## Implementation Blueprint

### Domain Model (Freezed)
```dart
// features/{feature}/data/models/{entity}.dart
import 'package:freezed_annotation/freezed_annotation.dart';

part '{entity}.freezed.dart';
part '{entity}.g.dart';

@freezed
class {Entity} with _${Entity} {
  const factory {Entity}({
    required String id,
    required String name,
    String? description,
    @Default(true) bool isActive,
    @JsonKey(name: 'created_at') required DateTime createdAt,
    @JsonKey(name: 'updated_at') DateTime? updatedAt,
  }) = _{Entity};

  factory {Entity}.fromJson(Map<String, dynamic> json) =>
      _${Entity}FromJson(json);
}

@freezed
class {Entity}Create with _${Entity}Create {
  const factory {Entity}Create({
    required String name,
    String? description,
    @Default(true) bool isActive,
  }) = _{Entity}Create;

  factory {Entity}Create.fromJson(Map<String, dynamic> json) =>
      _${Entity}CreateFromJson(json);
}

@freezed
class {Entity}Update with _${Entity}Update {
  const factory {Entity}Update({
    String? name,
    String? description,
    bool? isActive,
  }) = _{Entity}Update;

  factory {Entity}Update.fromJson(Map<String, dynamic> json) =>
      _${Entity}UpdateFromJson(json);
}
```

### Repository (Data Layer)
```dart
// features/{feature}/data/repositories/{entity}_repository.dart
import 'package:riverpod_annotation/riverpod_annotation.dart';
import '../models/{entity}.dart';
import '../providers/{entity}_provider.dart';

part '{entity}_repository.g.dart';

abstract class {Entity}Repository {
  Future<List<{Entity}>> getAll();
  Future<{Entity}> getById(String id);
  Future<{Entity}> create({Entity}Create {entity}Data);
  Future<{Entity}> update(String id, {Entity}Update {entity}Data);
  Future<void> delete(String id);
}

class {Entity}RepositoryImpl implements {Entity}Repository {
  final {Entity}Provider _provider;

  {Entity}RepositoryImpl(this._provider);

  @override
  Future<List<{Entity}>> getAll() async {
    try {
      final response = await _provider.getAll();
      return response.map((json) => {Entity}.fromJson(json)).toList();
    } catch (e) {
      throw Exception('Failed to fetch {entities}: $e');
    }
  }

  @override
  Future<{Entity}> getById(String id) async {
    try {
      final response = await _provider.getById(id);
      return {Entity}.fromJson(response);
    } catch (e) {
      throw Exception('Failed to fetch {entity}: $e');
    }
  }

  @override
  Future<{Entity}> create({Entity}Create {entity}Data) async {
    try {
      final response = await _provider.create({entity}Data.toJson());
      return {Entity}.fromJson(response);
    } catch (e) {
      throw Exception('Failed to create {entity}: $e');
    }
  }

  @override
  Future<{Entity}> update(String id, {Entity}Update {entity}Data) async {
    try {
      final response = await _provider.update(id, {entity}Data.toJson());
      return {Entity}.fromJson(response);
    } catch (e) {
      throw Exception('Failed to update {entity}: $e');
    }
  }

  @override
  Future<void> delete(String id) async {
    try {
      await _provider.delete(id);
    } catch (e) {
      throw Exception('Failed to delete {entity}: $e');
    }
  }
}

@riverpod
{Entity}Repository {entity}Repository({Entity}RepositoryRef ref) {
  final provider = ref.read({entity}ProviderProvider);
  return {Entity}RepositoryImpl(provider);
}
```

### Riverpod State Provider
```dart
// features/{feature}/presentation/providers/{entity}_state_provider.dart
import 'package:riverpod_annotation/riverpod_annotation.dart';
import '../../data/models/{entity}.dart';
import '../../data/repositories/{entity}_repository.dart';

part '{entity}_state_provider.g.dart';

@freezed
class {Entity}State with _${Entity}State {
  const factory {Entity}State({
    @Default([]) List<{Entity}> {entities},
    @Default(false) bool isLoading,
    @Default(false) bool isCreating,
    @Default(false) bool isUpdating,
    @Default(false) bool isDeleting,
    String? error,
    {Entity}? selected{Entity},
  }) = _{Entity}State;
}

@riverpod
class {Entity}Notifier extends _${Entity}Notifier {
  @override
  {Entity}State build() {
    // Auto-load data on initialization
    _load{Entities}();
    return const {Entity}State();
  }

  Future<void> _load{Entities}() async {
    if (state.isLoading) return;

    state = state.copyWith(isLoading: true, error: null);
    
    try {
      final repository = ref.read({entity}RepositoryProvider);
      final {entities} = await repository.getAll();
      
      state = state.copyWith(
        {entities}: {entities},
        isLoading: false,
      );
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        error: e.toString(),
      );
    }
  }

  Future<void> refresh() async {
    await _load{Entities}();
  }

  Future<void> create{Entity}({Entity}Create {entity}Data) async {
    if (state.isCreating) return;

    state = state.copyWith(isCreating: true, error: null);
    
    try {
      final repository = ref.read({entity}RepositoryProvider);
      final new{Entity} = await repository.create({entity}Data);
      
      state = state.copyWith(
        {entities}: [...state.{entities}, new{Entity}],
        isCreating: false,
      );
    } catch (e) {
      state = state.copyWith(
        isCreating: false,
        error: e.toString(),
      );
      rethrow;
    }
  }

  Future<void> update{Entity}(String id, {Entity}Update {entity}Data) async {
    if (state.isUpdating) return;

    state = state.copyWith(isUpdating: true, error: null);
    
    try {
      final repository = ref.read({entity}RepositoryProvider);
      final updated{Entity} = await repository.update(id, {entity}Data);
      
      final updated{Entities} = state.{entities}.map((e) {
        return e.id == id ? updated{Entity} : e;
      }).toList();
      
      state = state.copyWith(
        {entities}: updated{Entities},
        isUpdating: false,
        selected{Entity}: state.selected{Entity}?.id == id ? updated{Entity} : state.selected{Entity},
      );
    } catch (e) {
      state = state.copyWith(
        isUpdating: false,
        error: e.toString(),
      );
      rethrow;
    }
  }

  Future<void> delete{Entity}(String id) async {
    if (state.isDeleting) return;

    state = state.copyWith(isDeleting: true, error: null);
    
    try {
      final repository = ref.read({entity}RepositoryProvider);
      await repository.delete(id);
      
      final filtered{Entities} = state.{entities}.where((e) => e.id != id).toList();
      
      state = state.copyWith(
        {entities}: filtered{Entities},
        isDeleting: false,
        selected{Entity}: state.selected{Entity}?.id == id ? null : state.selected{Entity},
      );
    } catch (e) {
      state = state.copyWith(
        isDeleting: false,
        error: e.toString(),
      );
      rethrow;
    }
  }

  void select{Entity}({Entity}? {entity}) {
    state = state.copyWith(selected{Entity}: {entity});
  }

  void clearError() {
    state = state.copyWith(error: null);
  }
}
```

### Main Screen Widget
```dart
// features/{feature}/presentation/screens/{entity}_list_screen.dart
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../providers/{entity}_state_provider.dart';
import '../widgets/{entity}_card.dart';
import '../widgets/{entity}_form.dart';
import '../../../../core/widgets/loading_widget.dart';
import '../../../../core/widgets/error_widget.dart';

class {Entity}ListScreen extends ConsumerWidget {
  const {Entity}ListScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final {entity}State = ref.watch({entity}NotifierProvider);
    
    return Scaffold(
      appBar: AppBar(
        title: const Text('{Entities}'),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: () => ref.read({entity}NotifierProvider.notifier).refresh(),
          ),
        ],
      ),
      body: _buildBody(context, ref, {entity}State),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => _showCreate{Entity}Dialog(context, ref),
        icon: const Icon(Icons.add),
        label: const Text('Add {Entity}'),
      ),
    );
  }

  Widget _buildBody(BuildContext context, WidgetRef ref, {Entity}State state) {
    if (state.isLoading && state.{entities}.isEmpty) {
      return const LoadingWidget();
    }

    if (state.error != null && state.{entities}.isEmpty) {
      return ErrorWidget(
        message: state.error!,
        onRetry: () => ref.read({entity}NotifierProvider.notifier).refresh(),
      );
    }

    if (state.{entities}.isEmpty) {
      return const _EmptyState();
    }

    return RefreshIndicator(
      onRefresh: () => ref.read({entity}NotifierProvider.notifier).refresh(),
      child: _build{Entity}List(context, ref, state),
    );
  }

  Widget _build{Entity}List(BuildContext context, WidgetRef ref, {Entity}State state) {
    return ListView.separated(
      padding: const EdgeInsets.all(16.0),
      itemCount: state.{entities}.length,
      separatorBuilder: (context, index) => const SizedBox(height: 12),
      itemBuilder: (context, index) {
        final {entity} = state.{entities}[index];
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
          onSubmit: (data) async {
            await ref.read({entity}NotifierProvider.notifier).create{Entity}(data);
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
          onSubmit: (data) async {
            await ref.read({entity}NotifierProvider.notifier).update{Entity}({entity}.id, data);
            if (context.mounted) Navigator.of(context).pop();
          },
        ),
      ),
    );
  }

  void _showDelete{Entity}Dialog(BuildContext context, WidgetRef ref, {Entity} {entity}) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Delete {Entity}'),
        content: Text('Are you sure you want to delete "${{entity}.name}"?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('Cancel'),
          ),
          FilledButton(
            onPressed: () async {
              await ref.read({entity}NotifierProvider.notifier).delete{Entity}({entity}.id);
              if (context.mounted) Navigator.of(context).pop();
            },
            child: const Text('Delete'),
          ),
        ],
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