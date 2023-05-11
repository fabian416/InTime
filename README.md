InTime
## Overview
This is my first Android mobile app development project and I made it for personal use. The app is designed to track the time a user spends at work. The user grants location permissions to the app, and the app starts a timer once the user enters a predefined radius around their workplace. The timer stops when the user leaves the radius, thus calculating the work time.

Currently, the coordinates and radius are hardcoded in the app.tsx file. However, I am planning to add a feature that will allow users to input their own coordinates and set the radius directly from the application's interface

## How does it work?
The application uses the location permissions granted by the user to track their location. When the user's location is within a predefined radius around their workplace, a timer begins. The timer stops when the user's location is outside of the radius. This allows the application to calculate the time spent at work.

## How to compile and run the project
Ensure you have the React Native development environment set up on your system.
Clone this repository on your local machine.
Navigate to the project folder and run npm install to install all the necessary dependencies.
Ensure you have an Android emulator running or an Android device connected to your machine.
Run npx react-native run-android to compile and run the application.
Please note that this application is designed for Android 10.0 and previous versions.
