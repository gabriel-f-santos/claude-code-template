import 'package:freezed_annotation/freezed_annotation.dart';

part 'result.freezed.dart';

@freezed
sealed class Result<T> with _$Result<T> {
  const factory Result.success(T data) = Success<T>;
  const factory Result.error(String message) = Error<T>;
  
  const Result._();

  /// Fold the result into a single value
  R fold<R>({
    required R Function(T data) onSuccess,
    required R Function(String message) onError,
  }) {
    return switch (this) {
      Success(:final data) => onSuccess(data),
      Error(:final message) => onError(message),
    };
  }

  /// Returns true if this is a success result
  bool get isSuccess => this is Success<T>;
  
  /// Returns true if this is an error result
  bool get isError => this is Error<T>;
  
  /// Returns the data if success, null otherwise
  T? get dataOrNull {
    return switch (this) {
      Success(:final data) => data,
      Error() => null,
    };
  }
  
  /// Returns the error message if error, null otherwise
  String? get errorOrNull {
    return switch (this) {
      Success() => null,
      Error(:final message) => message,
    };
  }
}