# Pomodoro Productivity Tracker

A modern Pomodoro timer application built with React, TypeScript, and Tailwind CSS. Track your productivity sessions, categorize them by activity type (work, learn, rest), and review your progress through an interactive calendar.

## Features

- **25-Minute Pomodoro Timer**: Focus on your tasks with the classic Pomodoro technique
- **Activity Categorization**: Organize sessions by work, learn, or rest
- **Calendar View**: Visualize your productivity patterns with an interactive monthly calendar
- **Statistics Dashboard**: Track daily, weekly, and monthly statistics
- **Streak Tracking**: Maintain your productivity streak
- **Local Storage**: All data persists locally in your browser

## Tech Stack

- **React** + **TypeScript** for type-safe component development
- **Vite** as the build tool for fast development experience
- **Tailwind CSS** for utility-first styling
- **shadcn/ui** for accessible, customizable UI components
- **date-fns** for date manipulation utilities

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173/](http://localhost:5173/) to view the app in your browser.

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Usage

1. **Select Activity Type**: Choose between Work, Learn, or Rest
2. **Start Timer**: Click the Start button to begin a 25-minute session
3. **Pause/Resume**: Control your session with pause and resume buttons
4. **Complete Sessions**: When the timer reaches zero, your session is automatically saved
5. **View History**: Click on calendar days to see detailed session information
6. **Track Progress**: Monitor your productivity stats in the dashboard

## Data Storage

All data is stored locally in your browser's localStorage. Your data never leaves your device.

## License

MIT
