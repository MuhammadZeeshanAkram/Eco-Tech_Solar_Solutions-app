import 'package:adaptive_theme/adaptive_theme.dart';
import 'package:flutter/material.dart';

class ThemeToggleButton extends StatelessWidget {
  const ThemeToggleButton({super.key});

  @override
  Widget build(BuildContext context) {
    return IconButton(
      icon: const Icon(Icons.brightness_6), // Icon for toggle
      onPressed: () {
        // Toggle between light and dark themes
        AdaptiveTheme.of(context).toggleThemeMode();
      },
    );
  }
}
