# Flutter Official Architecture Template

## 🚀 Feature-First + Official MVVM + Riverpod

Baseado na **documentação oficial Flutter** (https://docs.flutter.dev/app-architecture) com **Riverpod** moderno e organização **Feature-First** para máxima escalabilidade.

## 🎯 Arquitetura: Official Flutter MVVM + Feature-First + Riverpod

### Princípios Fundamentais (Flutter Official)

1. **Separation of Concerns** - Princípio mais importante
2. **Unidirectional Data Flow** - Estado flui: Data → Logic → UI
3. **Single Source of Truth (SSOT)** - Um repositório por tipo de dado
4. **UI as a Function of State** - UI reflete o estado atual
5. **Layered Architecture** - Camadas bem definidas

### Estrutura Feature-First + Official Flutter

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
    │   ├── data/               # Data Layer da feature
    │   │   ├── models/         # API DTOs da auth
    │   │   ├── providers/      # @riverpod data providers
    │   │   ├── repositories/   # AuthRepository
    │   │   └── services/       # AuthService (API calls)
    │   ├── domain/             # Domain Layer da feature
    │   │   ├── models/         # Domain entities
    │   │   └── use_cases/      # Business logic (opcional)
    │   └── presentation/       # UI Layer da feature
    │       ├── providers/      # @riverpod ViewModels (Notifiers)
    │       ├── screens/        # Telas da feature
    │       └── widgets/        # Widgets específicos da feature
    ├── booking/                # Feature: Booking
    │   ├── data/
    │   ├── domain/
    │   └── presentation/
    └── profile/                # Feature: User Profile
        ├── data/
        ├── domain/
        └── presentation/
```

## 🏗️ Componentes com Riverpod + Code Generation

### 1. UI Layer - MVVM com Riverpod Notifiers

#### View (ConsumerWidget)
```dart
// features/booking/presentation/screens/booking_screen.dart
class BookingScreen extends ConsumerWidget {
  const BookingScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(bookingViewModelProvider);
    final viewModel = ref.read(bookingViewModelProvider.notifier);

    return Scaffold(
      appBar: AppBar(title: const Text('Bookings')),
      body: switch (state) {
        AsyncLoading() => const LoadingWidget(),
        AsyncError(:final error) => ErrorWidget(error.toString()),
        AsyncData(:final value) => BookingListView(
            bookings: value.bookings,
            onRefresh: viewModel.loadBookings,
          ),
      },
    );
  }
}
```

#### ViewModel State (Freezed)
```dart
// features/booking/presentation/providers/booking_view_model_state.dart
import 'package:freezed_annotation/freezed_annotation.dart';
import '../../domain/models/booking.dart';

part 'booking_view_model_state.freezed.dart';

@freezed
class BookingViewModelState with _$BookingViewModelState {
  const factory BookingViewModelState({
    required List<Booking> bookings,
    required bool isLoading,
    String? error,
  }) = _BookingViewModelState;

  factory BookingViewModelState.initial() => const BookingViewModelState(
    bookings: [],
    isLoading: false,
  );
}
```

#### ViewModel (Riverpod Notifier + Code Generation)
```dart
// features/booking/presentation/providers/booking_view_model.dart
import 'package:riverpod_annotation/riverpod_annotation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../data/providers/booking_repository_provider.dart';
import '../../domain/models/booking.dart';
import 'booking_view_model_state.dart';

part 'booking_view_model.g.dart';

@riverpod
class BookingViewModel extends _$BookingViewModel {
  @override
  FutureOr<BookingViewModelState> build() {
    return BookingViewModelState.initial();
  }

  Future<void> loadBookings() async {
    state = const AsyncLoading();
    
    state = await AsyncValue.guard(() async {
      final repository = ref.read(bookingRepositoryProvider);
      final bookings = await repository.getBookings();
      
      return BookingViewModelState(
        bookings: bookings,
        isLoading: false,
      );
    });
  }

  Future<void> createBooking(String title, DateTime date) async {
    final repository = ref.read(bookingRepositoryProvider);
    await repository.createBooking(title, date);
    
    // Reload bookings after creation
    loadBookings();
  }
}
```

### 2. Data Layer com Riverpod Providers

#### Repository Provider
```dart
// features/booking/data/providers/booking_repository_provider.dart
import 'package:riverpod_annotation/riverpod_annotation.dart';
import '../repositories/booking_repository.dart';
import '../../../shared/data/providers/api_client_provider.dart';

part 'booking_repository_provider.g.dart';

@riverpod
BookingRepository bookingRepository(BookingRepositoryRef ref) {
  final apiClient = ref.watch(apiClientProvider);
  return BookingRepository(apiClient);
}
```

#### Repository (SSOT com Result Pattern)
```dart
// features/booking/data/repositories/booking_repository.dart
import '../../../shared/data/models/result.dart';
import '../../domain/models/booking.dart';
import '../models/booking_dto.dart';
import '../../../shared/data/repositories/api_client.dart';

class BookingRepository {
  final ApiClient _apiClient;
  
  BookingRepository(this._apiClient);
  
  Future<Result<List<Booking>>> getBookings() async {
    try {
      final response = await _apiClient.get<List<dynamic>>('/bookings');
      
      return response.fold(
        onSuccess: (data) {
          final bookings = data
              .map((json) => BookingDto.fromJson(json as Map<String, dynamic>))
              .map((dto) => dto.toDomain())
              .toList();
          
          return Result.success(bookings);
        },
        onError: (error) => Result.error(error),
      );
    } catch (e) {
      return Result.error('Failed to load bookings: $e');
    }
  }
  
  Future<Result<void>> createBooking(String title, DateTime date) async {
    try {
      final dto = BookingDto(
        id: '', // Will be set by server
        title: title,
        date: date.toIso8601String(),
        status: 'pending',
      );
      
      final response = await _apiClient.post<Map<String, dynamic>>(
        '/bookings',
        body: dto.toJson(),
      );
      
      return response.fold(
        onSuccess: (_) => const Result.success(null),
        onError: (error) => Result.error(error),
      );
    } catch (e) {
      return Result.error('Failed to create booking: $e');
    }
  }
}
```

#### Data Model (DTO)
```dart
// features/booking/data/models/booking_dto.dart
import 'package:freezed_annotation/freezed_annotation.dart';
import '../../domain/models/booking.dart';

part 'booking_dto.freezed.dart';
part 'booking_dto.g.dart';

@freezed
class BookingDto with _$BookingDto {
  const factory BookingDto({
    required String id,
    required String title,
    required String date,
    required String status,
  }) = _BookingDto;

  factory BookingDto.fromJson(Map<String, dynamic> json) =>
      _$BookingDtoFromJson(json);
}

extension BookingDtoX on BookingDto {
  Booking toDomain() {
    return Booking(
      id: id,
      title: title,
      date: DateTime.parse(date),
      status: BookingStatus.fromString(status),
    );
  }
}
```

### 3. Domain Layer - Pure Business Logic

#### Domain Entity (Freezed)
```dart
// features/booking/domain/models/booking.dart
import 'package:freezed_annotation/freezed_annotation.dart';

part 'booking.freezed.dart';

@freezed
class Booking with _$Booking {
  const factory Booking({
    required String id,
    required String title,
    required DateTime date,
    required BookingStatus status,
    required DateTime createdAt,
  }) = _Booking;

  const Booking._();

  // Business logic methods
  bool get isActive => status == BookingStatus.active;
  bool get isPending => status == BookingStatus.pending;
  bool get isExpired => date.isBefore(DateTime.now());
  
  String get formattedDate => '${date.day}/${date.month}/${date.year}';
  
  bool canBeCancelled() {
    return isActive && date.isAfter(DateTime.now().add(Duration(hours: 24)));
  }
}

enum BookingStatus {
  pending,
  active,
  cancelled,
  completed;

  static BookingStatus fromString(String value) {
    return BookingStatus.values.firstWhere(
      (status) => status.name == value,
      orElse: () => BookingStatus.pending,
    );
  }
}
```

#### Use Case (Complex Business Logic)
```dart
class GetUserBookingsUseCase {
  final BookingRepository _bookingRepository;
  final UserRepository _userRepository;
  
  GetUserBookingsUseCase(this._bookingRepository, this._userRepository);
  
  Future<List<Booking>> execute(String userId) async {
    // Complex business logic involving multiple repositories
    final user = await _userRepository.getUser(userId);
    final bookings = await _bookingRepository.getBookingsByUser(userId);
    
    // Apply business rules
    return bookings.where((booking) => 
      booking.isVisibleTo(user) && 
      booking.isNotExpired()
    ).toList();
  }
}
```

## 🔧 Dependency Injection (Provider Package)

### Main App Setup
```dart
void main() {
  runApp(
    MultiProvider(
      providers: [
        // Services (Stateless)
        Provider(create: (_) => ApiClient()),
        Provider(create: (context) => BookingService(context.read())),
        
        // Repositories (SSOT)
        Provider(create: (context) => BookingRepository(context.read())),
        
        // ViewModels (UI State)
        ChangeNotifierProvider(
          create: (context) => BookingViewModel(context.read())
        ),
      ],
      child: const MyApp(),
    ),
  );
}
```

## 🧪 Testing Strategy (Oficial Flutter)

### ViewModel Unit Tests
```dart
void main() {
  group('BookingViewModel', () {
    late MockBookingRepository mockRepository;
    late BookingViewModel viewModel;

    setUp(() {
      mockRepository = MockBookingRepository();
      viewModel = BookingViewModel(mockRepository);
    });

    test('should load bookings successfully', () async {
      // Arrange
      final bookings = [Booking(id: '1', title: 'Test')];
      when(() => mockRepository.getBookings())
          .thenAnswer((_) async => bookings);

      // Act
      await viewModel.loadBookings();

      // Assert
      expect(viewModel.bookings, equals(bookings));
      expect(viewModel.isLoading, false);
    });
  });
}
```

### Widget Tests
```dart
Widget testApp(Widget child) {
  return MultiProvider(
    providers: [
      Provider(create: (_) => FakeBookingRepository()),
      ChangeNotifierProvider(
        create: (context) => BookingViewModel(context.read())
      ),
    ],
    child: MaterialApp(home: child),
  );
}

void main() {
  testWidgets('BookingScreen shows loading state', (tester) async {
    await tester.pumpWidget(testApp(BookingScreen()));
    
    expect(find.byType(LoadingWidget), findsOneWidget);
  });
}
```

## 🎨 Design Patterns Oficiais Flutter

### 1. Command Pattern (UI Actions)
```dart
class AsyncCommand<T> extends ChangeNotifier {
  bool _isExecuting = false;
  T? _result;
  String? _error;
  
  bool get isExecuting => _isExecuting;
  T? get result => _result;
  String? get error => _error;
  
  Future<void> execute(Future<T> Function() action) async {
    _isExecuting = true;
    _error = null;
    notifyListeners();
    
    try {
      _result = await action();
    } catch (e) {
      _error = e.toString();
    } finally {
      _isExecuting = false;
      notifyListeners();
    }
  }
}
```

### 2. Result Pattern (Error Handling)
```dart
sealed class Result<T> {
  const Result();
}

class Success<T> extends Result<T> {
  final T data;
  const Success(this.data);
}

class Error<T> extends Result<T> {
  final String message;
  const Error(this.message);
}

// Usage in Repository
Future<Result<List<Booking>>> getBookings() async {
  try {
    final bookings = await _service.fetchBookings();
    return Success(bookings);
  } catch (e) {
    return Error(e.toString());
  }
}
```

### 3. Optimistic State Pattern
```dart
class BookingViewModel extends ChangeNotifier {
  Future<void> toggleBookmark(String bookingId) async {
    // 1. Update UI optimistically
    _updateBookmarkLocally(bookingId, true);
    notifyListeners();
    
    try {
      // 2. Sync with server
      await _repository.toggleBookmark(bookingId);
    } catch (e) {
      // 3. Rollback on error
      _updateBookmarkLocally(bookingId, false);
      notifyListeners();
      _showError(e.toString());
    }
  }
}
```

## 📦 Dependências Modernas (Riverpod + Code Generation)

```yaml
dependencies:
  flutter:
    sdk: flutter
  
  # State Management & DI (Riverpod Modern Stack)
  flutter_riverpod: ^2.5.1
  riverpod_annotation: ^2.3.3
  
  # Navigation (Official Recommendation)
  go_router: ^12.1.3
  
  # HTTP Client
  dio: ^5.4.0  # More powerful than http
  
  # Local Storage
  shared_preferences: ^2.2.2
  
  # Code Generation & Immutability
  freezed_annotation: ^2.4.1
  json_annotation: ^4.8.1

dev_dependencies:
  # Testing
  flutter_test:
    sdk: flutter
  
  # Mocking (Riverpod compatible)
  mocktail: ^1.0.0
  
  # Code Generation (Riverpod + Freezed)
  build_runner: ^2.4.7
  riverpod_generator: ^2.3.9
  riverpod_lint: ^2.3.7
  custom_lint: ^0.5.7
  freezed: ^2.4.6
  json_serializable: ^6.7.1
  
  # Analysis
  flutter_lints: ^3.0.0
```

## 🚀 Gerando Código

Execute após criar providers e modelos:

```bash
# Gerar código uma vez
flutter pub run build_runner build

# Watch mode (regenera automaticamente)
flutter pub run build_runner watch --delete-conflicting-outputs
```

## 🎯 Comparação de Arquiteturas

| Aspecto | **Nossa Arquitetura** | Clean Architecture | Provider + MVVM |
|---------|----------------------|-------------------|------------------|
| **Organização** | **Feature-First** | Layer-First | Mixed |
| **State Management** | **Riverpod + Code Gen** | Bloc/Cubit variado | Provider manual |
| **Camadas** | UI + Data (+ Domain) | Presentation + Domain + Data | UI + Business |
| **Pattern** | **MVVM + Riverpod Notifiers** | MVP/MVVM/MVI | MVVM + ChangeNotifier |
| **DI** | **@riverpod automatic** | get_it/injectable | Provider manual |
| **Code Gen** | **Riverpod + Freezed** | Opcional | Opcional |
| **Testing** | **ProviderContainer mocking** | Repository mocking | Widget testing |
| **Boilerplate** | **Mínimo (code gen)** | Alto | Médio |
| **Type Safety** | **Maximum (sealed/freezed)** | Depende | Básico |
| **Performance** | **Optimal (fine-grained)** | Boa | Boa |
| **Learning Curve** | **Moderada** | Alta | Baixa |
| **Scalability** | **Excelente** | Excelente | Limitada |

## 🚀 Benefícios da Nossa Arquitetura

### ✅ Feature-First Organization
- **Escalabilidade por features** - Adicione novas features sem impactar outras
- **Team collaboration** - Múltiplos devs podem trabalhar em paralelo
- **Code ownership** - Clear boundaries per feature
- **Monorepo ready** - Easy to extract features as packages

### ✅ Riverpod Modern Stack
- **Code generation** - Menos boilerplate, mais type safety
- **Automatic dependency injection** - @riverpod providers
- **Fine-grained reactivity** - Rebuilds otimizados
- **Testing made simple** - ProviderContainer mocking
- **DevTools integration** - Debug state changes visually

### ✅ Type Safety Maximum
- **Freezed immutable models** - No runtime errors
- **Sealed classes for states** - Exhaustive pattern matching
- **Generated code** - Compile-time guarantees
- **Null safety** - Zero null reference exceptions

### ✅ Developer Experience
- **Hot reload friendly** - Fast development cycle
- **IDE support** - Auto-completion and refactoring
- **Lint rules** - Code quality enforcement
- **Easy testing** - Unit + Widget + Integration
- **Documentation** - Self-documenting code with types

### ✅ Performance & Scalability
- **Lazy providers** - Load only what's needed
- **Automatic disposal** - Memory leak prevention
- **Caching built-in** - Avoid unnecessary API calls
- **Fine-grained updates** - Minimal widget rebuilds
- **Background execution** - Non-blocking UI

---

## 🤔 Discussão: Qual Abordagem Seguir?

**Flutter Official Architecture oferece:**
1. ✅ Simplicidade e pragmatismo
2. ✅ Documentação oficial extensa
3. ✅ Padrões reconhecidos pela comunidade
4. ✅ Performance otimizada para Flutter
5. ✅ Evolução gradual (Domain layer opcional)

**Pontos para discussão:**
1. **Complexidade do projeto** - Simples/Médio vs Enterprise
2. **Equipe** - Júnior-friendly vs Senior-heavy
3. **Prazo** - Rápido desenvolvimento vs Arquitetura robusta
4. **Futuro** - Manutenção vs Features rápidas

**Proposta:** Seguir a arquitetura oficial Flutter como base, com possibilidade de evolução para Domain layer quando o projeto crescer em complexidade.

O que você acha desta abordagem? Devemos seguir 100% a documentação oficial ou fazer algumas adaptações?