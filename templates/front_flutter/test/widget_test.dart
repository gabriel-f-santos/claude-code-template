import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:flutter_template/main.dart';

void main() {
  testWidgets('Flutter Template smoke test', (WidgetTester tester) async {
    await tester.pumpWidget(const MyApp());

    expect(find.text('Flutter Clean Architecture Template'), findsOneWidget);
    expect(find.text('Pronto para desenvolvimento com arquitetura limpa!'), findsOneWidget);
  });
}