import 'package:flutter/material.dart';

class HomePageInherited extends InheritedWidget {
  final Widget child;
  final Map _counter = {'val': 0};

  HomePageInherited({this.child}) : super(child: child);

  void increment() {
    _counter['val']++;
  }

  int get counter => _counter['val'];

  @override
  bool updateShouldNotify(HomePageInherited oldWidget) => true;

  static HomePageInherited of(BuildContext context) =>
      context.dependOnInheritedWidgetOfExactType<HomePageInherited>();
}

class HomePage3 extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return StatefulBuilder(builder: (context, StateSetter setState) {
      int _counter = HomePageInherited.of(context).counter;
      Function increment = HomePageInherited.of(context).increment;
      return Scaffold(
        body: Center(
          child: Text('$_counter'),
        ),
        floatingActionButton: FloatingActionButton(
          onPressed: () => setState(() => increment()),
          child: Icon(Icons.plus_one),
        ),
      );
    });
  }
}
