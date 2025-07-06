# Expense Tracker App

A modern multiplatform expense tracking application built with React Native and Expo. This app helps users track and manage their expenses efficiently with intuitive visualizations and comprehensive reporting.

**Note: This is an ongoing project under active development.**

## Screenshot
[ON GOING]

## Features

- **Expense Tracking**: Log and categorize your daily expenses
- **Visual Analytics**: View your spending patterns through interactive charts and graphs
- **Budget Management**: Set and monitor spending limits for different categories
- **Multi-platform Support**: Works seamlessly on iOS, and Android
- **Biometric Authentication**: Secure your financial data with fingerprint/face recognition

## Tech Stack

- **Frontend**: React Native, Expo Router
- **State Management**: React Context API
- **UI Components**: React Native Paper, Victory Native (for charts)
- **Authentication**: Expo SecureStore, Expo LocalAuthentication
- **Navigation**: Expo Router v5.1.0
- **Styling**: Styled Components, React Native StyleSheet

## Architecture

The app follows a feature-based architecture with the following structure:

- **features/**: Contains feature-specific components and logic
  - **/home**: Home screen components and related files
  - **/transactions**: Transaction management components
  - **/analytics**: Data visualization and reporting components
  - **/settings**: User preferences and app configuration
- **util/**: Shared utilities, widgets, and helper functions
- **assets/**: Images, fonts, and other static resources
- **services/**: API integrations and data services

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Expo CLI

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/expense-tracker.git
   cd expense-tracker
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server
   ```bash
   npx expo start
   ```

4. Run on your preferred platform
   - Press `a` for Android
   - Press `i` for iOS

## Platform Support

- iOS 13.0+
- Android API level 21+
- Web (modern browsers)

## Project Structure

```
expense-tracker/
├── app/                    # Main application code
│   ├── (features)/         # Feature-based components
│   │   ├── (tabs)/         # Tab navigation components
│   │   │   ├── home/       # Home screen components
│   │   │   ├── analytics/  # Analytics screen components
│   │   │   └── settings/   # Settings screen components
│   ├── util/               # Utility functions and shared components
│   │   ├── widgets/        # Reusable UI components
│   │   └── helpers/        # Helper functions
├── assets/                 # Static assets
├── app.json                # Expo configuration
└── package.json            # Dependencies and scripts
```
