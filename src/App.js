import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import fullscreenIcon from './full_screen_icon.svg';
import tickSound from './tick.mp3';
import alarmSound from './alarm.mp3';

const App = () => {
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isBlinking, setIsBlinking] = useState(false);
  const [isEnded, setIsEnded] = useState(false);
  const [mode, setMode] = useState('input');
  const [targetDate, setTargetDate] = useState(new Date());
  const intervalRef = useRef(null);
  const audioRef = useRef(new Audio(tickSound));
  const alarmRef = useRef(new Audio(alarmSound));

  useEffect(() => {
    if (isRunning && !isPaused) {
      intervalRef.current = setInterval(() => {
        setTotalSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            setIsRunning(false);
            setIsEnded(true);
            alarmRef.current.play();
            return 0;
          }
          return prev - 1;
        });
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning, isPaused]);

  useEffect(() => {
    const d = Math.floor(totalSeconds / 86400);
    const h = Math.floor((totalSeconds % 86400) / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;

    setDays(d);
    setHours(h);
    setMinutes(m);
    setSeconds(s);

    if (totalSeconds < 60) {
      setIsBlinking(true);
    } else {
      setIsBlinking(false);
    }

    if (totalSeconds <= 0) {
      setIsBlinking(false);
    }
  }, [totalSeconds]);

  const startTimer = () => {
    if (mode === 'input') {
      const inputDays = parseInt(days) || 0;
      const inputHours = parseInt(hours) || 0;
      const inputMinutes = parseInt(minutes) || 0;
      const inputSeconds = parseInt(seconds) || 0;
      if (inputDays === 0 && inputHours === 0 && inputMinutes === 0 && inputSeconds === 0) {
        return;
      }

      setTotalSeconds(
        inputDays * 86400 +
        inputHours * 3600 +
        inputMinutes * 60 +
        inputSeconds
      );
    } else if (mode === 'date') {
      const now = new Date();
      const difference = targetDate - now;

      if (difference <= 0) return;
      setTotalSeconds(Math.floor(difference / 1000));
    }

    setIsRunning(true);
    setIsPaused(false);
    setIsEnded(false);
  };

  const pauseTimer = () => {
    setIsPaused(!isPaused);
  };

  const resetTimer = () => {
    setTotalSeconds(0);
    setIsRunning(false);
    setIsPaused(false);
    setDays(0);
    setHours(0);
    setMinutes(0);
    setSeconds(0);
    setTargetDate(new Date());
    setIsBlinking(false);
    setIsEnded(false);

    alarmRef.current.pause();
    alarmRef.current.currentTime = 0;
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.getElementById('container').requestFullscreen().catch((err) => {
        alert(`Error attempting to enable fullscreen mode: ${err.message} (${err.name})`);
      });
    } else {
      document.exitFullscreen();
    }
    setIsFullscreen(!isFullscreen);
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  return (
    <div className={`container ${isFullscreen ? 'fullscreen' : ''}`} id="container">
      {!isFullscreen && <h1 className="title">Countdown Timer</h1>}

      {!isRunning && !isFullscreen && !isEnded && (
        <div className="tabs">
          <button
            className={`tab-button ${mode === 'input' ? 'active' : ''}`}
            onClick={() => setMode('input')}
          >
            Input Time
          </button>
          <button
            className={`tab-button ${mode === 'date' ? 'active' : ''}`}
            onClick={() => setMode('date')}
          >
            Set Date
          </button>
        </div>
      )}
      {!isRunning && !isFullscreen && mode === 'input' && !isEnded && (
        <div className="input-container" id="input-container">
          <input
            type="number"
            value={days === 0 ? '' : days}
            onChange={(e) => setDays(e.target.value)}
            placeholder="Days"
            min="0"
          />
          <input
            type="number"
            value={hours === 0 ? '' : hours}
            onChange={(e) => setHours(e.target.value)}
            placeholder="Hours"
            min="0"
          />
          <input
            type="number"
            value={minutes === 0 ? '' : minutes}
            onChange={(e) => setMinutes(e.target.value)}
            placeholder="Minutes"
            min="0"
          />
          <input
            type="number"
            value={seconds === 0 ? '' : seconds}
            onChange={(e) => setSeconds(e.target.value)}
            placeholder="Seconds"
            min="0"
          />
          <button onClick={startTimer}>Start Timer</button>
        </div>
      )}
      {!isRunning && !isFullscreen && mode === 'date' && !isEnded && (
        <div className="input-container" id="input-container">
          <input
            type="datetime-local"
            onChange={(e) => setTargetDate(new Date(e.target.value))}
          />
          <button onClick={startTimer}>Start Timer</button>
        </div>
      )}
      <div className={`timer ${isBlinking ? 'blink' : ''} ${isEnded ? 'ended' : ''}`}>
        <div className="time">
          <span>{String(days).padStart(2, '0')}</span>
          <p>Days</p>
        </div>
        <div className="time">
          <span>{String(hours).padStart(2, '0')}</span>
          <p>Hours</p>
        </div>
        <div className="time">
          <span>{String(minutes).padStart(2, '0')}</span>
          <p>Minutes</p>
        </div>
        <div className="time">
          <span>{String(seconds).padStart(2, '0')}</span>
          <p>Seconds</p>
        </div>
      </div>

      {isEnded && !isFullscreen && (
        <div className="end-message">
          <h2>Time's Up!</h2>
          <button className="set-another-timer-btn" onClick={resetTimer}>Set Another Timer</button>
        </div>
      )}

      {isRunning && !isFullscreen && (
        <div className="end-buttons-div">
          <button className="reset-resume-btn" onClick={pauseTimer}>
            {isPaused ? 'Resume Timer' : 'Pause Timer'}
          </button>
          <button onClick={resetTimer}>Cancel Timer</button>
          <img
            id="fullscreen-button"
            src={fullscreenIcon}
            alt="Fullscreen Icon"
            width="25"
            height="25"
            onClick={toggleFullscreen}
          />
        </div>
      )}
    </div>
  );
};

export default App;
