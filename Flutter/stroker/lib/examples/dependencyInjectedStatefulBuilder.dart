import 'package:flutter/material.dart';
import 'package:get_it/get_it.dart';
import 'package:rxdart/rxdart.dart';

class Counter {
  BehaviorSubject<int> _counter = BehaviorSubject.seeded(0);

  ValueStream<int> get stream$ => _counter.stream;
  int get current => _counter.value;

  increment() {
    _counter.add(current + 1);
  }
}

class MyHomePage4 extends StatelessWidget {
  final counterService = GetIt.instance.get<Counter>();
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: StreamBuilder(
        stream: counterService.stream$,
        builder: (BuildContext context, AsyncSnapshot snapshot) {
          return Center(
            child: Text('${snapshot.data}'),
          );
        },
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => counterService.increment(),
        child: Icon(Icons.plus_one),
      ),
    );
  }
}
