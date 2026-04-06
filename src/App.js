import React, { useState, useEffect, useMemo } from 'react';
import './App.css';

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
const ENERGY_LABELS = ['', 'Exhausted', 'Low', 'Okay', 'Good', 'Great'];
const MILESTONES = {
  7: { msg: 'First week done. You showed up when it was hardest.' },
  14: { msg: 'Two weeks. The hardest part is behind you.' },
  30: { msg: 'Phase 1 complete. You survived. You are no longer new.' },
  60: { msg: 'Phase 2 complete. You recognize the patterns. You belong here.' },
  90: { msg: 'You did it. 90 days. You are not the same person who started.' },
};

function getPhase(dayNum) {
  if (dayNum <= 30) return { num: 1, name: 'Survival Mode', focus: 'Learn the vocabulary. Build your glossary. Ask one question per day.', target: 30 };
  if (dayNum <= 60) return { num: 2, name: 'Pattern Recognition', focus: 'Practice tasks from memory. Connect what you do to why it matters.', target: 60 };
  return { num: 3, name: 'Building Speed', focus: 'Simulate tasks mentally. Create checklists. Teach what you know.', target: 90 };
}

function generateDates() {
  var dates = [];
  for (var i = 0; i < 90; i++) {
    var d = new Date(START_DATE);
    d.setDate(START_DATE.getDate() + i);
    dates.push({ id: i + 1, date: d.toISOString().slice(0, 10), dateObj: d });
  }
  return dates;
}

function getWeekNumber(dayId) {
  return Math.ceil(dayId / 7);
}

function getSchedule(dayOfWeek, isWeekend) {
  if (isWeekend && dayOfWeek === 6) {
    return [
      { id: 'wakeUp', time: 'Morning', label: 'Wake up by 8:00 AM. No alarm needed.' },
      { id: 'water', time: 'Morning', label: 'Drink a full glass of water.' },
      { id: 'walk', time: 'Morning', label: '30-minute walk (active rest, no weights).' },
      { id: 'certStudy', time: '10:00 - 11:00', label: '1 hour of certification study.' },
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
    { id: 'workout', time: '06:10 - 06:50', label: 'Workout: ' + GYM_SCHEDULE[dayOfWeek].name },
    { id: 'shower', time: '06:50 - 07:15', label: 'Shower, dress, pack bag + lunch.' },
    { id: 'commute', time: '07:15 - 07:35', label: 'Commute. Passive learning: tech podcast, one earbud.' },
    { id: 'arriveEarly', time: '07:35 - 07:45', label: "Arrive 10 min early. Review yesterday's journal question." },
    { id: 'deepWork1', time: '09:00 - 11:00', label: 'Deep Work Block 1. No phone, no social media.' },
    { id: 'meal1', time: '11:00', label: 'First Meal (300-400 cal, protein + fiber). Away from desk.' },
    { id: 'deepWork2', time: '11:15 - 12:30', label: 'Continue deep work.' },
    { id: 'breakWalk', time: '12:30 - 12:50', label: '20-min break. Walk outside. Stretch. No second meal.' },
    { id: 'learning', time: '12:50 - 13:10', label: '20-Min Active Learning Block (cert prep or job skills).' },
    { id: 'deepWork3', time: '13:10 - 15:30', label: 'Deep Work Block 2.' },
    { id: 'shortBreak', time: '15:30 - 15:40', label: '10-min break. Stand, stretch, hydrate. No screens.' },
    { id: 'deepWork4', time: '15:40 - 18:00', label: 'Deep Work Block 3. Last 20 min: tidy notes, write 1 question for tomorrow.' },
    { id: 'leaveWork', time: '18:00', label: 'Leave work. Exactly on time. No staying late.' },
    { id: 'commuteHome', time: '18:00 - 18:20', label: 'Commute home. Music you know or silence. No problem-solving.' },
    { id: 'meal2', time: '18:30', label: 'Second Meal (600-800 cal, balanced). Sit. No screens. 20 min.' },
    { id: 'chores', time: '18:50 - 19:00', label: 'Light chores (15 min max). Tidy one thing.' },
    { id: 'rest', time: '19:00 - 20:30', label: 'Complete rest (1.5 hrs). TV, fiction, hobby, call friend. NO work.' },
    { id: 'journal', time: '20:30 - 20:35', label: 'Journal: "What worked today? One thing better tomorrow." Pen & paper.' },
    { id: 'prepTomorrow', time: '20:35 - 21:00', label: 'Prepare: workout clothes, bag, alarm for 06:00.' },
    { id: 'windDown', time: '21:00 - 21:30', label: 'Wind down. Dim lights. No screens. Paper book.' },
    { id: 'sleep', time: '21:30', label: 'Lights out. 8+ hours sleep.' },
  ];
}

function isDayComplete(dateObj, progress) {
  var dd = progress[dateObj.date] || {};
  var dow = dateObj.dateObj.getDay();
  var sched = getSchedule(dow, dow === 0 || dow === 6);
  return sched.length > 0 && sched.every(function(s) { return dd[s.id]; });
}

function getStreak(dates, progress) {
  var streak = 0;
  for (var i = 0; i < dates.length; i++) {
    if (isDayComplete(dates[i], progress)) {
      streak++;
    } else {
      if (streak > 0) break;
      break;
    }
  }
  return streak;
}

function getLongestStreak(dates, progress) {
  var longest = 0;
  var current = 0;
  for (var i = 0; i < dates.length; i++) {
    if (isDayComplete(dates[i], progress)) {
      current++;
      if (current > longest) longest = current;
    } else {
      current = 0;
    }
  }
  return longest;
}

function App() {
  var dates = useMemo(generateDates, []);
  var [currentDay, setCurrentDay] = useState(0);

  var [progress, setProgress] = useState(function() {
    var saved = localStorage.getItem('plan90-progress');
    return saved ? JSON.parse(saved) : {};
  });

  var [goals, setGoals] = useState(function() {
    var saved = localStorage.getItem('plan90-goals');
    return saved ? JSON.parse(saved) : {};
  });

  var [weightLog, setWeightLog] = useState(function() {
    var saved = localStorage.getItem('plan90-weight');
    return saved ? JSON.parse(saved) : {};
  });

  var [editingGoals, setEditingGoals] = useState(false);

  useEffect(function() { localStorage.setItem('plan90-progress', JSON.stringify(progress)); }, [progress]);
  useEffect(function() { localStorage.setItem('plan90-goals', JSON.stringify(goals)); }, [goals]);
  useEffect(function() { localStorage.setItem('plan90-weight', JSON.stringify(weightLog)); }, [weightLog]);

  var today = dates[currentDay];
  var dayOfWeek = today.dateObj.getDay();
  var isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
  var isSunday = dayOfWeek === 0;
  var phase = getPhase(today.id);
  var gym = GYM_SCHEDULE[dayOfWeek];
  var schedule = getSchedule(dayOfWeek, isWeekend);
  var weekNum = getWeekNumber(today.id);
  var weekKey = 'week-' + weekNum;
  var emptyGoals = { jobSkill: '', fitness: '', personalHabit: '', jobHit: false, fitHit: false, habHit: false };
  var weekGoals = goals[weekKey] || emptyGoals;
  var dayData = progress[today.date] || {};
  var milestone = MILESTONES[today.id];

  var [tempGoals, setTempGoals] = useState(weekGoals);

  useEffect(function() {
    var wk = 'week-' + getWeekNumber(dates[currentDay].id);
    setTempGoals(goals[wk] || { jobSkill: '', fitness: '', personalHabit: '', jobHit: false, fitHit: false, habHit: false });
  }, [currentDay]); // eslint-disable-line

  // Stats
  var streak = getStreak(dates, progress);
  var longestStreak = getLongestStreak(dates, progress);
  var daysCompleted = dates.filter(function(d) { return isDayComplete(d, progress); }).length;

  var checkedCount = schedule.filter(function(s) { return dayData[s.id]; }).length;
  var dayPercent = schedule.length > 0 ? Math.round((checkedCount / schedule.length) * 100) : 0;

  var phaseStart = phase.num === 1 ? 1 : phase.num === 2 ? 31 : 61;
  var phaseDaysCompleted = dates.slice(phaseStart - 1, phase.target).filter(function(d) { return isDayComplete(d, progress); }).length;
  var phaseTotal = phase.target - phaseStart + 1;
  var phasePercent = Math.round((phaseDaysCompleted / phaseTotal) * 100);

  // Weight
  var weightEntries = Object.entries(weightLog).sort(function(a, b) { return a[0].localeCompare(b[0]); });
  var latestWeight = weightEntries.length > 0 ? weightEntries[weightEntries.length - 1][1] : null;
  var startingWeight = weightEntries.length > 0 ? weightEntries[0][1] : null;
  var weightChange = (latestWeight && startingWeight) ? (latestWeight - startingWeight).toFixed(1) : null;

  // Handlers
  function toggleItem(itemId) {
    setProgress(function(prev) {
      var day = prev[today.date] || {};
      var updated = {};
      Object.keys(day).forEach(function(k) { updated[k] = day[k]; });
      updated[itemId] = !day[itemId];
      var result = {};
      Object.keys(prev).forEach(function(k) { result[k] = prev[k]; });
      result[today.date] = updated;
      return result;
    });
  }

  function updateField(field, value) {
    setProgress(function(prev) {
      var day = prev[today.date] || {};
      var updated = {};
      Object.keys(day).forEach(function(k) { updated[k] = day[k]; });
      updated[field] = value;
      var result = {};
      Object.keys(prev).forEach(function(k) { result[k] = prev[k]; });
      result[today.date] = updated;
      return result;
    });
  }

  function saveWeekGoals() {
    setGoals(function(prev) {
      var result = {};
      Object.keys(prev).forEach(function(k) { result[k] = prev[k]; });
      result[weekKey] = tempGoals;
      return result;
    });
    setEditingGoals(false);
  }

  function toggleGoalHit(key) {
    var updated = {};
    Object.keys(weekGoals).forEach(function(k) { updated[k] = weekGoals[k]; });
    updated[key] = !weekGoals[key];
    setGoals(function(prev) {
      var result = {};
      Object.keys(prev).forEach(function(k) { result[k] = prev[k]; });
      result[weekKey] = updated;
      return result;
    });
  }

  function saveWeight(val) {
    var num = parseFloat(val);
    if (!isNaN(num) && num > 0) {
      setWeightLog(function(prev) {
        var result = {};
        Object.keys(prev).forEach(function(k) { result[k] = prev[k]; });
        result[today.date] = num;
        return result;
      });
    }
  }

  return (
    <div className="app">
      <header className="header">
        <h1>90-Day Transformation</h1>
        <p className="subtitle">Day {today.id} of 90 &middot; Phase {phase.num}: {phase.name}</p>
      </header>

      {/* STATS DASHBOARD */}
      <section className="stats-dashboard">
        <div className="stat-card">
          <span className="stat-number">{streak}</span>
          <span className="stat-label">Current Streak</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{longestStreak}</span>
          <span className="stat-label">Best Streak</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{daysCompleted}</span>
          <span className="stat-label">Days Done</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{latestWeight ? latestWeight + ' kg' : '---'}</span>
          <span className="stat-label">Weight{weightChange ? (' (' + (parseFloat(weightChange) <= 0 ? '' : '+') + weightChange + ')') : ''}</span>
        </div>
      </section>

      {/* PHASE PROGRESS */}
      <section className="phase-progress-card">
        <div className="phase-progress-header">
          <span>Phase {phase.num}: {phase.name}</span>
          <span>{phasePercent}% ({phaseDaysCompleted}/{phaseTotal} days)</span>
        </div>
        <div className="bar-track"><div className={'bar-fill phase-fill-' + phase.num} style={{ width: phasePercent + '%' }} /></div>
      </section>

      {/* MILESTONE */}
      {milestone && (
        <div className="milestone-banner">
          <span className="milestone-icon">DAY {today.id}</span>
          <span className="milestone-msg">{milestone.msg}</span>
        </div>
      )}

      {/* DAY NAVIGATION */}
      <nav className="day-nav">
        <button disabled={currentDay === 0} onClick={function() { setCurrentDay(function(c) { return c - 1; }); }}>&larr; Prev</button>
        <div className="nav-center">
          <span className="nav-day-name">{DAY_NAMES[dayOfWeek]}</span>
          <span className="nav-date">{today.date}</span>
        </div>
        <button disabled={currentDay === 89} onClick={function() { setCurrentDay(function(c) { return c + 1; }); }}>Next &rarr;</button>
      </nav>

      {/* PHASE BANNER */}
      <div className={'phase-banner phase-' + phase.num}>
        <strong>Phase {phase.num} Focus:</strong> {phase.focus}
      </div>

      {/* WORKOUT CARD */}
      <section className={'workout-card type-' + gym.type}>
        <h2>{gym.name}</h2>
        <p>{gym.desc}</p>
      </section>

      {/* WEEKLY 1-1-1 GOALS */}
      <section className="goals-card">
        <h2>Week {weekNum} --- "1-1-1" Goals</h2>
        {editingGoals ? (
          <div className="goal-editor">
            <label>Job Skill Goal
              <input value={tempGoals.jobSkill} onChange={function(e) { setTempGoals(function(g) { return Object.assign({}, g, { jobSkill: e.target.value }); }); }} placeholder="e.g. Log into the CRM without help" />
            </label>
            <label>Fitness Goal
              <input value={tempGoals.fitness} onChange={function(e) { setTempGoals(function(g) { return Object.assign({}, g, { fitness: e.target.value }); }); }} placeholder="e.g. Complete all 4 workouts this week" />
            </label>
            <label>Personal Habit Goal
              <input value={tempGoals.personalHabit} onChange={function(e) { setTempGoals(function(g) { return Object.assign({}, g, { personalHabit: e.target.value }); }); }} placeholder="e.g. In bed by 10 PM every night" />
            </label>
            <button className="btn-primary" onClick={saveWeekGoals}>Save Goals</button>
          </div>
        ) : (
          <div className="goal-display">
            <div className="goal-row" onClick={function() { toggleGoalHit('jobHit'); }}>
              <span className="goal-check">{weekGoals.jobHit ? '\u2705' : '\u2B1C'}</span>
              <span className="goal-tag job">JOB</span>
              <span>{weekGoals.jobSkill || <em>Not set yet</em>}</span>
            </div>
            <div className="goal-row" onClick={function() { toggleGoalHit('fitHit'); }}>
              <span className="goal-check">{weekGoals.fitHit ? '\u2705' : '\u2B1C'}</span>
              <span className="goal-tag fit">FIT</span>
              <span>{weekGoals.fitness || <em>Not set yet</em>}</span>
            </div>
            <div className="goal-row" onClick={function() { toggleGoalHit('habHit'); }}>
              <span className="goal-check">{weekGoals.habHit ? '\u2705' : '\u2B1C'}</span>
              <span className="goal-tag hab">HAB</span>
              <span>{weekGoals.personalHabit || <em>Not set yet</em>}</span>
            </div>
            <button className="btn-outline" onClick={function() { setEditingGoals(true); }}>Set / Edit Goals</button>
          </div>
        )}
      </section>

      {/* TODAY'S SCHEDULE */}
      <section className="schedule-card">
        <div className="schedule-header">
          <h2>Today's Schedule</h2>
          <span className="day-progress">{checkedCount}/{schedule.length} done ({dayPercent}%)</span>
        </div>
        <div className="day-bar-track"><div className="day-bar-fill" style={{ width: dayPercent + '%' }} /></div>
        {dayPercent === 100 && <div className="day-complete-msg">Day complete. You showed up. Rest well.</div>}
        <ul className="schedule-list">
          {schedule.map(function(item) {
            var checked = !!dayData[item.id];
            return (
              <li key={item.id} className={checked ? 'done' : ''} onClick={function() { toggleItem(item.id); }}>
                <span className="check-icon">{checked ? '\u2705' : '\u2B1C'}</span>
                <span className="item-time">{item.time}</span>
                <span className="item-label">{item.label}</span>
              </li>
            );
          })}
        </ul>
      </section>

      {/* ENERGY / MOOD */}
      <section className="energy-card">
        <h2>How Do You Feel Today?</h2>
        <div className="energy-row">
          {[1, 2, 3, 4, 5].map(function(n) {
            return (
              <button
                key={n}
                className={'energy-btn' + (dayData.energy === n ? ' active' : '')}
                onClick={function() { updateField('energy', n); }}
              >
                <span className="energy-num">{n}</span>
                <span className="energy-lbl">{ENERGY_LABELS[n]}</span>
              </button>
            );
          })}
        </div>
        {dayData.energy && dayData.energy <= 2 && (
          <p className="energy-warning">Low energy detected. Consider: shorten learning block to 15 min. Never shorten rest.</p>
        )}
      </section>

      {/* TODAY'S WIN */}
      <section className="win-card">
        <h2>Today's Win</h2>
        <p className="win-prompt">One thing you are proud of today, no matter how small.</p>
        <input
          type="text"
          className="win-input"
          value={dayData.todayWin || ''}
          onChange={function(e) { updateField('todayWin', e.target.value); }}
          placeholder="e.g. I asked my manager one question without hesitating."
        />
      </section>

      {/* STRUCTURED JOURNAL */}
      <section className="journal-card">
        <h2>Journal</h2>
        <div className="journal-field">
          <label>What worked today?</label>
          <textarea
            rows="2"
            value={dayData.journalWorked || ''}
            onChange={function(e) { updateField('journalWorked', e.target.value); }}
            placeholder="What went right? What did you do well?"
          />
        </div>
        <div className="journal-field">
          <label>What didn't work?</label>
          <textarea
            rows="2"
            value={dayData.journalFailed || ''}
            onChange={function(e) { updateField('journalFailed', e.target.value); }}
            placeholder="Where did you struggle? No shame - this is data."
          />
        </div>
        <div className="journal-field">
          <label>One thing to do better tomorrow:</label>
          <textarea
            rows="2"
            value={dayData.journalTomorrow || ''}
            onChange={function(e) { updateField('journalTomorrow', e.target.value); }}
            placeholder="Specific and small. Not 'be better' - 'ask one question before 10 AM'."
          />
        </div>
      </section>

      {/* WEIGHT TRACKER */}
      <section className="weight-card">
        <h2>Weight Log</h2>
        <p className="weight-prompt">Log once a week (Saturdays recommended). Starting weight: 127 kg.</p>
        <div className="weight-input-row">
          <input
            type="number"
            step="0.1"
            className="weight-input"
            value={weightLog[today.date] || ''}
            onChange={function(e) { saveWeight(e.target.value); }}
            placeholder="kg"
          />
          <span className="weight-unit">kg</span>
        </div>
        {weightEntries.length > 0 && (
          <div className="weight-history">
            <h3>History</h3>
            <div className="weight-list">
              {weightEntries.map(function(entry) {
                return (
                  <div key={entry[0]} className="weight-entry">
                    <span>{entry[0]}</span>
                    <span className="weight-val">{entry[1]} kg</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </section>

      {/* WEEKLY REVIEW (Sundays) */}
      {isSunday && (
        <section className="review-card">
          <h2>Weekly Review - Week {weekNum}</h2>
          <p className="review-prompt">It's Sunday. Look back at this week honestly. Did you hit your 1-1-1 goals? Click them above to mark achieved.</p>
          <div className="review-questions">
            <div className="journal-field">
              <label>Did I follow the schedule 4 out of 5 weekdays?</label>
              <textarea
                rows="2"
                value={dayData.reviewSchedule || ''}
                onChange={function(e) { updateField('reviewSchedule', e.target.value); }}
                placeholder="Yes / No - and why."
              />
            </div>
            <div className="journal-field">
              <label>Did I sleep 7.5+ hours each night?</label>
              <textarea
                rows="2"
                value={dayData.reviewSleep || ''}
                onChange={function(e) { updateField('reviewSleep', e.target.value); }}
                placeholder="Yes / No - what disrupted sleep if not?"
              />
            </div>
            <div className="journal-field">
              <label>Can I remember one new thing I learned on Monday?</label>
              <textarea
                rows="2"
                value={dayData.reviewLearned || ''}
                onChange={function(e) { updateField('reviewLearned', e.target.value); }}
                placeholder="If no - you need more rest, not more studying."
              />
            </div>
          </div>
        </section>
      )}

      {/* MINI CALENDAR */}
      <section className="mini-calendar">
        <h2>90-Day Overview</h2>
        <div className="cal-grid">
          {dates.map(function(d, i) {
            var complete = isDayComplete(d, progress);
            var dd = progress[d.date] || {};
            var dow = d.dateObj.getDay();
            var dSched = getSchedule(dow, dow === 0 || dow === 6);
            var someDone = dSched.some(function(s) { return dd[s.id]; });
            var cls = 'cal-day';
            if (i === currentDay) cls += ' current';
            if (complete) cls += ' complete';
            else if (someDone) cls += ' partial';
            return (
              <button key={d.id} className={cls} onClick={function() { setCurrentDay(i); }} title={'Day ' + d.id + ' - ' + d.date}>
                {d.id}
              </button>
            );
          })}
        </div>
        <div className="cal-legend">
          <span><span className="legend-box complete"></span> Completed</span>
          <span><span className="legend-box partial"></span> In Progress</span>
          <span><span className="legend-box current-legend"></span> Selected</span>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <p>Rest is not a reward for working hard. Rest is the mechanism that turns work into skill.</p>
        <p className="footer-end">End Date: July 6, 2026 | No alcohol | Two meals | 8 hours sleep</p>
      </footer>
    </div>
  );
}

export default App;
