import 'package:flutter/material.dart';

// not the best example, as this prop needs to be declared as final
class MyHomePage2 extends StatelessWidget {
  int _counter = 0;

  @override
  Widget build(BuildContext context) {
    return StatefulBuilder(
      builder: (context, StateSetter setState) => Scaffold(
        body: Center(
          child: Text('$_counter'),
        ),
        floatingActionButton: FloatingActionButton(
          onPressed: () => setState(() => _counter++),
          child: Icon(Icons.plus_one),
        ),
      ),
    );
  }
}
