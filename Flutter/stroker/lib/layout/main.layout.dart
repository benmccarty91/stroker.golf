import 'package:flutter/material.dart';
import 'package:get_it/get_it.dart';
import 'package:stroker/layout/components/main.appbar.dart';
import 'package:stroker/layout/components/main.drawer.dart';
import 'package:stroker/layout/themes/main.theme.dart';
import 'package:stroker/pages/landing.page.dart';
import 'package:stroker/pages/login.page.dart';
import 'package:stroker/services/login.service.dart';

class MainLayout extends StatefulWidget {
  @override
  State<StatefulWidget> createState() => MainLayoutState();
}

class MainLayoutState extends State<MainLayout> {
  final loginService = GetIt.instance.get<LoginService>();

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      theme: MainTheme.theme(),
      home: Scaffold(
        appBar: MainAppBar.appBar(),
        drawer: MainAppDrawer(),
        body: Container(
          decoration: BoxDecoration(
            image: DecorationImage(
              image: AssetImage('assets/images/background.jpg'),
              fit: BoxFit.cover,
            ),
          ),
          child: Center(
            child: loginService.loggedIn ? LandingPage() : LoginPage(),
          ),
        ),
        floatingActionButton: FloatingActionButton(
          child: Icon(Icons.login),
          onPressed: () {
            setState(() {
              loginService.logIn();
            });
          },
        ),
      ),
    );
  }
}
