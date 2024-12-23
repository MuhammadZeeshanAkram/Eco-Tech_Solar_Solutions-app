import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:flutter/cupertino.dart';
import 'package:frontend/Users/Modules/DASHBOARD/screens/energy_generation_graph.dart';
import 'bottom_nav_bar.dart'; // Import the bottom navbar
import 'package:shared_preferences/shared_preferences.dart'; // Account details screen
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'profile.dart'; // Import profile screen

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  _HomeScreenState createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _selectedIndex = 0; // Index for bottom navbar
  List<dynamic> _devices = []; // List of devices
  String? _selectedDeviceSN; // Selected device SN
  Map<String, dynamic>? _deviceData; // Data for the selected device
  List<Map<String, dynamic>> _graphData = []; // Data for the graph
  bool _isLoading = false;
  String? _userName; // User's name

  @override
  void initState() {
    super.initState();
    _fetchUserName();
    _fetchDevices();
  }

  // Fetch user's name from the backend
  Future<void> _fetchUserName() async {
    const url = 'http://192.168.18.164:5000/api/auth/user-info';
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('jwt_token'); // Retrieve stored token

      if (token == null) {
        throw Exception('No JWT token found');
      }

      final response = await http.get(
        Uri.parse(url),
        headers: {'Authorization': 'Bearer $token'},
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        setState(() {
          _userName = data['name']; // Assign user's name
        });
      } else {
        throw Exception('Failed to fetch user info. Status code: ${response.statusCode}');
      }
    } catch (error) {
      print('Error fetching user info: $error');
    }
  }

  // Fetch devices from the backend
  Future<void> _fetchDevices() async {
    const url = 'http://192.168.18.164:5000/api/auth/user-devices';
    setState(() => _isLoading = true);

    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('jwt_token'); // Retrieve stored token

      if (token == null) {
        throw Exception('No JWT token found');
      }

      final response = await http.get(
        Uri.parse(url),
        headers: {'Authorization': 'Bearer $token'},
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        setState(() {
          _devices = data['devices'];
          _selectedDeviceSN = _devices.isNotEmpty ? _devices.first['sn'] : null;
          if (_selectedDeviceSN != null) {
            _fetchDeviceData(_selectedDeviceSN!);
          }
          _isLoading = false;
        });
      } else {
        throw Exception('Failed to fetch devices. Status code: ${response.statusCode}');
      }
    } catch (error) {
      print('Error fetching devices: $error');
      setState(() => _isLoading = false);
    }
  }

  // Fetch real-time data for the selected device
  Future<void> _fetchDeviceData(String sn) async {
    const url = 'http://192.168.18.164:5000/api/solar/realtime-data';
    setState(() => _isLoading = true);

    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('jwt_token'); // Retrieve stored token

      if (token == null) {
        throw Exception('No JWT token found');
      }

      final response = await http.get(
        Uri.parse('$url?deviceSN=$sn'),
        headers: {'Authorization': 'Bearer $token'},
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        setState(() {
          _deviceData = data['data'];
          _graphData = _generateGraphData(); // Generate graph data based on the device data
          _isLoading = false;
        });
      } else {
        throw Exception('Failed to fetch device data. Status code: ${response.statusCode}');
      }
    } catch (error) {
      print('Error fetching device data: $error');
      setState(() => _isLoading = false);
    }
  }

  // Generate graph data from device data
  List<Map<String, dynamic>> _generateGraphData() {
    if (_deviceData == null) return [];

    // Mock graph data based on device data
    return List.generate(
      24,
      (index) => {
        'hour': index,
        'energy': (_deviceData!['acpower'] ?? 0) * (index % 5 + 1) / 10.0, // Example calculation
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    List<Widget> screens = [
      // Screen for Square Boxes
      _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _selectedDeviceSN == null
              ? const Center(
                  child: Text(
                    'Please select a device to view data',
                    style: TextStyle(color: Colors.white, fontSize: 16),
                  ),
                )
              : _deviceData != null
                  ? GridView.builder(
                      padding: const EdgeInsets.all(12),
                      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                        crossAxisCount: 2, // Two items per row
                        crossAxisSpacing: 12, // Spacing between columns
                        mainAxisSpacing: 12, // Spacing between rows
                        childAspectRatio: 1, // Make boxes square
                      ),
                      itemCount: _deviceData!.length,
                      itemBuilder: (context, index) {
                        final entry = _deviceData!.entries.elementAt(index);
                        return Card(
                          color: Colors.white.withOpacity(0.2),
                          elevation: 4,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: Padding(
                            padding: const EdgeInsets.all(20),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Text(
                                  entry.key,
                                  style: const TextStyle(
                                    fontWeight: FontWeight.bold,
                                    fontSize: 16,
                                    color: Colors.white,
                                  ),
                                ),
                                const SizedBox(height: 8),
                                Text(
                                  entry.value.toString(),
                                  style: const TextStyle(
                                    fontSize: 18,
                                    fontWeight: FontWeight.bold,
                                    color: Color.fromARGB(255, 8, 8, 8),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        );
                      },
                    )
                  : const Center(
                      child: Text(
                        'No data available for the selected device',
                        style: TextStyle(color: Colors.white),
                      ),
                    ),

      // Graph Screen
      EnergyGenerationGraph(energyData: _graphData),

      // Profile Screen
      const ProfileScreen(),
    ];

    return Scaffold(
      appBar: AppBar(
        automaticallyImplyLeading: false,
        title: const Text(
          'Solar System Monitoring',
          style: TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.bold,
            color: Colors.white,
          ),
        ),
        backgroundColor: const Color.fromARGB(255, 22, 69, 163),
        actions: [
          if (_devices.isNotEmpty)
            DropdownButton<String>(
              value: _selectedDeviceSN,
              dropdownColor: const Color.fromARGB(255, 28, 68, 155),
              underline: const SizedBox(),
              items: _devices.map<DropdownMenuItem<String>>((device) {
                return DropdownMenuItem<String>(
                  value: device['sn'],
                  child: Text(
                    device['sn'],
                    style: const TextStyle(color: Color.fromARGB(255, 245, 245, 245), fontSize: 14),
                  ),
                );
              }).toList(),
              onChanged: (value) {
                setState(() {
                  _selectedDeviceSN = value;
                  if (value != null) {
                    _fetchDeviceData(value);
                  }
                });
              },
            ),
        ],
      ),
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            colors: [Color.fromARGB(255, 125, 173, 241), Color.fromARGB(255, 34, 59, 170), Colors.green],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Padding(
              padding: const EdgeInsets.all(16.0),
              child: Text(
                _userName != null ? 'Hi, $_userName!' : 'Loading...',
                style: const TextStyle(
                  fontSize: 30,
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                ),
              ),
            ),
            Expanded(
              child: IndexedStack(
                index: _selectedIndex,
                children: screens,
              ),
            ),
          ],
        ),
      ),
      bottomNavigationBar: BottomNavBar(
        selectedIndex: _selectedIndex,
        onItemSelected: (index) {
          setState(() {
            _selectedIndex = index;
          });
        },
      ),
    );
  }
}
