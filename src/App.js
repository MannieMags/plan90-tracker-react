import React, { useState, useEffect, useMemo } from 'react';
import './App.css';

// ── CONSTANTS ──────────────────────────────────────────────
const START_DATE = new Date('2026-04-07T00:00:00');

const GYM_SCHEDULE = {
  0: { name: 'Rest Day', type: 'rest', desc: 'No workout. Active rest only: walk, stretch, light hike.' },
  1: { name: 'Push Day', type: 'push', desc: 'Machine chest press, seated dumbbell shoulder press, triceps pushdown. Low impact, focus on form.' },
  2: { name: 'Pull Day', type: 'pull', desc: 'Lat pulldown, seated cable row, bicep curls. Low impact, focus on form.' },
  3: { name: 'Active Recovery', type: 'recovery', desc: '20-min walk + full body stretching. No weights today.' },
  4: { name: 'Push Day', type: 'push', desc: 'Machine chest press, seated dumbbell shoulder press, triceps pushdown. Low impact, focus on form.' },
  5: { name: 'Pull Day', type: 'pull', desc: 'Lat pulldown, seated cable row, bicep curls. Low impact, focus on form.' },
  6: { name: 'Rest Day', type: 'rest', desc: 'No workout. Full rest. 30-min walk if you feel like it.' },
};

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function getPhase(dayNum) {
  if (dayNum <= 30) return { num: 1, name: 'Survival Mode', focus: 'Learn the vocabulary. Build your glossary. Ask one question per day.' };
  if (dayNum <= 60) return { num: 2, name: 'Pattern Recognition', focus: 'Practice tasks from memory. Connect what you do to why it matters.' };
  return { num: 3, name: 'Building Speed', focus: 'Simulate tasks mentally. Create checklists. Teach what you know.' };
}

function generateDates() {
  const dates = [];
  for (let i = 0; i < 90; i++) {
    const d = new Date(START_DATE);
    d.setDate(START_DATE.getDate() + i);
    dates.push({ id: i + 1, date: d.toISOString().slice(0, 10), dateObj: d });
  }
  return dates;
}

function getWeekNumber(dayId) {
  return Math.ceil(dayId / 7);
}

// ── SCHEDULE ITEMS ─────────────────────────────────────────
function getSchedule(dayOfWeek, isWeekend) {
  if (isWeekend && dayOfWeek === 6) {
    return [
      { id: 'wakeUp', time: 'Morning', label: 'Wake up by 8:00 AM. No alarm needed.' },
      { id: 'water', time: 'Morning', label: 'Drink a full glass of water.' },
      { id: 'walk', time: 'Morning', label: '30-minute walk (active rest, no weights).' },
      { id: 'certStudy', time: '10:00 — 11:00', label: '1 hour of certification study.' },
      { id: 'meal1', time: '11:00', label: 'First Meal (300-400 cal, protein + fiber).' },
      { id: 'freeTime', time: 'Afternoon', label: 'Free time: errands, social, hobbies, nature.' },
      { id: 'meal2', time: '18:00', label: 'Second Meal (600-800 cal, balanced).' },
      { id: 'rest', time: 'Evening', label: 'Complete rest. No work. No screens.' },
      { id: 'windDown', time: '21:30', label: 'Wind down. No screens. Paper book only.' },
      { id: 'sleep', time: '22:30', label: 'Lights out.' },
    ];
  }
  if (isWeekend && dayOfWeek === 0) {
    return [
      { id: 'wakeUp', time: 'Morning', label: 'Wake up naturally. No alarm.' },
      { id: 'water', time: 'Morning', label: 'Drink a full glass of water.' },
      { id: 'meal1', time: '11:00', label: 'First Meal.' },
      { id: 'freeTime', time: 'All Day', label: 'Complete rest. No study. No work. No gym.' },
      { id: 'meal2', time: '18:00', label: 'Second Meal.' },
      { id: 'goalSetting', time: '20:00', label: "20 min: Set next week's 1-1-1 goals. Glance at Monday calendar." },
      { id: 'windDown', time: '21:30', label: 'Wind down. No screens. Paper book.' },
      { id: 'sleep', time: '22:00', label: 'Lights out.' },
    ];
  }
  return [
    { id: 'wakeUp', time: '06:00', label: 'Wake up. No snooze. Drink full glass of water. No phone 5 min.' },
    { id: 'preWorkout', time: '06:05', label: 'Small snack: half a banana or 10 almonds.' },
    { id: 'workout', time: '06:10 — 06:50', label: 'Workout: ' + GYM_SCHEDULE[dayOfWeek].name },
    { id: 'shower', time: '06:50 — 07:15', label: 'Shower, dress, pack bag + lunch.' },
    { id: 'commute', time: '07:15 — 07:35', label: 'Commute. Passive learning: tech podcast, one earbud.' },
    { id: 'arriveEarly', time: '07:35 — 07:45', label: "Arrive 10 min early. Review yesterday's journal question." },
    { id: 'deepWork1', time: '09:00 — 11:00', label: 'Deep Work Block 1. No phone, no social media.' },
    { id: 'meal1', time: '11:00', label: 'First Meal (300-400 cal, protein + fiber). Away from desk.' },
    { id: 'deepWork2', time: '11:15 — 12:30', label: 'Continue deep work.' },
    { id: 'breakWalk', time: '12:30 — 12:50', label: '20-min break. Walk outside. Stretch. No second meal.' },
    { id: 'learning', time: '12:50 — 13:10', label: '20-Min Active Learning Block (cert prep or job skills).' },
    { id: 'deepWork3', time: '13:10 — 15:30', label: 'Deep Work Block 2.' },
    { id: 'shortBreak', time: '15:30 — 15:40', label: '10-min break. Stand, stretch, hydrate. No screens.' },
    { id: 'deepWork4', time: '15:40 — 18:00', label: 'Deep Work Block 3. Last 20 min: tidy notes, write 1 question for tomorrow.' },
    { id: 'leaveWork', time: '18:00', label: 'Leave work. Exactly on time. No staying late.' },
    { id: 'commuteHome', time: '18:00 — 18:20', label: 'Commute home. Music you know or silence. No problem-solving.' },
    { id: 'meal2', time: '18:30', label: 'Second Meal (600-800 cal, balanced). Sit. No screens. 20 min.' },
    { id: 'chores', time: '18:50 — 19:00', label: 'Light chores (15 min max). Tidy one thing.' },
    { id: 'rest', time: '19:00 — 20:30', label: 'Complete rest (1.5 hrs). TV, fiction, hobby, call friend. NO work.' },
    { id: 'journal', time: '20:30 — 20:35', label: 'Journal: "What worked today? One thing better tomorrow." Pen & paper.' },
    { id: 'prepTomorrow', time: '20:35 — 21:00', label: 'Prepare: workout clothes, bag, alarm for 06:00.' },
    { id: 'windDown', time: '21:00 — 21:30', label: 'Wind down. Dim lights. No screens. Paper book.' },
    { id: 'sleep', time: '21:30', label: 'Lights out. 8+ hours sleep.' },
  ];
}

// ── APP COMPONENT ──────────────────────────────────────────
function App() {
  const dates = useMemo(generateDates, []);
  const [currentDay, setCurrentDay] = useState(0);

  const [progress, setProgress] = useState(() => {
    const saved = localStorage.getItem('plan90-progress');
    return saved ? JSON.parse(saved) : {};
  });

  const [goals, setGoals] = useState(() => {
    const saved = localStorage.getItem('plan90-goals');
    return saved ? JSON.parse(saved) : {};
  });

  const [editingGoals, setEditingGoals] = useState(false);

  useEffect(() => { localStorage.setItem('plan90-progress', JSON.stringify(progress)); }, [progress]);
  useEffect(() => { localStorage.setItem('plan90-goals', JSON.stringify(goals)); }, [goals]);

  const today = dates[currentDay];
  const dayOfWeek = today.dateObj.getDay();
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
  const phase = getPhase(today.id);
  const gym = GYM_SCHEDULE[dayOfWeek];
  const schedule = getSchedule(dayOfWeek, isWeekend);
  const weekNum = getWeekNumber(today.id);
  const weekKey = 'week-' + weekNum;
  const weekGoals = goals[weekKey] || { jobSkill: '', fitness: '', personalHabit: '' };
  const dayData = progress[today.date] || {};

  const [tempGoals, setTempGoals] = useState(weekGoals);
  useEffect(() => { setTempGoals(goals[weekKey] || { jobSkill: '', fitness: '', personalHabit: '' }); }, [weekNum]); // eslint-disable-line

  const toggleItem = (itemId) => {
    setProgress(prev => {
      const day = prev[today.date] || {};
      return { ...prev, [today.date]: { ...day, [itemId]: !day[itemId] } };
    });
  };

  const updateNotes = (value) => {
    setProgress(prev => {
      const day = prev[today.date] || {};
      return { ...prev, [today.date]: { ...day, journalNotes: value } };
    });
  };

  const saveWeekGoals = () => {
    setGoals(prev => ({ ...prev, [weekKey]: tempGoals }));
    setEditingGoals(false);
  };

  const checkedCount = schedule.filter(s => dayData[s.id]).length;
  const dayPercent = schedule.length > 0 ? Math.round((checkedCount / schedule.length) * 100) : 0;

  const overallCompleted = dates.reduce((acc, d) => {
    const dd = progress[d.date] || {};
    const dow = d.dateObj.getDay();
    const dSched = getSchedule(dow, dow === 0 || dow === 6);
    return acc + dSched.filter(s => dd[s.id]).length;
  }, 0);
  const overallTotal = dates.reduce((acc, d) => {
    const dow = d.dateObj.getDay();
    return acc + getSchedule(dow, dow === 0 || dow === 6).length;
  }, 0);
  const overallPercent = overallTotal > 0 ? Math.round((overallCompleted / overallTotal) * 100) : 0;

  return (
    <div className="app">
      <header className="header">
        <h1>90-Day Transformation</h1>
        <p className="subtitle">Day {today.id} of 90 &middot; Phase {phase.num}: {phase.name}</p>
      </header>

      <section className="overall-bar">
        <div className="bar-label">Overall: {overallPercent}% complete ({overallCompleted}/{overallTotal} tasks)</div>
        <div className="bar-track"><div className="bar-fill" style={{ width: overallPercent + '%' }} /></div>
      </section>

      <nav className="day-nav">
        <button disabled={currentDay === 0} onClick={() => setCurrentDay(c => c - 1)}>&larr; Previous Day</button>
        <div className="nav-center">
          <span className="nav-day-name">{DAY_NAMES[dayOfWeek]}</span>
          <span className="nav-date">{today.date}</span>
        </div>
        <button disabled={currentDay === 89} onClick={() => setCurrentDay(c => c + 1)}>Next Day &rarr;</button>
      </nav>

      <div className={'phase-banner phase-' + phase.num}>
        <strong>Phase {phase.num} Focus:</strong> {phase.focus}
      </div>

      <section className={'workout-card type-' + gym.type}>
        <h2>{gym.name}</h2>
        <p>{gym.desc}</p>
      </section>

      <section className="goals-card">
        <h2>Week {weekNum} &mdash; "1-1-1" Goals</h2>
        {editingGoals ? (
          <div className="goal-editor">
            <label>Job Skill Goal
              <input value={tempGoals.jobSkill} onChange={e => setTempGoals(g => ({ ...g, jobSkill: e.target.value }))} placeholder="e.g. Log into the CRM without help" />
            </label>
            <label>Fitness Goal
              <input value={tempGoals.fitness} onChange={e => setTempGoals(g => ({ ...g, fitness: e.target.value }))} placeholder="e.g. Complete all 4 workouts this week" />
            </label>
            <label>Personal Habit Goal
              <input value={tempGoals.personalHabit} onChange={e => setTempGoals(g => ({ ...g, personalHabit: e.target.value }))} placeholder="e.g. In bed by 10 PM every night" />
            </label>
            <button className="btn-primary" onClick={saveWeekGoals}>Save Goals</button>
          </div>
        ) : (
          <div className="goal-display">
            <p><span className="goal-tag job">JOB</span> {weekGoals.jobSkill || <em>Not set yet</em>}</p>
            <p><span className="goal-tag fit">FIT</span> {weekGoals.fitness || <em>Not set yet</em>}</p>
            <p><span className="goal-tag hab">HAB</span> {weekGoals.personalHabit || <em>Not set yet</em>}</p>
            <button className="btn-outline" onClick={() => setEditingGoals(true)}>Set / Edit Goals</button>
          </div>
        )}
      </section>

      <section className="schedule-card">
        <div className="schedule-header">
          <h2>Today's Schedule</h2>
          <span className="day-progress">{checkedCount}/{schedule.length} done ({dayPercent}%)</span>
        </div>
        <div className="day-bar-track"><div className="day-bar-fill" style={{ width: dayPercent + '%' }} /></div>
        <ul className="schedule-list">
          {schedule.map(item => {
            const checked = !!dayData[item.id];
            return (
              <li key={item.id} className={checked ? 'done' : ''} onClick={() => toggleItem(item.id)}>
                <span className="check-icon">{checked ? '\u2705' : '\u2B1C'}</span>
                <span className="item-time">{item.time}</span>
                <span className="item-label">{item.label}</span>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="journal-card">
        <h2>Journal &amp; Notes</h2>
        <p className="journal-prompt">What worked today? One thing you'll do better tomorrow?</p>
        <textarea
          rows="4"
          value={dayData.journalNotes || ''}
          onChange={e => updateNotes(e.target.value)}
          placeholder="Write your thoughts, wins, and lessons here..."
        />
      </section>

      <section className="mini-calendar">
        <h2>90-Day Overview</h2>
        <div className="cal-grid">
          {dates.map((d, i) => {
            const dd = progress[d.date] || {};
            const dow = d.dateObj.getDay();
            const dSched = getSchedule(dow, dow === 0 || dow === 6);
            const allDone = dSched.length > 0 && dSched.every(s => dd[s.id]);
            const someDone = dSched.some(s => dd[s.id]);
            let cls = 'cal-day';
            if (i === currentDay) cls += ' current';
            if (allDone) cls += ' complete';
            else if (someDone) cls += ' partial';
            return (
              <button key={d.id} className={cls} onClick={() => setCurrentDay(i)} title={'Day ' + d.id + ' \u2014 ' + d.date}>
                {d.id}
              </button>
            );
          })}
        </div>
      </section>

      <footer className="footer">
        <p>Rest is not a reward for working hard. Rest is the mechanism that turns work into skill.</p>
        <p className="footer-end">End Date: July 6, 2026 &middot; No alcohol &middot; Two meals &middot; 8 hours sleep</p>
      </footer>
    </div>
  );
}

export default App;
