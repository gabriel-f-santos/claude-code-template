# Flutter Clean Architecture Template

## Arquitetura Modular por Features (Mobile)

Este template implementa Clean Architecture com Flutter, organizando o código por features/domínios para máxima escalabilidade e manutenibilidade.

## Estrutura do Projeto
```
lib/
├── core/                     # Configurações e serviços centrais
│   ├── constants/           # Constantes globais da aplicação
│   │   └── app_constants.dart # URLs, timeouts, chaves de storage
│   ├── theme/              # Temas e estilos globais
│   │   └── app_theme.dart  # Material Design themes
│   ├── utils/              # Utilitários e helpers
│   │   └── validators.dart # Validações de formulário
│   └── services/           # Serviços globais
│       └── navigation_service.dart # Configuração GoRouter
├── shared/                  # Recursos compartilhados entre features
│   ├── models/             # Modelos de dados compartilhados
│   ├── widgets/            # Widgets reutilizáveis
│   │   ├── loading_widget.dart # Widget de loading
│   │   └── error_widget.dart   # Widget de erro
│   └── services/           # Serviços compartilhados
│       ├── api_service.dart    # Cliente HTTP
│       └── storage_service.dart # SharedPreferences wrapper
└── features/               # Features organizadas por domínio
    └── auth/              # Feature de autenticação
        ├── data/          # Camada de dados
        │   ├── models/    # Modelos de dados (DTOs)
        │   ├── repositories/ # Implementações de repositórios
        │   └── datasources/  # Fontes de dados (API, local)
        ├── domain/        # Camada de domínio (regras de negócio)
        │   ├── entities/  # Entidades de negócio puras
        │   ├── repositories/ # Contratos de repositórios
        │   └── usecases/  # Casos de uso da aplicação
        └── presentation/  # Camada de apresentação (UI)
            ├── pages/     # Páginas/telas da feature
            ├── widgets/   # Widgets específicos da feature
            └── providers/ # State management (Provider/Riverpod)
```

## Comandos Úteis
- `flutter run` - Executar app em desenvolvimento
- `flutter build apk --release` - Build Android para produção
- `flutter build ios --release` - Build iOS para produção
- `flutter test` - Executar todos os testes
- `flutter analyze` - Análise estática de código
- `flutter clean && flutter pub get` - Limpar e reinstalar dependências

## Patterns Implementados (Flutter Clean Architecture)

### Clean Architecture Layers
Separação clara das responsabilidades:
```dart
// Domain Entity (regras de negócio puras)
class User {
  final String id;
  final String username;
  final String email;
  
  const User({required this.id, required this.username, required this.email});
}

// Data Model (serialização/deserialização)
class UserModel extends User {
  const UserModel({required super.id, required super.username, required super.email});
  
  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      id: json['id'],
      username: json['username'], 
      email: json['email'],
    );
  }
}
```

### Repository Pattern
Abstração da camada de dados:
```dart
// Domain Repository (contrato)
abstract class AuthRepository {
  Future<User> login(String email, String password);
  Future<User> getCurrentUser();
}

// Data Repository (implementação)
class AuthRepositoryImpl implements AuthRepository {
  final ApiService _apiService;
  final StorageService _storage;
  
  AuthRepositoryImpl(this._apiService, this._storage);
  
  @override
  Future<User> login(String email, String password) async {
    final response = await _apiService.post('/login', body: {
      'email': email, 
      'password': password
    });
    return UserModel.fromJson(response);
  }
}
```

### Provider State Management
Gerenciamento de estado reativo:
```dart
class AuthProvider extends ChangeNotifier {
  User? _user;
  bool _isLoading = false;
  
  User? get user => _user;
  bool get isLoading => _isLoading;
  bool get isLoggedIn => _user != null;
  
  Future<void> login(String email, String password) async {
    _isLoading = true;
    notifyListeners();
    
    try {
      _user = await _repository.login(email, password);
    } catch (e) {
      // Handle error
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
}
```

## Prompts Especializados para Claude Code

### Subagent: Flutter Clean Architecture Expert
Use este agente para desenvolvimento Flutter com Clean Architecture.

**Contexto**: Este projeto segue Clean Architecture com Flutter. Sempre considere:
- Separação clara entre Domain, Data e Presentation layers
- Repository pattern para abstração de dados
- Provider para state management
- Dependency injection manual ou com get_it
- Testes unitários para cada layer

**Tarefas que este agente pode fazer**:
- Implementar novas features completas (domain + data + presentation)
- Criar repositories e datasources
- Implementar casos de uso complexos
- Configurar injeção de dependência
- Criar widgets reutilizáveis com Provider

**Exemplo de prompt**:
"Como um expert em Flutter Clean Architecture, implemente uma feature completa de 'posts' incluindo domain entities, repository pattern, API integration, e UI com Provider para state management."

### Subagent: Flutter UI/UX Expert
Use este agente para implementar interfaces e experiência do usuário.

**Contexto**: Este projeto usa Material Design 3 com temas customizados. Sempre considere:
- Material Design guidelines e componentes
- Responsive design para diferentes telas
- Acessibilidade e usabilidade
- Animações fluidas e microinterações
- Performance de renderização

**Tarefas que este agente pode fazer**:
- Criar layouts responsivos e acessíveis
- Implementar animações e transições
- Otimizar performance de renderização
- Criar componentes customizados
- Implementar navegação complexa

**Exemplo de prompt**:
"Como um expert em Flutter UI/UX, crie uma interface de login moderna com animações suaves, validação em tempo real e suporte a dark/light theme."

### Subagent: Flutter Testing Expert
Use este agente para implementar testes abrangentes.

**Contexto**: Este projeto prioriza qualidade com testes em todas as layers. Sempre considere:
- Testes unitários para domain e data layers
- Widget tests para componentes UI
- Integration tests para fluxos completos
- Mocking de dependências externas
- Coverage de código alto

**Tarefas que este agente pode fazer**:
- Criar suites de testes unitários
- Implementar widget tests complexos
- Configurar mocking e fixtures
- Otimizar performance dos testes
- Implementar integration tests

**Exemplo de prompt**:
"Como um expert em Flutter Testing, implemente uma suíte completa de testes para a feature de autenticação, incluindo unit tests para repositories, widget tests para UI e integration tests para o fluxo completo."

### Subagent: Flutter State Management Expert
Use este agente para gerenciamento de estado avançado.

**Contexto**: Este projeto usa Provider como base, mas pode integrar outros patterns. Sempre considere:
- Provider pattern para state management
- Separation of concerns no state
- Performance de rebuilds
- Estado global vs local
- Persistência de estado

**Tarefas que este agente pode fazer**:
- Implementar providers complexos
- Otimizar performance de state updates
- Integrar outros state managers (Riverpod, Bloc)
- Implementar state persistence
- Criar state management patterns customizados

**Exemplo de prompt**:
"Como um expert em Flutter State Management, refatore o sistema atual para usar Riverpod com code generation, implementando cache inteligente e state persistence."

## Benefícios da Clean Architecture Flutter

### ✅ Testabilidade
- Testes unitários independentes para cada layer
- Mocking fácil de dependências externas
- Cobertura de código alta e confiável
- Testes rápidos e isolados

### ✅ Manutenibilidade
- Código organizado por features e responsibilities
- Baixo acoplamento entre camadas
- Fácil localização e modificação de código
- Refatoração segura com testes

### ✅ Escalabilidade
- Adição de novas features sem impacto
- Múltiplos desenvolvedores trabalhando em paralelo
- Reutilização de componentes e serviços
- Arquitetura preparada para crescimento

### ✅ Performance
- Lazy loading de features
- State management otimizado
- Rebuilds mínimos e eficientes
- Assets e recursos organizados

## Diferenças de Outros Templates Mobile

### Arquitetura vs MVC/MVP
- **Clean Architecture** com separação clara de responsabilidades
- **Repository Pattern** em vez de acesso direto à dados
- **Use Cases** para regras de negócio complexas
- **Dependency Inversion** para testabilidade

### State Management
- **Provider** com patterns escaláveis
- **State imutável** para consistência
- **Listeners otimizados** para performance
- **Context isolation** para widgets

### Organização
- **Features modulares** em vez de tipos de arquivos
- **Domain-driven** organization
- **Shared resources** centralizados
- **Testing strategy** integrada

## Setup e Configuração

### Variáveis de Ambiente
Configure em `lib/core/constants/app_constants.dart`:
```dart
class AppConstants {
  static const String baseUrl = 'https://api.myapp.com'; // Sua API
  static const Duration apiTimeout = Duration(seconds: 30);
  static const String authTokenKey = 'auth_token';
}
```

### Dependências Principais
```yaml
dependencies:
  flutter: sdk
  provider: ^6.1.1      # State management
  go_router: ^12.1.3    # Navegação declarativa
  http: ^1.1.0          # Cliente HTTP
  shared_preferences: ^2.2.2  # Storage local

dev_dependencies:
  flutter_test: sdk
  flutter_lints: ^3.0.0
```

### Inicialização
```dart
void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // Inicializar serviços
  await StorageService.init();
  
  runApp(MyApp());
}
```

## Exemplo de Feature Completa

### 1. Domain Entity
```dart
class Post {
  final String id;
  final String title;
  final String content;
  final String authorId;
  final DateTime createdAt;
  
  const Post({
    required this.id,
    required this.title, 
    required this.content,
    required this.authorId,
    required this.createdAt,
  });
}
```

### 2. Repository Contract
```dart
abstract class PostRepository {
  Future<List<Post>> getPosts();
  Future<Post> createPost(String title, String content);
  Future<void> deletePost(String id);
}
```

### 3. Data Implementation
```dart
class PostRepositoryImpl implements PostRepository {
  final ApiService _apiService;
  
  PostRepositoryImpl(this._apiService);
  
  @override
  Future<List<Post>> getPosts() async {
    final response = await _apiService.get('/posts');
    return (response['posts'] as List)
        .map((json) => PostModel.fromJson(json))
        .toList();
  }
}
```

### 4. Use Case
```dart
class GetPostsUseCase {
  final PostRepository _repository;
  
  GetPostsUseCase(this._repository);
  
  Future<List<Post>> call() async {
    return await _repository.getPosts();
  }
}
```

### 5. Provider
```dart
class PostProvider extends ChangeNotifier {
  final GetPostsUseCase _getPostsUseCase;
  
  List<Post> _posts = [];
  bool _isLoading = false;
  String? _error;
  
  List<Post> get posts => _posts;
  bool get isLoading => _isLoading;
  String? get error => _error;
  
  PostProvider(this._getPostsUseCase);
  
  Future<void> loadPosts() async {
    _isLoading = true;
    _error = null;
    notifyListeners();
    
    try {
      _posts = await _getPostsUseCase();
    } catch (e) {
      _error = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
}
```

### 6. UI Widget
```dart
class PostsPage extends StatelessWidget {
  const PostsPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Posts')),
      body: Consumer<PostProvider>(
        builder: (context, provider, child) {
          if (provider.isLoading) {
            return const LoadingWidget();
          }
          
          if (provider.error != null) {
            return ErrorDisplayWidget(
              message: provider.error!,
              onRetry: () => provider.loadPosts(),
            );
          }
          
          return ListView.builder(
            itemCount: provider.posts.length,
            itemBuilder: (context, index) {
              final post = provider.posts[index];
              return PostItem(post: post);
            },
          );
        },
      ),
    );
  }
}
```

Esta arquitetura oferece uma base sólida para aplicações Flutter empresariais com qualidade, performance e escalabilidade! 🚀📱