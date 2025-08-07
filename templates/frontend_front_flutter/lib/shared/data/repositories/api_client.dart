import 'package:dio/dio.dart';
import '../models/result.dart';

class ApiClient {
  late final Dio _dio;
  
  ApiClient({String? baseUrl}) {
    _dio = Dio(BaseOptions(
      baseUrl: baseUrl ?? 'http://localhost:8000',
      connectTimeout: const Duration(seconds: 30),
      receiveTimeout: const Duration(seconds: 30),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    ));
    
    _setupInterceptors();
  }
  
  void _setupInterceptors() {
    _dio.interceptors.add(
      LogInterceptor(
        requestBody: true,
        responseBody: true,
        error: true,
      ),
    );
  }
  
  Future<Result<T>> get<T>(
    String path, {
    Map<String, dynamic>? queryParameters,
    Options? options,
  }) async {
    try {
      final response = await _dio.get<T>(
        path,
        queryParameters: queryParameters,
        options: options,
      );
      
      return Result.success(response.data as T);
    } on DioException catch (e) {
      return Result.error(_handleError(e));
    } catch (e) {
      return Result.error('Unexpected error: $e');
    }
  }
  
  Future<Result<T>> post<T>(
    String path, {
    dynamic body,
    Map<String, dynamic>? queryParameters,
    Options? options,
  }) async {
    try {
      final response = await _dio.post<T>(
        path,
        data: body,
        queryParameters: queryParameters,
        options: options,
      );
      
      return Result.success(response.data as T);
    } on DioException catch (e) {
      return Result.error(_handleError(e));
    } catch (e) {
      return Result.error('Unexpected error: $e');
    }
  }
  
  Future<Result<T>> put<T>(
    String path, {
    dynamic body,
    Map<String, dynamic>? queryParameters,
    Options? options,
  }) async {
    try {
      final response = await _dio.put<T>(
        path,
        data: body,
        queryParameters: queryParameters,
        options: options,
      );
      
      return Result.success(response.data as T);
    } on DioException catch (e) {
      return Result.error(_handleError(e));
    } catch (e) {
      return Result.error('Unexpected error: $e');
    }
  }
  
  Future<Result<T>> delete<T>(
    String path, {
    Map<String, dynamic>? queryParameters,
    Options? options,
  }) async {
    try {
      final response = await _dio.delete<T>(
        path,
        queryParameters: queryParameters,
        options: options,
      );
      
      return Result.success(response.data as T);
    } on DioException catch (e) {
      return Result.error(_handleError(e));
    } catch (e) {
      return Result.error('Unexpected error: $e');
    }
  }
  
  String _handleError(DioException error) {
    switch (error.type) {
      case DioExceptionType.connectionTimeout:
      case DioExceptionType.sendTimeout:
      case DioExceptionType.receiveTimeout:
        return 'Connection timeout';
        
      case DioExceptionType.badResponse:
        final statusCode = error.response?.statusCode;
        final message = error.response?.data?['message'] ?? 
                       error.response?.data?['detail'] ?? 
                       'Request failed';
        return '$message (Status: $statusCode)';
        
      case DioExceptionType.cancel:
        return 'Request cancelled';
        
      case DioExceptionType.connectionError:
        return 'No internet connection';
        
      case DioExceptionType.badCertificate:
        return 'Certificate verification failed';
        
      case DioExceptionType.unknown:
      default:
        return 'Network error: ${error.message}';
    }
  }
}