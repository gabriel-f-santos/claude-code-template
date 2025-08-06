# Flutter Official Architecture Template

## Proposta Baseada na Documentação Oficial Flutter

Após leitura completa da documentação oficial de arquitetura do Flutter (https://docs.flutter.dev/app-architecture), esta é a proposta seguindo **exatamente** as diretrizes oficiais.

## 🎯 Arquitetura Oficial Flutter: MVVM + Layered Architecture

### Princípios Fundamentais (Flutter Official)

1. **Separation of Concerns** - Princípio mais importante
2. **Unidirectional Data Flow** - Estado flui: Data → Logic → UI
3. **Single Source of Truth (SSOT)** - Um repositório por tipo de dado
4. **UI as a Function of State** - UI reflete o estado atual
5. **Layered Architecture** - Camadas bem definidas

### Estrutura de Camadas (Oficial)

```
lib/
├── ui/                           # UI LAYER
│   ├── core/                    # Componentes UI compartilhados
│   │   ├── theme/              # Temas e estilos
│   │   └── widgets/            # Widgets reutilizáveis
│   └── <feature>/              # Por feature (booking, profile, etc)
│       ├── view_model/         # ViewModels (ChangeNotifier)
│       │   └── feature_view_model.dart
│       └── widgets/            # Views (StatelessWidget)
│           └── feature_screen.dart
├── domain/                      # DOMAIN LAYER (Opcional)
│   ├── models/                 # Domain Models (immutable)
│   └── use_cases/              # Use Cases/Interactors
├── data/                       # DATA LAYER
│   ├── repositories/           # Source of Truth (SSOT)
│   │   └── feature_repository.dart
│   ├── services/               # API/External Services
│   │   └── feature_service.dart
│   └── models/                 # Data Models (API DTOs)
├── config/                     # Configurações da app
├── utils/                      # Utilitários
└── routing/                    # Navegação (GoRouter)
```

## 🏗️ Componentes Arquiteturais (Oficial Flutter)

### 1. UI Layer - MVVM Pattern

#### View (StatelessWidget)
```dart
class BookingScreen extends StatelessWidget {
  final BookingViewModel viewModel;
  
  const BookingScreen({required this.viewModel});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: ListenableBuilder(
        listenable: viewModel,
        builder: (context, child) {
          if (viewModel.isLoading) return LoadingWidget();
          if (viewModel.hasError) return ErrorWidget(viewModel.error);
          
          return BookingList(bookings: viewModel.bookings);
        },
      ),
    );
  }
}
```

#### ViewModel (ChangeNotifier)
```dart
class BookingViewModel extends ChangeNotifier {
  final BookingRepository _repository;
  
  List<Booking> _bookings = [];
  bool _isLoading = false;
  String? _error;
  
  // Immutable getters
  List<Booking> get bookings => List.unmodifiable(_bookings);
  bool get isLoading => _isLoading;
  String? get error => _error;
  
  BookingViewModel(this._repository);
  
  Future<void> loadBookings() async {
    _setLoading(true);
    try {
      _bookings = await _repository.getBookings();
      _error = null;
    } catch (e) {
      _error = e.toString();
    } finally {
      _setLoading(false);
    }
  }
  
  void _setLoading(bool loading) {
    _isLoading = loading;
    notifyListeners();
  }
}
```

### 2. Data Layer

#### Repository (Single Source of Truth)
```dart
class BookingRepository {
  final BookingService _service;
  
  BookingRepository(this._service);
  
  Future<List<Booking>> getBookings() async {
    // 1. Fetch raw data from service
    final rawBookings = await _service.fetchBookings();
    
    // 2. Transform to domain models
    return rawBookings
        .map((raw) => Booking.fromApiModel(raw))
        .toList();
  }
  
  Future<void> createBooking(BookingRequest request) async {
    await _service.createBooking(request);
    // Repository handles caching, retry logic, etc.
  }
}
```

#### Service (Stateless API Wrapper)
```dart
class BookingService {
  final ApiClient _client;
  
  BookingService(this._client);
  
  Future<List<BookingApiModel>> fetchBookings() async {
    final response = await _client.get('/bookings');
    return (response['data'] as List)
        .map((json) => BookingApiModel.fromJson(json))
        .toList();
  }
}
```

### 3. Domain Layer (Opcional - Quando Necessário)

#### Domain Model (Immutable)
```dart
@immutable
class Booking {
  final String id;
  final String title;
  final DateTime date;
  final BookingStatus status;
  
  const Booking({
    required this.id,
    required this.title,
    required this.date,
    required this.status,
  });
  
  // Factory from API model
  factory Booking.fromApiModel(BookingApiModel api) {
    return Booking(
      id: api.id,
      title: api.name, // Transform field names
      date: DateTime.parse(api.dateString),
      status: BookingStatus.fromString(api.status),
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

## 📦 Dependências Recomendadas (Flutter Official)

```yaml
dependencies:
  flutter:
    sdk: flutter
  
  # State Management & DI (Official Recommendation)
  provider: ^6.1.1
  
  # Navigation (Official Recommendation)
  go_router: ^12.1.3
  
  # HTTP Client
  http: ^1.1.0
  
  # Local Storage
  shared_preferences: ^2.2.2
  
  # Code Generation (Recommended)
  freezed_annotation: ^2.4.1
  json_annotation: ^4.8.1

dev_dependencies:
  # Testing (Built-in)
  flutter_test:
    sdk: flutter
  
  # Mocking (Recommended)
  mocktail: ^1.0.0
  
  # Code Generation
  build_runner: ^2.4.7
  freezed: ^2.4.6
  json_serializable: ^6.7.1
```

## 🎯 Diferenças da Clean Architecture "Tradicional"

| Aspecto | Flutter Official | Clean Architecture |
|---------|------------------|-------------------|
| **Camadas** | UI + Data (+ Domain opcional) | Presentation + Domain + Data |
| **Pattern** | MVVM com ChangeNotifier | MVP/MVVM/MVI variado |
| **State** | ChangeNotifier + Provider | Bloc/Cubit/Riverpod/etc |
| **Navigation** | GoRouter oficial | Qualquer solução |
| **DI** | Provider package | get_it/injectable/etc |
| **Complexidade** | Mais simples, pragmática | Mais rígida, verbose |

## 🚀 Benefícios da Arquitetura Oficial

### ✅ Simplicidade
- Menos boilerplate que Clean Architecture tradicional
- Foco no que realmente importa para Flutter
- Documentação oficial extensa

### ✅ Performance
- ChangeNotifier é otimizado para Flutter
- ListenableBuilder para rebuilds precisos
- Provider com lazy loading nativo

### ✅ Testabilidade
- Cada camada testável independentemente
- Mocking simples com mocktail
- Widget tests integrados

### ✅ Manutenibilidade
- Estrutura oficial e padronizada
- Separação clara de responsabilidades
- Evolution path clara (Domain layer quando necessário)

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