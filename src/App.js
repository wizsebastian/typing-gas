import React, { useState, useEffect, useRef } from "react";
import "./styles.css";
import CountdownTimer from "./components/CountdownTimer";

const list = ["First", "Second", "Third", "Fourth", "Fifth"];
const colors = ["#FFFFFF", "#FFD700", "#FFA07A", "#90EE90", "#ADD8E6", "#FFB6C1", "#D3D3D3"];

const App = () => {
  const [name, setName] = useState(localStorage.getItem("name") || "");
  const [backgroundColor, setBackgroundColor] = useState(localStorage.getItem("backgroundColor") || "#FFFFFF");
  const [level, setLevel] = useState(localStorage.getItem("level") || 1);
  const [text, setText] = useState("");
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [times, setTimes] = useState([]);
  const [step, setStep] = useState("lobby");
  const [timeUp, setTimeUp] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [isPaused, setIsPaused] = useState(false);
  const [gameResult, setGameResult] = useState(null); // 'win' or 'lose'
  const startTimeRef = useRef(Date.now());
  const inputRef = useRef(null);

  useEffect(() => {
    if (step === "game" && inputRef.current) {
      inputRef.current.focus();
    }
  }, [step, currentWordIndex]);

  useEffect(() => {
    if (countdown > 0 && step === "countdown") {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && step === "countdown") {
      setStep("game");
    }
  }, [countdown, step]);

  useEffect(() => {
    if (timeUp && !isPaused) {
      handleGameOver('lose');
    }
  }, [timeUp, isPaused]);

  useEffect(() => {
    if (currentWordIndex < list.length && text.toLowerCase() === list[currentWordIndex].toLowerCase()) {
      handleCorrectAnswer();
    }
  }, [text, currentWordIndex]);

  const getPerformance = (time, length) => {
    const expectedTime = length * 1.5;
    if (time <= expectedTime * 0.5) return { label: "LEGEND", color: "green", score: 10 };
    if (time <= expectedTime * 0.75) return { label: "VERY WELL", color: "blue", score: 7 };
    if (time <= expectedTime) return { label: "WELL", color: "orange", score: 5 };
    return { label: "BAD", color: "red", score: 2 };
  };

  const handleGameOver = (result) => {
    setGameResult(result);
    setStep("gameOver");
  };

  const handleCorrectAnswer = () => {
    const endTime = Date.now();
    const timeTaken = (endTime - startTimeRef.current) / 1000;
    const performance = getPerformance(timeTaken, list[currentWordIndex].length);

    setTimes((prevTimes) => [...prevTimes, { word: list[currentWordIndex], time: timeTaken, label: performance.label }]);
    setScore((prevScore) => prevScore + performance.score);

    setText("");
    if (currentWordIndex + 1 === list.length) {
      handleGameOver('win');
    } else {
      setCurrentWordIndex((prevIndex) => prevIndex + 1);
      startTimeRef.current = Date.now();
      setTimeUp(false);
    }
  };

  const handleNameSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("name", text);
    setName(text);
    setText("");
    setStep("lobby");
  };

  const handleLevelSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("level", text);
    setLevel(text);
    setText("");
    setStep("countdown");
    setCountdown(3);
  };

  const handleNewGame = () => {
    setText("");
    setCurrentWordIndex(0);
    setScore(0);
    setTimes([]);
    setCountdown(3);
    setStep("countdown");
    setGameResult(null);
    startTimeRef.current = Date.now();
  };

  const handleContinueGame = () => {
    setStep("countdown");
    setCountdown(3);
  };

  const handlePause = () => {
    setIsPaused(true);
    setStep("lobby");
  };

  const handleColorChange = (color) => {
    setBackgroundColor(color);
    localStorage.setItem("backgroundColor", color);
  };

  const saveProgress = () => {
    localStorage.setItem("progress", JSON.stringify({
      currentWordIndex,
      score,
      times,
    }));
  };

  const loadProgress = () => {
    const progress = JSON.parse(localStorage.getItem("progress"));
    if (progress) {
      setCurrentWordIndex(progress.currentWordIndex);
      setScore(progress.score);
      setTimes(progress.times);
      setStep("countdown");
      setCountdown(3);
    }
  };

  const getHighlightedText = (text, highlight) => {
    if (!highlight) return text;
    const regex = new RegExp(`(${highlight})`, "gi");
    const parts = text.split(regex);
    return parts.map((part, index) => (
      <span key={index} className={part.toLowerCase() === highlight.toLowerCase() ? "highlight animate" : ""}>
        {part}
      </span>
    ));
  };

  const progress = (currentWordIndex / list.length) * 100;

  return (
    <div className="App" style={{ backgroundColor }}>
      {step === "lobby" && (
        <div className="centered lobby">
          <h3>Welcome to the Typing Gas...</h3>
          <p>Practice your english here...</p>
          <p>Here you only need to write the word on the screen</p>
          {name ? (
            <>
              <p>Hello, {name}!</p>
              <button onClick={handleNewGame} className="button">New Game</button>
              <button onClick={handleContinueGame} className="button">Continue Game</button>
              <button onClick={loadProgress} className="button">Load Saved Game</button>
            </>
          ) : (
            <form onSubmit={handleNameSubmit} className="chat-form name-input">
              <input
                ref={inputRef}
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter your name"
                className="chat-input"
              />
            </form>
          )}
        </div>
      )}
      {step === "countdown" && (
        <div className="centered">
          <h1 className="countdown">{countdown}</h1>
        </div>
      )}
      {step === "game" && (
        <>
          <div className="header">
            <div>{name}</div>
            <div>Score: {score}</div>
            <button onClick={handlePause} className="button">Pause</button>
          </div>
          <div className="color-picker">
            {colors.map((color, index) => (
              <div
                key={index}
                className="color-circle"
                style={{ backgroundColor: color }}
                onClick={() => handleColorChange(color)}
              ></div>
            ))}
          </div>
          <div className="progress-container">
            <div className="progress-bar" style={{ width: `${progress}%` }}></div>
          </div>
          <div className="results">
            {times.map((time, index) => (
              <div key={index} style={{ color: getPerformance(time.time, list[index].length).color }}>
                {time.word}: {time.time.toFixed(2)} seconds ({time.label})
              </div>
            ))}
          </div>
          <div className="centered game-area">
            <h2>{getHighlightedText(list[currentWordIndex], text)}</h2>
            <CountdownTimer
              initialTime={10}
              onTimeUp={() => setTimeUp(true)}
              isPaused={isPaused}
            />
          </div>
          <form className="chat-form game-input">
            <input
              ref={inputRef}
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type here to match"
              className="chat-input"
            />
          </form>
        </>
      )}
      {step === "gameOver" && (
        <div className="centered">
          <h1 className={`game-result ${gameResult}`}>
            {gameResult === 'win' ? 'YOU WIN!' : 'YOU LOSE!'}
          </h1>
          <div className="buttons">
            <button onClick={handleNewGame} className="button">New Game</button>
            <button onClick={() => setStep("lobby")} className="button">Back to Lobby</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;