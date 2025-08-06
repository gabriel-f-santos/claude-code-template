import 'package:riverpod_annotation/riverpod_annotation.dart';
import '../repositories/api_client.dart';

part 'api_client_provider.g.dart';

@riverpod
ApiClient apiClient(ApiClientRef ref) {
  return ApiClient();
}