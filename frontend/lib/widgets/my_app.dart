import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:frontend/Common%20Screens/welcom_screen.dart';
import 'package:frontend/Users/Modules/AUTHENTICATION/screens/login_screen.dart';
import 'package:device_preview/device_preview.dart';
import 'package:frontend/Users/Modules/AUTHENTICATION/screens/signup_screen.dart';
import 'package:frontend/Users/Modules/DASHBOARD/screens/profile.dart';

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return DevicePreview(
      enabled: !kReleaseMode,
      builder: (context) {
        return ScreenUtilInit(
          designSize: const Size(360, 690),
          minTextAdapt: true,
          splitScreenMode: true,
          builder: (_, child) {
            return MaterialApp(
              debugShowCheckedModeBanner: false,
              title: 'Multiple Screens App',
              locale: DevicePreview.locale(context), // Set the locale for device preview
              builder: DevicePreview.appBuilder, // Use Device Preview's app builder
              theme: ThemeData(
                primarySwatch: Colors.blue,
                textTheme: Typography.englishLike2018.apply(fontSizeFactor: 1.sp),
              ),
              initialRoute: '/', // Start with the Welcome screen
              routes: {
                '/': (context) => const WelcomeScreen(), // Welcome screen
                '/login': (context) => const LoginScreen(), // Login screen
                '/signup': (context) => const SignUpScreen(), // Signup screen (example reuse)
                '/profile': (context) => const ProfileScreen(), // Profile screen
              },
            );
          },
        );
      },
    );
  }
}
