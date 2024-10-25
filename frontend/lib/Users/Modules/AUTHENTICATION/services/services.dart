import 'package:http/http.dart' as http;

class AuthService {
  // Base URL for your Node.js backend
  final String baseUrl = 'http://10.0.2.2:3000/api/v1';

  // Login with Email & Password
  Future<bool> loginWithEmail(String email, String password) async {
    final response = await http.post(
      Uri.parse('$baseUrl/login-with-email'),
      body: {'email': email, 'password': password},
    );
    
    if (response.statusCode == 200) {
      return true;
    } else {
      return false;
    }
  }

  // Login with Name & Password
  Future<bool> loginWithName(String name, String password) async {
    final response = await http.post(
      Uri.parse('$baseUrl/login-with-name'),
      body: {'name': name, 'password': password},
    );
    
    if (response.statusCode == 200) {
      return true;
    } else {
      return false;
    }
  }

  // Login with Mobile Number & Password
  Future<bool> loginWithMobile(String mobile, String password) async {
    final response = await http.post(
      Uri.parse('$baseUrl/login-with-mobile'),
      body: {'mobile': mobile, 'password': password},
    );
    
    if (response.statusCode == 200) {
      return true;
    } else {
      return false;
    }
  }
}
