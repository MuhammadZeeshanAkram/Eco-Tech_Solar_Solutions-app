import 'package:flutter/material.dart';
import 'package:frontend/Users/Modules/AUTHENTICATION/services/services.dart';


class LoginApp extends StatelessWidget {
  const LoginApp({super.key});

  @override
  Widget build(BuildContext context) {
    return const MaterialApp(
      title: 'Login Interface',
      home: LoginScreen(),
      debugShowCheckedModeBanner: false,
    );
  }
}

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  _LoginScreenState createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;
  bool rememberMe = false;
  final AuthService _authService = AuthService();

  // Controllers for TextFields
  final TextEditingController _field1Controller = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    _field1Controller.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Login'),
        bottom: TabBar(
          controller: _tabController,
          tabs: const [
            Tab(text: 'Email & Password'),
            Tab(text: 'Name & Password'),
            Tab(text: 'Mobile & Password'),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          buildLoginForm('Email', 'Password', loginWithEmail),
          buildLoginForm('Name', 'Password', loginWithName),
          buildLoginForm('Mobile Number', 'Password', loginWithMobile),
        ],
      ),
    );
  }

  // Login Form Builder
  Widget buildLoginForm(String field1, String field2, Function loginFunction) {
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          TextField(
            controller: _field1Controller,
            decoration: InputDecoration(labelText: field1),
          ),
          const SizedBox(height: 16),
          TextField(
            controller: _passwordController,
            obscureText: true,
            decoration: InputDecoration(labelText: field2),
          ),
          const SizedBox(height: 16),
          Row(
            children: [
              Checkbox(
                value: rememberMe,
                onChanged: (value) {
                  setState(() {
                    rememberMe = value!;
                  });
                },
              ),
              const Text('Remember Me'),
            ],
          ),
          Align(
            alignment: Alignment.centerRight,
            child: TextButton(
              onPressed: () {
                // Forgot password logic (You can integrate here)
              },
              child: const Text('Forgot Password?'),
            ),
          ),
          const SizedBox(height: 16),
          Center(
            child: ElevatedButton(
              onPressed: () => loginFunction(),
              child: const Text('Sign In'),
            ),
          ),
          const SizedBox(height: 16),
          Center(
            child: TextButton(
              onPressed: () {
                // Navigate to Sign Up
              },
              child: const Text("Don't have an account? Sign Up"),
            ),
          ),
        ],
      ),
    );
  }

  // Login with Email Function
  void loginWithEmail() async {
    bool success = await _authService.loginWithEmail(
      _field1Controller.text,
      _passwordController.text,
    );

    if (success) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Login Successful')));
      // Navigate to dashboard
    } else {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Login Failed')));
    }
  }

  // Login with Name Function
  void loginWithName() async {
    bool success = await _authService.loginWithName(
      _field1Controller.text,
      _passwordController.text,
    );

    if (success) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Login Successful')));
      // Navigate to dashboard
    } else {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Login Failed')));
    }
  }

  // Login with Mobile Function
  void loginWithMobile() async {
    bool success = await _authService.loginWithMobile(
      _field1Controller.text,
      _passwordController.text,
    );

    if (success) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Login Successful')));
      // Navigate to dashboard
    } else {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Login Failed')));
    }
  }
}
