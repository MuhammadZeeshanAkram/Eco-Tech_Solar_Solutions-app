// bottom_nav_bar.dart
import 'package:flutter/material.dart';
import 'package:water_drop_nav_bar/water_drop_nav_bar.dart';

class BottomNavBar extends StatefulWidget {
  final Function(int) onItemSelected;
  final int selectedIndex;

  const BottomNavBar({
    required this.onItemSelected,
    required this.selectedIndex,
    Key? key,
  }) : super(key: key);

  @override
  _BottomNavBarState createState() => _BottomNavBarState();
}

class _BottomNavBarState extends State<BottomNavBar> {
  @override
  Widget build(BuildContext context) {
    return WaterDropNavBar(
      backgroundColor: Colors.white,
      onItemSelected: (index) {
        widget.onItemSelected(index);
      },
      selectedIndex: widget.selectedIndex,
      barItems: [
        BarItem(
          filledIcon: Icons.dashboard,
          outlinedIcon: Icons.dashboard_outlined,
        ),
        BarItem(
          filledIcon: Icons.show_chart,
          outlinedIcon: Icons.show_chart_outlined,
        ),
        BarItem(
          filledIcon: Icons.account_circle,
          outlinedIcon: Icons.account_circle_outlined,
        ),
      ],
    );
  }
}
