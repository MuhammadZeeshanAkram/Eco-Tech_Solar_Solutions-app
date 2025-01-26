import 'dart:convert';
import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

class SignUpScreen extends StatefulWidget {
  const SignUpScreen({super.key});

  @override
  State<SignUpScreen> createState() => _SignUpScreenState();
}

class _SignUpScreenState extends State<SignUpScreen> {
  final _formKey = GlobalKey<FormState>();
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _nameController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  final TextEditingController _confirmPasswordController =
      TextEditingController();

  // List to store SN and TokenID controllers
  final List<Map<String, TextEditingController>> _deviceControllers = [
    {'sn': TextEditingController(), 'tokenId': TextEditingController()},
  ];

  // Function to add a new SN and TokenID field
  void _addDeviceField() {
    setState(() {
      _deviceControllers.add({
        'sn': TextEditingController(),
        'tokenId': TextEditingController(),
      });
    });
  }

  // Function to remove an SN and TokenID field
  void _removeDeviceField(int index) {
    setState(() {
      _deviceControllers.removeAt(index);
    });
  }

  // Function to submit form data to backend
  Future<void> _submitForm() async {
    if (_formKey.currentState!.validate()) {
      final email = _emailController.text;
      final name = _nameController.text;
      final password = _passwordController.text;
      final confirmPassword = _confirmPasswordController.text;

      // Collect all SN and TokenID values
      final devices = _deviceControllers.map((device) {
        return {
          'sn': device['sn']!.text,
          'tokenId': device['tokenId']!.text,
        };
      }).toList();

      final url = Uri.parse('https://eco-tech-solar-solutions-app-2.onrender.com/api/auth/signup');

      try {
        final response = await http.post(
          url,
          headers: {'Content-Type': 'application/json'},
          body: json.encode({
            'email': email,
            'name': name,
            'devices': devices,
            'password': password,
            'confirmPassword': confirmPassword,
          }),
        );

        if (response.statusCode == 201) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('Signup Successful: ${response.body}')),
          );
        } else {
          final message = json.decode(response.body)['message'];
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('Signup Failed: $message')),
          );
        }
      } catch (error) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error: $error')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: [
          // Background gradient
          Container(
            decoration: const BoxDecoration(
              gradient: LinearGradient(
                colors: [
                  Colors.green,
                  Color.fromARGB(255, 52, 128, 228),
                  Colors.white,
                ],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
            ),
          ),
          // Blurred background effect
          BackdropFilter(
            filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
            child: Container(
              color: Colors.black.withOpacity(0.5),
            ),
          ),
          // Main content
          Center(
            child: SingleChildScrollView(
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 32),
                child: Form(
                  key: _formKey,
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const SizedBox(height: 50),
                      // Welcome message
                      const Text(
                        'Welcome User!!',
                        style: TextStyle(
                          fontSize: 30,
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                        ),
                      ),
                      const SizedBox(height: 10),
                      const Text(
                        'Please fill in the details below to create an account.',
                        textAlign: TextAlign.center,
                        style: TextStyle(
                          color: Colors.white70,
                          fontSize: 16,
                        ),
                      ),
                      const SizedBox(height: 20),
                      // Email input field
                      buildTextField(
                        'Email',
                        false,
                        _emailController,
                        (value) {
                          if (value == null ||
                              value.isEmpty ||
                              !RegExp(r'^[^@]+@[^@]+\.[^@]+').hasMatch(value)) {
                            return 'Please enter a valid email';
                          }
                          return null;
                        },
                      ),
                      const SizedBox(height: 10),
                      // Name input field
                      buildTextField(
                        'Name',
                        false,
                        _nameController,
                        (value) {
                          if (value == null || value.isEmpty) {
                            return 'Please enter your name';
                          }
                          return null;
                        },
                      ),
                      const SizedBox(height: 10),
                      // Devices (SN and TokenID) fields
                      Column(
                        children: [
                          for (int i = 0; i < _deviceControllers.length; i++)
                            Row(
                              children: [
                                Expanded(
                                  child: buildTextField(
                                    'SN ${i + 1}',
                                    false,
                                    _deviceControllers[i]['sn']!,
                                    (value) {
                                      if (value == null || value.isEmpty) {
                                        return 'Please enter the SN';
                                      }
                                      return null;
                                    },
                                  ),
                                ),
                                const SizedBox(width: 8),
                                Expanded(
                                  child: buildTextField(
                                    'Token ID ${i + 1}',
                                    false,
                                    _deviceControllers[i]['tokenId']!,
                                    (value) {
                                      if (value == null || value.isEmpty) {
                                        return 'Please enter the Token ID';
                                      }
                                      return null;
                                    },
                                  ),
                                ),
                                const SizedBox(width: 8),
                                IconButton(
                                  onPressed: () => _removeDeviceField(i),
                                  icon: const Icon(Icons.remove_circle,
                                      color: Colors.red),
                                ),
                              ],
                            ),
                          const SizedBox(height: 10),
                          Align(
                            alignment: Alignment.centerRight,
                            child: ElevatedButton.icon(
                              onPressed: _addDeviceField,
                              icon: const Icon(Icons.add),
                              label: const Text('Add Device'),
                              style: ElevatedButton.styleFrom(
                                backgroundColor: Colors.green,
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 10),
                      // Password input field
                      buildTextField(
                        'Password',
                        true,
                        _passwordController,
                        (value) {
                          if (value == null || value.isEmpty || value.length < 6) {
                            return 'Password must be at least 6 characters long';
                          }
                          return null;
                        },
                      ),
                      const SizedBox(height: 10),
                      // Confirm Password input field
                      buildTextField(
                        'Confirm Password',
                        true,
                        _confirmPasswordController,
                        (value) {
                          if (value == null ||
                              value != _passwordController.text) {
                            return 'Passwords do not match';
                          }
                          return null;
                        },
                      ),
                      const SizedBox(height: 16),
                      // Submit Button
                      ElevatedButton(
                        onPressed: _submitForm,
                        style: ElevatedButton.styleFrom(
                          padding: const EdgeInsets.symmetric(
                              horizontal: 24, vertical: 12),
                          backgroundColor: Colors.blue,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(8),
                          ),
                        ),
                        child: const Text(
                          'Sign Up',
                          style: TextStyle(fontSize: 16),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget buildTextField(
    String label,
    bool obscureText,
    TextEditingController controller,
    String? Function(String?)? validator,
  ) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 0),
      child: TextFormField(
        controller: controller,
        obscureText: obscureText,
        decoration: InputDecoration(
          labelText: label,
          filled: true,
          fillColor: Colors.white.withOpacity(0.9),
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
          ),
        ),
        validator: validator,
      ),
    );
  }
}
