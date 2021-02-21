import 'package:flutter/material.dart';
import 'package:get_it/get_it.dart';
import 'package:stroker/layout/main.layout.dart';
import 'package:stroker/services/login.service.dart';

import 'examples/dependencyInjectedStatefulBuilder.dart';

GetIt getIt = GetIt.instance;

void main() {
  getIt.registerSingleton<LoginService>(LoginService());
  getIt.registerSingleton<Counter>(Counter());
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MainLayout();
  }
}
