import 'package:flutter/material.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

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
          SingleChildScrollView(
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

                  // Current Production Power Card
                  buildInfoCard('Current Production Power', '5.4 kW', Colors.green),
                  const SizedBox(height: 20),

                  // Monthly Production and Production Today Cards
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Expanded(
                        child: buildInfoCard('Production Today', '25 kWh', Colors.blue),
                      ),
                      const SizedBox(width: 20),
                      Expanded(
                        child: buildInfoCard('Monthly Production', '800 kWh', Colors.blue),
                      ),
                    ],
                  ),
                  const SizedBox(height: 20),

                  // Anticipated Yield Card
                  buildInfoCard('Anticipated Yield This Month', '950 kWh', Colors.orange),
                  const SizedBox(height: 20),

                  // Graphical Representation
                  Card(
                    color: Colors.white.withOpacity(0.9),
                    elevation: 4,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(15),
                    ),
                    child: Padding(
                      padding: const EdgeInsets.all(20),
                      child: SizedBox(
                        height: 200,
                        child: CustomPaint(
                          painter: GraphPainter(),
                          child: const Center(child: Text('Energy Generation Graph')),
                        ),
                      ),
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
        ],
      ),
    );
  }

  // Helper function to create info cards
  Widget buildInfoCard(String title, String value, Color valueColor) {
    return Card(
      color: Colors.white.withOpacity(0.8),
      elevation: 4,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(15),
      ),
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          children: [
            Text(
              title,
              style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 10),
            Text(
              value,
              style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: valueColor),
            ),
          ],
        ),
      ),
    );
  }
}

// Custom painter for the energy generation graph
class GraphPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    // Example implementation of a simple line graph
    final paint = Paint()
      ..color = Colors.green
      ..style = PaintingStyle.fill;

    // Draw a mock line graph
    canvas.drawLine(Offset(0, size.height - 20), Offset(size.width, size.height - 50), paint);
    // You can add more lines and shapes to represent data here
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) {
    return false;
  }
}
