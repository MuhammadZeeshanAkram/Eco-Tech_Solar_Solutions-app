import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

//kPadding+Margin
const KpaddingMargin=EdgeInsets.all(20);

TextTheme _textTheme =TextTheme( 
   displayLarge: GoogleFonts.ubuntu(    fontSize: 10,    fontWeight: FontWeight.w300,    letterSpacing: -1.5  ),  
   displayMedium: GoogleFonts.ubuntu(    fontSize: 62,    fontWeight: FontWeight.w300,    letterSpacing: -0.5  ), 
    displaySmall: GoogleFonts.whisper(    fontSize: 20,    fontWeight: FontWeight.w400  ),  
    headlineMedium: GoogleFonts.ubuntu(    fontSize: 35,    fontWeight: FontWeight.w400,    letterSpacing: 0.25  ), 
     headlineSmall: GoogleFonts.roboto(    fontSize: 25,    fontWeight: FontWeight.w700  ), 
      titleLarge: GoogleFonts.roboto(    fontSize: 21,    fontWeight: FontWeight.w300,    letterSpacing: 0.15  ),  
      titleMedium: GoogleFonts.whisper(    fontSize: 16,    fontWeight: FontWeight.w400,    letterSpacing: 0.15  ),  
      titleSmall: GoogleFonts.roboto(    fontSize: 18,    fontWeight: FontWeight.w500,    letterSpacing: 0.1  ),
      bodyLarge: GoogleFonts.roboto(    fontSize: 25,    fontWeight: FontWeight.w400,    letterSpacing: 0.7  ), 
       bodyMedium: GoogleFonts.roboto(    fontSize: 14,    fontWeight: FontWeight.w400,    letterSpacing: 0.25  ), 
        labelLarge: GoogleFonts.roboto(    fontSize: 14,    fontWeight: FontWeight.w500,    letterSpacing: 1.25  ),  
        bodySmall: GoogleFonts.roboto(    fontSize: 12,    fontWeight: FontWeight.w400,    letterSpacing: 0.4  ), 
         labelSmall: GoogleFonts.roboto(    fontSize: 10,    fontWeight: FontWeight.w400,    letterSpacing: 1.5  ),);