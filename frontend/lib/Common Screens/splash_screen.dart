import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:frontend/Users/Modules/AUTHENTICATION/screens/login_screen.dart';
import 'dart:ui';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  int _currentIndex = 0;

  // Function to handle button taps and navigate to respective pages
  void _onItemTapped(int index) {
    setState(() {
      _currentIndex = index;
    });

    if (index == 0) {
      // Navigate to Guest Login Page
      Navigator.push(
        context,
        MaterialPageRoute(builder: (context) => const LoginScreen()),
      );
    } 
  }

  @override
  Widget build(BuildContext context) {
    TextTheme textTheme = Theme.of(context).textTheme;

    return Scaffold(
      body: SafeArea(
        child: Stack(
          children: [
            // Background Image
            Positioned.fill(
              child: Image.asset(
                'assets/background image/backgroundImage.png',
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
                    stops: const [
                      0.0,
                      0.3,
                      0.6,
                      0.4,
                    ],
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
                        color: const Color.fromARGB(24, 0, 0, 0).withOpacity(0.2),
                      ),
                    ],
                  ),
                  child: Image.asset(
                    'assets/company logo/logo.png',
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
                    style: textTheme.headlineSmall?.copyWith(
                        color: const Color.fromARGB(255, 15, 15, 15),
                        fontSize: 18.sp),
                    textAlign: TextAlign.center,
                    
                  ),
                  
                ),
                
              ),
              
            ),
            SizedBox(height: 410.h),
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
                        style: textTheme.headlineMedium?.copyWith(
                          fontSize: 30.sp,
                        ),
                        children: <TextSpan>[
                          TextSpan(
                            text: 'Tomorrow',
                            style: textTheme.headlineMedium!.copyWith(
                              fontWeight: FontWeight.bold,
                              fontSize: 30.sp,
                            ),
                          ),
                          TextSpan(
                            text: ' with ',
                            style: textTheme.headlineMedium?.copyWith(
                              fontSize: 30.sp,
                            ),
                            
                          ),
                          TextSpan(
                            text: 'Sunlight',
                            style: textTheme.headlineMedium!.copyWith(
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
                      style: textTheme.titleLarge?.copyWith(
                        fontSize: 16.sp,
                      ),
                      textAlign: TextAlign.center,
                    ),
                  ),
                  SizedBox(height: 100.h),
                ],
              ),
            ),
            // Positioned Bottom Navigation Bar with Blurred Background
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
                    child: BottomNavigationBar(
                      backgroundColor: Colors.transparent,
                      items: const <BottomNavigationBarItem>[
                        BottomNavigationBarItem(
                          icon: Icon(Icons.person_outline),
                          label: 'Login as Guest',
                        ),
                        BottomNavigationBarItem(
                          icon: Icon(Icons.admin_panel_settings_outlined),
                          label: 'Login as Admin',
                        ),
                      ],
                      currentIndex: _currentIndex,
                      selectedItemColor: const Color.fromARGB(255, 182, 234, 113),
                      unselectedItemColor: Colors.white,
                      onTap: _onItemTapped,
                      elevation: 0,
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
