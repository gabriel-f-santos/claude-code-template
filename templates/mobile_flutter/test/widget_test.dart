import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'package:flutter_template/main.dart';

void main() {
  group('Flutter Official Architecture Tests', () {
    testWidgets('App loads correctly', (WidgetTester tester) async {
      await tester.pumpWidget(const MyApp());
      
      expect(find.text('Flutter Official Architecture'), findsOneWidget);
    });
    
    testWidgets('Home screen displays correctly', (WidgetTester tester) async {
      await tester.pumpWidget(
        const ProviderScope(
          child: MaterialApp(
            home: MyApp(),
          ),
        ),
      );
      
      // Wait for the app to settle
      await tester.pumpAndSettle();
      
      // Verify main elements are present
      expect(find.text('Flutter Official Architecture'), findsOneWidget);
      expect(find.text('Feature-First + MVVM + Riverpod'), findsOneWidget);
      expect(find.byIcon(Icons.flutter_dash), findsOneWidget);
    });
  });
}