import 'package:flutter/material.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:fl_chart/fl_chart.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  _HomeScreenState createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  Map<String, dynamic>? solarData;
  bool isLoading = true;

  @override
  void initState() {
    super.initState();
    fetchSolarData();
  }

  Future<void> fetchSolarData() async {
    try {
      // Replace with your backend IP or domain
      final response = await http.get(Uri.parse('http://192.168.18.164:5000/api/realtime-data'));

      if (response.statusCode == 200) {
        final responseData = json.decode(response.body);

        if (responseData['success'] == true) {
          setState(() {
            solarData = responseData['result'];
            isLoading = false;
          });
        } else {
          throw Exception('Failed to load data: ${responseData['exception']}');
        }
      } else {
        throw Exception('Failed to load data: HTTP ${response.statusCode}');
      }
    } catch (error) {
      print('Error fetching data: $error');
      setState(() {
        isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: [
          // Background gradient for an eye-catching look
          Container(
            decoration: const BoxDecoration(
              gradient: LinearGradient(
                colors: [Colors.blueAccent, Colors.greenAccent],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
            ),
          ),
          // Main content
          SafeArea(
            child: SingleChildScrollView(
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // App title
                    const Text(
                      'Solar Monitoring Dashboard',
                      style: TextStyle(
                        fontSize: 28,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                    const SizedBox(height: 20),

                    // Show loading spinner while data is fetched
                    if (isLoading)
                      const Center(
                        child: CircularProgressIndicator(),
                      )
                    else if (solarData != null) ...[
                      // Display fetched data in a clean grid format
                      GridView.count(
                        crossAxisCount: 2,
                        crossAxisSpacing: 16,
                        mainAxisSpacing: 16,
                        shrinkWrap: true,
                        physics: const NeverScrollableScrollPhysics(),
                        children: [
                          buildInfoCard('Current Power', '${solarData?["acpower"] ?? "N/A"} W', Colors.green),
                          buildInfoCard('Production Today', '${solarData?["yieldtoday"] ?? "N/A"} kWh', Colors.blue),
                          buildInfoCard('Total Production', '${solarData?["yieldtotal"] ?? "N/A"} kWh', Colors.blue),
                          buildInfoCard('Feed-in Power', '${solarData?["feedinpower"] ?? "N/A"} W', Colors.orange),
                          buildInfoCard('Feed-in Energy', '${solarData?["feedinenergy"] ?? "N/A"} kWh', Colors.orange),
                          buildInfoCard('Battery Power', '${solarData?["batPower"] ?? "No Data"} W', Colors.purple),
                          buildInfoCard('Power DC1', '${solarData?["powerdc1"] ?? "N/A"} W', Colors.teal),
                          buildInfoCard('Inverter Status', '${solarData?["inverterStatus"] ?? "N/A"}', Colors.red),
                          buildInfoCard('Last Upload Time', '${solarData?["uploadTime"] ?? "N/A"}', Colors.teal),
                        ],
                      ),
                      const SizedBox(height: 20),

                      // Graphical Representation
                      // Graphical Representation
// Graphical Representation
Card(
  color: Colors.white.withOpacity(0.9),
  elevation: 4,
  shape: RoundedRectangleBorder(
    borderRadius: BorderRadius.circular(15),
  ),
  child: const Padding(
    padding: EdgeInsets.all(20),
    child: SizedBox(
      height: 300,
      child: GraphPainter(
        graphData: [
          FlSpot(0, 10),
          FlSpot(2, 30),
          FlSpot(4, 50),
          FlSpot(6, 80),
          FlSpot(8, 60),
          FlSpot(10, 40),
          FlSpot(12, 20),
        ], // Replace with real-time data if available
      ),
    ),
  ),
),



                      const SizedBox(height: 20),
                    ] else
                      const Center(
                        child: Text(
                          'Failed to load data',
                          style: TextStyle(color: Colors.white),
                        ),
                      ),
                    const SizedBox(height: 20),

                    // Check the Plant Button
                    Center(
                      child: ElevatedButton(
                        onPressed: () {
                          // Navigate to check the plant screen
                        },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.blue,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                          padding: const EdgeInsets.symmetric(horizontal: 30, vertical: 15),
                        ),
                        child: const Text(
                          'Check the Plant',
                          style: TextStyle(fontSize: 18),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  // Helper function to create info cards
  Widget buildInfoCard(String title, String value, Color valueColor) {
    return Card(
      color: Colors.white.withOpacity(0.9),
      elevation: 4,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(15),
      ),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              title,
              textAlign: TextAlign.center,
              style: const TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              value,
              textAlign: TextAlign.center,
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: valueColor,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// Custom painter for the energy generation graph
class GraphPainter extends StatelessWidget {
  final List<FlSpot> graphData;

  const GraphPainter({required this.graphData, super.key});

  @override
  Widget build(BuildContext context) {
    return LineChart(
      LineChartData(
        gridData: const FlGridData(
          show: true,
          drawHorizontalLine: true,
          drawVerticalLine: true,
          horizontalInterval: 20, // Adjust spacing for horizontal grid lines
          verticalInterval: 2, // Adjust spacing for vertical grid lines
        ),
        titlesData: FlTitlesData(
          leftTitles: AxisTitles(
            sideTitles: SideTitles(
              showTitles: true,
              reservedSize: 50, // Increase reserved size to avoid clipping
              getTitlesWidget: (value, meta) {
                if (value % 20 == 0) {
                  return Padding(
                    padding: const EdgeInsets.only(right: 8.0), // Add margin for better alignment
                    child: Text(
                      '${value.toInt()} W',
                      style: const TextStyle(fontSize: 12),
                    ),
                  );
                }
                return const SizedBox(); // Skip intermediate labels
              },
            ),
          ),
          rightTitles: const AxisTitles(
            sideTitles: SideTitles(showTitles: false), // Hide right-side labels
          ),
          bottomTitles: AxisTitles(
            sideTitles: SideTitles(
              showTitles: true,
              reservedSize: 30, // Add reserved size for bottom alignment
              getTitlesWidget: (value, meta) {
                if (value % 2 == 0) {
                  return Padding(
                    padding: const EdgeInsets.only(top: 8.0), // Add margin for spacing
                    child: Text(
                      '${value.toInt()}h',
                      style: const TextStyle(fontSize: 12),
                    ),
                  );
                }
                return const SizedBox(); // Skip intermediate labels
              },
            ),
          ),
          topTitles: const AxisTitles(
            sideTitles: SideTitles(showTitles: false), // Hide top-side labels
          ),
        ),
        borderData: FlBorderData(
          show: true,
          border: const Border(
            left: BorderSide(color: Colors.black, width: 1),
            bottom: BorderSide(color: Colors.black, width: 1),
          ),
        ),
        minX: 0,
        maxX: 12, // Adjust according to your data's x-axis range
        minY: 0,
        maxY: graphData.isNotEmpty
            ? graphData.map((e) => e.y).reduce((a, b) => a > b ? a : b) + 10
            : 100, // Add padding to the max value
        lineBarsData: [
          LineChartBarData(
            spots: graphData,
            isCurved: true,
            barWidth: 4,
            belowBarData: BarAreaData(
              show: true,
              gradient: LinearGradient(
                colors: [
                  Colors.green.withOpacity(0.3),
                  Colors.blue.withOpacity(0.1),
                ],
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
              ),
            ),
            gradient: const LinearGradient(
              colors: [Colors.green, Colors.blue],
              begin: Alignment.topCenter,
              end: Alignment.bottomCenter,
            ),
          ),
        ],
      ),
    );
  }
}