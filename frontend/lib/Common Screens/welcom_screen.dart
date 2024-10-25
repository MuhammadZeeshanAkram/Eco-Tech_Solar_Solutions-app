import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:frontend/Users/Modules/AUTHENTICATION/screens/login_screen.dart';
import 'dart:ui';
import 'package:frontend/constants.dart'; // Import the constants.dart file

class WelcomeScreen extends StatefulWidget {
  const WelcomeScreen({super.key});

  @override
  State<WelcomeScreen> createState() => _WelcomeScreenState();
}

class _WelcomeScreenState extends State<WelcomeScreen> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Stack(
          children: [
            // Background Image
            Positioned.fill(
              child: Image.asset(
                'assets/background_image/backgroundImage.png',
                fit: BoxFit.cover,
                height: 1.sh,
                width: 1.sw,
              ),
            ),
            // Black opacity gradient from bottom to center
            Positioned.fill(
              child: Container(
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [
                      const Color.fromARGB(61, 0, 0, 0).withOpacity(0.3),
                      const Color.fromARGB(137, 0, 0, 0).withOpacity(0.6),
                      const Color.fromARGB(47, 0, 0, 0).withOpacity(0.2),
                      const Color.fromARGB(75, 0, 0, 0),
                    ],
                    begin: Alignment.bottomCenter,
                    end: Alignment.center,
                    stops: const [0.0, 0.3, 0.6, 0.4],
                  ),
                ),
              ),
            ),
            // Company Logo at the top
            Positioned(
              top: 5.h,
              left: 0,
              right: 0,
              child: Center(
                child: Container(
                  decoration: BoxDecoration(
                    boxShadow: [
                      BoxShadow(
                        color:
                            const Color.fromARGB(24, 0, 0, 0).withOpacity(0.2),
                      ),
                    ],
                  ),
                  child: Image.asset(
                    'assets/company_logo/logo.png',
                    height: 200.h,
                    width: 100.w,
                  ),
                ),
              ),
            ),
            // Logo Description below the logo
            Positioned(
              top: 150.h,
              left: 0,
              right: 0,
              child: Center(
                child: Padding(
                  padding: EdgeInsets.symmetric(horizontal: 20.w),
                  child: Text(
                    'Solar Energy Solutions.',
                    style: appTextTheme.headlineSmall?.copyWith(
                      color: const Color.fromARGB(255, 15, 15, 15),
                      fontSize: 18.sp,
                    ),
                    textAlign: TextAlign.center,
                  ),
                ),
              ),
            ),
            // Centered Text with Manual Positioning
            Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.start,
                children: [
                  SizedBox(height: 410.h),
                  Padding(
                    padding: EdgeInsets.symmetric(horizontal: 16.w),
                    child: Text.rich(
                      TextSpan(
                        text: 'Powering ',
                        style: appTextTheme.headlineMedium?.copyWith(
                          fontSize: 30.sp,
                          color: const Color.fromARGB(255, 247, 245, 245),
                        ),
                        children: <TextSpan>[
                          TextSpan(
                            text: 'Tomorrow',
                            style: appTextTheme.headlineMedium!.copyWith(
                              fontWeight: FontWeight.bold,
                              fontSize: 30.sp,
                            ),
                          ),
                          TextSpan(
                            text: ' with ',
                            style: appTextTheme.headlineMedium?.copyWith(
                              fontSize: 30.sp,
                            ),
                          ),
                          TextSpan(
                            text: 'Sunlight',
                            style: appTextTheme.headlineMedium!.copyWith(
                              fontWeight: FontWeight.bold,
                              color: const Color.fromARGB(255, 182, 234, 113),
                              fontSize: 30.sp,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                  SizedBox(height: 10.h),
                  Padding(
                    padding: EdgeInsets.symmetric(horizontal: 20.w),
                    child: Text(
                      'Elevate your solar experience with real-time insights and effortless management.',
                      style: appTextTheme.titleLarge?.copyWith(
                        fontSize: 16.sp,
                        color: const Color.fromARGB(255, 247, 245, 245),
                      ),
                      textAlign: TextAlign.center,
                    ),
                  ),
                  SizedBox(height: 100.h),
                ],
              ),
            ),
            // Positioned Button instead of BottomNavigationBar
            Positioned(
              bottom: 30.h,
              left: 16.w,
              right: 16.w,
              child: ClipRRect(
                borderRadius: BorderRadius.circular(20.0),
                child: BackdropFilter(
                  filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
                  child: Container(
                    padding: EdgeInsets.symmetric(vertical: 10.h),
                    decoration: BoxDecoration(
                      color: Colors.black.withOpacity(0.2),
                      borderRadius: BorderRadius.circular(20.0),
                    ),
                    child: ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color.fromARGB(255, 182, 234, 113),
                        padding: EdgeInsets.symmetric(vertical: 15.h),
                      ),
                      onPressed: () {
                        // Navigate to Guest Login Page
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                              builder: (context) => const LoginScreen()),
                        );
                      },
                      child: Text(
                        'Get Started',
                        style: TextStyle(
                          fontSize: 18.sp,
                          color: Colors.white,
                        ),
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
