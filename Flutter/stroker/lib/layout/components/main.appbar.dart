import 'package:flutter/material.dart';

class MainAppBar {
  static appBar() {
    return AppBar(
      title: Padding(
        padding: const EdgeInsets.fromLTRB(0, 10.0, 0, 0),
        child: Image.asset(
          'assets/logos/logo_white.png',
          width: 150.0,
        ),
      ),
    );
  }
}
