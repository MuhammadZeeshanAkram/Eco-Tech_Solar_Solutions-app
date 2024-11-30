import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:frontend/Users/Modules/AUTHENTICATION/screens/login_screen.dart';
import 'dart:ui';

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
              ),
            ),
            // Black opacity gradient from bottom to center
            Positioned.fill(
              child: Container(
                decoration: const BoxDecoration(
                  gradient: LinearGradient(
                    colors: [
                      Colors.black54,
                      Colors.transparent,
                    ],
                    begin: Alignment.bottomCenter,
                    end: Alignment.center,
                  ),
                ),
              ),
            ),
            // Company Logo at the top
            Positioned(
              top: 20.h, // Adjusted for proper spacing
              left: 0,
              right: 0,
              child: Center(
                child: Image.asset(
                  'assets/company_logo/logo.png',
                  height: 80.h, // Smaller height
                  width: 80.w, // Smaller width
                ),
              ),
            ),
            // Logo Description below the logo
            Positioned(
              top: 120.h,
              left: 0,
              right: 0,
              child: Center(
                child: Padding(
                  padding: EdgeInsets.symmetric(horizontal: 16.w),
                  child: Text(
                    'Solar Energy Solutions.',
                    style: TextStyle(
                      fontSize: 14.sp, // Smaller font size
                      color: Colors.white70,
                    ),
                    textAlign: TextAlign.center,
                  ),
                ),
              ),
            ),
            // Centered Text with Manual Positioning
            Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  SizedBox(height: 180.h), // Adjusted for proper spacing
                  Padding(
                    padding: EdgeInsets.symmetric(horizontal: 16.w),
                    child: Text.rich(
                      TextSpan(
                        text: 'Powering ',
                        style: TextStyle(
                          fontSize: 20.sp, // Smaller font size
                          color: Colors.white,
                        ),
                        children: <TextSpan>[
                          TextSpan(
                            text: 'Tomorrow',
                            style: TextStyle(
                              fontWeight: FontWeight.bold,
                              fontSize: 20.sp, // Smaller font size
                              color: Colors.white,
                            ),
                          ),
                          TextSpan(
                            text: ' with ',
                            style: TextStyle(
                              fontSize: 20.sp,
                              color: Colors.white,
                            ),
                          ),
                          TextSpan(
                            text: 'Sunlight',
                            style: TextStyle(
                              fontWeight: FontWeight.bold,
                              fontSize: 20.sp, // Smaller font size
                              color: const Color.fromARGB(255, 182, 234, 113),
                            ),
                          ),
                        ],
                      ),
                      textAlign: TextAlign.center,
                    ),
                  ),
                  SizedBox(height: 10.h), // Reduced spacing
                  Padding(
                    padding: EdgeInsets.symmetric(horizontal: 16.w),
                    child: Text(
                      'Elevate your solar experience with real-time insights and effortless management.',
                      style: TextStyle(
                        fontSize: 12.sp, // Smaller font size
                        color: Colors.white70,
                      ),
                      textAlign: TextAlign.center,
                    ),
                  ),
                ],
              ),
            ),
            // Get Started Button
            Positioned(
              bottom: 20.h, // Adjusted bottom padding
              left: 16.w,
              right: 16.w,
              child: ClipRRect(
                borderRadius: BorderRadius.circular(15.r), // Dynamic border radius
                child: BackdropFilter(
                  filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
                  child: Container(
                    padding: EdgeInsets.symmetric(vertical: 8.h),
                    decoration: BoxDecoration(
                      color: Colors.black.withOpacity(0.3),
                      borderRadius: BorderRadius.circular(15.r),
                    ),
                    child: ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color.fromARGB(255, 182, 234, 113),
                        padding: EdgeInsets.symmetric(vertical: 12.h),
                      ),
                      onPressed: () {
                        // Navigate to Login Page
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => const LoginScreen(),
                          ),
                        );
                      },
                      child: Text(
                        'Get Started',
                        style: TextStyle(
                          fontSize: 14.sp, // Smaller font size
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
