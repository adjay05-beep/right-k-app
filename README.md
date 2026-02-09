# Right K App 👋

Welcome to the **Right K** application, an Expo-powered mobile app designed to help users navigate Korean visa requirements and life in Korea.

## 🏗️ Project Overview

- **Framework**: [Expo](https://expo.dev) 52 (SDK 52)
- **Styling**: [NativeWind](https://www.nativewind.dev) (v4)
- **Language**: TypeScript
- **Backend**: Firebase Auth/Firestore & OpenAI GPT-4o

## 🚀 Core Features

- **Visa Calculator**: Logic for calculating points and requirements for various Korean visas.
- **AI Chat**: GPT-4o powered chat for immigration and life-in-Korea queries.
- **Translation Services**: AI-powered translations with Firestore caching for performance.
- **Document Management**: Assistance with visa-related documentation.

## 🔑 Environment Setup

1. Create a `.env` file in the root directory.
2. Add your OpenAI API key:
   ```env
   EXPO_PUBLIC_OPENAI_API_KEY=your_openai_key_here
   ```
3. Configuration for Supabase and Firebase can be found in `utils/supabase.ts` and `utils/firebase.ts`.

## 📦 Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the app**:
   ```bash
   npx expo start
   ```

## 📂 Logic & Architecture Reference

For a detailed breakdown of the application logic, routing, and state management, please refer to the internal documentation:
- **Project Logic & Flow**: See the [ProjectOverview.md](PROJECT_OVERVIEW.md) (or refer to the AI-generated documentation artifact).

---

Developed with ❤️ for the Right K team.
