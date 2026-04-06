# 90‑Day Development Tracker

This React application helps you follow a 90‑day plan starting tomorrow. It offers a simple, interactive checklist for your daily work tasks, gym sessions, tech study sessions, weekly reviews, and red‑flag checks. The app automatically generates 90 days of checklists beginning the day after you first open it and stores your progress in your browser's local storage so you won't lose your data when you refresh or close the page.

## Features

- **Daily checklist** for five categories: Work, Gym, Tech Study, Weekly Review, and Red‑Flag.
- **Weekly review** checkboxes are only enabled every 7th day, so you can summarise each week without cluttering your daily view.
- **Gym schedule** labels (Push, Pull, Legs, Rest) based on the day of the week, matching the plan.
- **Progress summary** showing the number and percentage of tasks completed overall and for each category.
- **Responsive design** that works on desktop and mobile screens.
- **Local storage persistence**, so your selections are remembered across sessions.

## Getting Started

1. Ensure you have [Node.js](https://nodejs.org/) installed.
2. Install dependencies and start the development server:

```bash
cd plan90-tracker-react
npm install
npm start
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser to view the app.

## Building for Production

To create an optimised production build that you can deploy on services such as Vercel, run:

```bash
npm run build
```

This will generate a `build` directory with the static files ready for deployment.

## Deployment

You can deploy the contents of the `build` directory directly to any static hosting service, including [Vercel](https://vercel.com/). Vercel will automatically serve the `build` directory as a static site when configured.

## Customisation

Feel free to customise the styles and enhance the application by adding features such as note‑taking, notifications, or integration with other tools.
