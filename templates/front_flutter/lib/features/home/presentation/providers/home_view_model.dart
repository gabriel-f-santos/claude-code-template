import 'package:riverpod_annotation/riverpod_annotation.dart';
import 'package:freezed_annotation/freezed_annotation.dart';

part 'home_view_model.g.dart';
part 'home_view_model.freezed.dart';

@freezed
class HomeViewModelState with _$HomeViewModelState {
  const factory HomeViewModelState({
    required String title,
    required String subtitle,
    required bool isDataLoaded,
    @Default([]) List<String> features,
  }) = _HomeViewModelState;
  
  factory HomeViewModelState.initial() => const HomeViewModelState(
        title: 'Flutter Official Architecture',
        subtitle: 'Feature-First + MVVM + Riverpod',
        isDataLoaded: false,
      );
}

@riverpod
class HomeViewModel extends _$HomeViewModel {
  @override
  FutureOr<HomeViewModelState> build() {
    return HomeViewModelState.initial();
  }

  Future<void> refreshData() async {
    state = const AsyncLoading();
    
    // Simulate API call
    await Future.delayed(const Duration(seconds: 1));
    
    state = AsyncData(
      HomeViewModelState(
        title: 'Flutter Official Architecture',
        subtitle: 'Feature-First + MVVM + Riverpod',
        isDataLoaded: true,
        features: [
          'Riverpod State Management',
          'Feature-First Organization',
          'Code Generation',
          'Type Safety with Freezed',
          'MVVM Pattern',
          'Result Pattern',
        ],
      ),
    );
  }
  
  Future<void> loadInitialData() async {
    if (!state.hasValue) {
      await refreshData();
    }
  }
}