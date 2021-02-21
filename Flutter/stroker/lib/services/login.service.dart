class LoginService {
  bool _loggedIn;

  LoginService() {
    _loggedIn = false;
  }

  bool get loggedIn => _loggedIn;

  void logIn() {
    _loggedIn = true;
  }
}
