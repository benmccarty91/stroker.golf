import 'package:flutter/material.dart';
import 'package:get_it/get_it.dart';
import 'package:rxdart/rxdart.dart';

import 'examples/dependencyInjectedStatefulBuilder.dart';
import 'examples/simpleStateful.dart';
import 'examples/statefulBuilder.dart';

GetIt getIt = GetIt.instance;

void main() {
  getIt.registerSingleton<Counter>(Counter());
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: MyHomePage4(),
    );
  }
}
