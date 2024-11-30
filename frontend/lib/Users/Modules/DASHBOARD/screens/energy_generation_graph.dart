import 'package:fl_chart/fl_chart.dart';
import 'package:flutter/material.dart';

class EnergyGenerationGraph extends StatelessWidget {
  final List<Map<String, dynamic>> energyData;

  const EnergyGenerationGraph({required this.energyData, super.key});

  @override
  Widget build(BuildContext context) {
    return LineChart(
      LineChartData(
        gridData: const FlGridData(
          drawVerticalLine: true,
          verticalInterval: 2,
          horizontalInterval: 20,
          show: true,
        ),
        titlesData: FlTitlesData(
          leftTitles: AxisTitles(
            sideTitles: SideTitles(
              showTitles: true,
              interval: 20,
              getTitlesWidget: (value, meta) {
                return Text(
                  '${value.toInt()} kWh',
                  style: const TextStyle(fontSize: 12),
                );
              },
            ),
          ),
          bottomTitles: AxisTitles(
            sideTitles: SideTitles(
              showTitles: true,
              interval: 2,
              getTitlesWidget: (value, meta) {
                return Text(
                  '${value.toInt()}h',
                  style: const TextStyle(fontSize: 12),
                );
              },
            ),
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
        maxX: 24,
        minY: 0,
        maxY: energyData
            .map((e) => e['energy'] as double)
            .reduce((a, b) => a > b ? a : b),
        lineBarsData: [
          LineChartBarData(
            spots: energyData
                .map((e) => FlSpot(e['hour'] as double, e['energy'] as double))
                .toList(),
            isCurved: true,
            gradient: const LinearGradient(
              colors: [Colors.green, Colors.blue],
              begin: Alignment.topCenter,
              end: Alignment.bottomCenter,
            ),
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
          ),
        ],
      ),
    );
  }
}
