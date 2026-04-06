# 90-Day Transformation Tracker

A personal discipline tracker built in React for a strict 90-day plan covering **work performance**, **gym training**, **tech certification study**, **nutrition**, and **rest**. Designed for someone starting a new tech job with zero prior knowledge, weighing 127 kg at 187 cm, committed to changing their life in 90 days.

**Start Date:** April 7, 2026  
**End Date:** July 6, 2026

---

## The Plan

This isn't a generic habit tracker. Every screen in this app reflects a specific, realistic daily schedule built around these constraints:

| Detail | Value |
|---|---|
| Work hours | 9:00 AM – 6:00 PM, Monday – Friday |
| Commute | 20 min each way |
| Workout split | Mon Push / Tue Pull / Wed Active Recovery / Thu Push / Fri Pull |
| Diet | Two meals per day (11:00 AM + 6:30 PM). No snacking. No alcohol except special occasions. |
| Sleep | 8 hours minimum. Lights out by 10:00 PM. Wake at 6:00 AM. |
| Weekends | Saturday: 1 hr cert study + rest. Sunday: complete rest + weekly goal setting. |
| Weight | 127 kg / 187 cm — all exercises are low-impact, joint-friendly |

### The Three Phases

| Phase | Days | Focus |
|---|---|---|
| **1: Survival Mode** | 1–30 | Learn the vocabulary. Build a glossary. Ask one question per day. |
| **2: Pattern Recognition** | 31–60 | Practice tasks from memory. Connect what you do to why it matters. |
| **3: Building Speed** | 61–90 | Simulate tasks mentally. Create checklists. Teach what you know. |

### The "1-1-1" Weekly Goal System

Every Sunday evening, you define three goals for the upcoming week:

1. **One Job Skill** — a tiny, specific, measurable work task
2. **One Fitness Goal** — a small, achievable physical target
3. **One Personal Habit** — a non-negotiable discipline anchor

Goals are stored per week inside the app and persist across sessions.

---

## Features

- **Day-by-day view** — See one day at a time with its full schedule from wake-up (6:00 AM) to lights out. Not a wall of checkboxes — a guided daily experience.
- **Day navigation** — Previous/Next buttons to move between all 90 days. Jump to any day from the mini calendar.
- **Interactive schedule** — Click any time block to check it off. Completed items get struck through with a progress bar showing how much of today is done.
- **Workout card** — Shows the specific workout for the day (Push, Pull, Active Recovery, or Rest) with exercise descriptions tailored for 127 kg / low-impact.
- **Phase banner** — Tells you which learning phase you're in and what to focus on.
- **Weekly 1-1-1 Goals** — Set and edit your three goals per week. Saved independently for each week.
- **Journal & Notes** — Each day has its own text area for writing wins, reflections, and lessons learned.
- **90-Day mini calendar** — A grid overview of all 90 days. Green = fully completed, yellow = partially done, red outline = currently selected day. Click any day to jump to it.
- **Weekend schedules** — Saturday shows cert study + rest. Sunday shows complete rest + goal-setting. Different from weekdays.
- **Dark theme** — Clean, modern dark UI. Easy on the eyes at 6 AM and 9 PM.
- **localStorage persistence** — All progress, notes, and goals are saved in your browser automatically. No backend needed.
- **Responsive design** — Works on desktop and mobile.

---

## Daily Schedule (Weekday)

The app renders this exact sequence as clickable items each weekday:

```
06:00  Wake up. No snooze. Water. No phone 5 min.
06:05  Small snack: half a banana or 10 almonds.
06:10  Workout (40 min) — Push / Pull / Active Recovery per day.
06:50  Shower, dress, pack bag + lunch.
07:15  Commute. Passive learning: tech podcast, one earbud.
07:35  Arrive 10 min early. Review yesterday's journal question.
09:00  Deep Work Block 1. No phone, no social media.
11:00  First Meal (300-400 cal). Away from desk.
11:15  Continue deep work.
12:30  20-min break. Walk outside. No second meal.
12:50  20-Min Active Learning Block (cert prep or job skills).
13:10  Deep Work Block 2.
15:30  10-min break. Stand, stretch, hydrate.
15:40  Deep Work Block 3. Last 20 min: tidy notes, write 1 question.
18:00  Leave work. Exactly on time.
18:00  Commute home. Music or silence. No problem-solving.
18:30  Second Meal (600-800 cal). Sit. No screens.
18:50  Light chores (15 min max).
19:00  Complete rest (1.5 hrs). TV, fiction, hobby. NO work.
20:30  Journal: "What worked? One thing better tomorrow."
20:35  Prepare: workout clothes, bag, alarm.
21:00  Wind down. Dim lights. No screens. Paper book.
21:30  Lights out. 8+ hours sleep.
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or later)

### Install & Run

```bash
cd plan90-tracker-react
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
```

Generates a `build/` directory with optimized static files.

---

## Deployment (Vercel)

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) and sign in with GitHub
3. Click **"Add New Project"** → Import this repo
4. Vercel auto-detects React → Click **Deploy**
5. Bookmark the live URL on your phone and laptop

**Data is stored in your browser's localStorage.** Use the same browser on the same device every day. Clearing browser data will erase progress.

---

## Tech Stack

- **React 18** (Create React App)
- **CSS** (custom, no framework)
- **localStorage** for persistence
- No backend, no database, no dependencies beyond React

---

## Rules (Non-Negotiable)

These are built into the app's structure:

- Two meals a day. No snacking. Black coffee/tea only between meals.
- No alcohol on regular days. Special occasions only (max 1 drink, never alone, max 1x/month).
- No work after 6:00 PM. No checking email after commute.
- 1.5 hours of complete rest every evening. Protected like a meeting.
- 8 hours sleep. Lights out by 10:00 PM on weekdays.
- No workouts on weekends. Active rest only (walk, stretch).
- If exhausted: shorten the learning block, never shorten rest.

---

## Project Structure

```
plan90-tracker-react/
├── public/
│   └── index.html
├── src/
│   ├── App.js        # All app logic: schedule, goals, navigation, calendar
│   ├── App.css       # Dark theme styling
│   ├── index.js      # React entry point
│   └── index.css     # Base reset
├── package.json
└── README.md
```

---

## The Motto

> Rest is not a reward for working hard. Rest is the mechanism that turns work into skill.

**End Date: July 6, 2026. Show up at 6:00 AM. Every day. For 90 days.**
