import React, { useState, useEffect } from "react";

import cat01 from "./assets/cats/cat01.png";
import cat02 from "./assets/cats/cat02.png";
import cat03 from "./assets/cats/cat03.png";
import cat04 from "./assets/cats/cat04.png";
import cat05 from "./assets/cats/cat05.png";
import cat06 from "./assets/cats/cat06.png";
import cat07 from "./assets/cats/cat07.png";
import cat08 from "./assets/cats/cat08.png";
import cat09 from "./assets/cats/cat09.png";
import cat10 from "./assets/cats/cat10.png";
import cat11 from "./assets/cats/cat11.png";
import cat12 from "./assets/cats/cat12.png";
import cat13 from "./assets/cats/cat13.png";
import cat14 from "./assets/cats/cat14.png";
import cat15 from "./assets/cats/cat15.png";
import cat16 from "./assets/cats/cat16.png";
import cat17 from "./assets/cats/cat17.png";
import cat18 from "./assets/cats/cat18.png";
import cat19 from "./assets/cats/cat19.png";

const catImages = [cat01, cat02, cat03, cat04, cat05, cat06, cat07, cat08, cat09, cat10, cat11, cat12, cat13, cat14, cat15, cat16, cat17, cat18, cat19];

export default function CatClickerGame() {

  // Random cat
  const getRandomCat = () => {
    return catImages[Math.floor(Math.random() * catImages.length)];
  };

  const [currentCat, setCurrentCat] = useState(() => getRandomCat());

  // Button animation
  const [isClicked, setIsClicked] = useState(false);

  // Click progress
  const [clickProgress, setClickProgress] = useState(() =>
    Number(localStorage.getItem("clickProgress") ?? 0)
  );

  // Points
  const [points, setPoints] = useState(() =>
    Number(localStorage.getItem("points") ?? 0)
  );

  const [totalPoints, setTotalPoints] = useState(() =>
    Number(localStorage.getItem("totalPoints") ?? 0)
  );

  // Upgrade levels
  const [clickMultiplierLevel, setClickMultiplierLevel] = useState(() =>
    Number(localStorage.getItem("clickMultiplierLevel") ?? 0)
  );

  const [autoClickerLevel, setAutoClickerLevel] = useState(() =>
    Number(localStorage.getItem("autoClickerLevel") ?? 0)
  );

  const [rewardMultiplierLevel, setRewardMultiplierLevel] = useState(() =>
    Number(localStorage.getItem("rewardMultiplierLevel") ?? 0)
  );

  // Formulas
  const clickMultiplier = 1 + clickMultiplierLevel;
  const autoClicksPerSecond = autoClickerLevel;
  const rewardMultiplier = 1 + rewardMultiplierLevel * 0.5;

  const clickMultiplierPrice = Math.floor(100 * Math.pow(1.5, clickMultiplierLevel));
  const autoClickerPrice = Math.floor(500 * Math.pow(1.6, autoClickerLevel));
  const rewardMultiplierPrice = Math.floor(1000 * Math.pow(1.7, rewardMultiplierLevel));

  // Progress processor
  function processProgress(prev, amount) {
    let newProgress = prev + amount;
    let totalReward = 0;
    let levelCompleted = false;

    while (newProgress >= 50) {
      totalReward += 50 * rewardMultiplier;
      newProgress -= 50;
      levelCompleted = true;
    }

    if (levelCompleted) {
      setCurrentCat(getRandomCat());
    }

    return { newProgress, totalReward };
  }

  // Click handler
  const handleClick = () => {
    setIsClicked(true);

    setClickProgress(prev => {
      const result = processProgress(prev, clickMultiplier);

      if (result.totalReward > 0) {
        setPoints(p => p + result.totalReward);
        setTotalPoints(p => p + result.totalReward);
      }

      return result.newProgress;
    });

    setTimeout(() => setIsClicked(false), 50);
  };

  // Autoclicker
  useEffect(() => {
    if (autoClicksPerSecond === 0) return;

    const interval = setInterval(() => {

      setClickProgress(prev => {
        const result = processProgress(prev, autoClicksPerSecond);

        if (result.totalReward > 0) {
          setPoints(p => p + result.totalReward);
          setTotalPoints(p => p + result.totalReward);
        }

        return result.newProgress;
      });

    }, 1000);

    return () => clearInterval(interval);

  }, [autoClicksPerSecond, rewardMultiplier]);

  // Shop purchases
  const buyClickMultiplier = () => {
    if (points >= clickMultiplierPrice) {
      setPoints(p => p - clickMultiplierPrice);
      setClickMultiplierLevel(l => l + 1);
    }
  };

  const buyAutoClicker = () => {
    if (points >= autoClickerPrice) {
      setPoints(p => p - autoClickerPrice);
      setAutoClickerLevel(l => l + 1);
    }
  };

  const buyRewardMultiplier = () => {
    if (points >= rewardMultiplierPrice) {
      setPoints(p => p - rewardMultiplierPrice);
      setRewardMultiplierLevel(l => l + 1);
    }
  };

  // Reset game
  const resetGame = () => {
    setClickProgress(0);
    setPoints(0);
    setTotalPoints(0);
    setClickMultiplierLevel(0);
    setAutoClickerLevel(0);
    setRewardMultiplierLevel(0);

    localStorage.clear();

    setCurrentCat(getRandomCat());
  };

  // Save game
  useEffect(() => {
    localStorage.setItem("clickProgress", clickProgress);
    localStorage.setItem("points", points);
    localStorage.setItem("totalPoints", totalPoints);
    localStorage.setItem("clickMultiplierLevel", clickMultiplierLevel);
    localStorage.setItem("autoClickerLevel", autoClickerLevel);
    localStorage.setItem("rewardMultiplierLevel", rewardMultiplierLevel);
  }, [
    clickProgress,
    points,
    totalPoints,
    clickMultiplierLevel,
    autoClickerLevel,
    rewardMultiplierLevel
  ]);

  const progressPercent = (clickProgress / 50) * 100;

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
      }}
    >

      {/* Store panel */}
      <div
        style={{
          width: "250px",
          padding: "20px",
          backgroundColor: "#808080",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          color: "white",
        }}  
      >
        <h2>Shop</h2>

        <button onClick={buyClickMultiplier} disabled={points < clickMultiplierPrice}>
          Click Multiplier (x{clickMultiplier}) — {clickMultiplierPrice}
        </button>

        <p>Click Multiplier Level: {clickMultiplierLevel}</p>

        <br /><br />

        <button onClick={buyAutoClicker} disabled={points < autoClickerPrice}>
          Auto Clicker ({autoClicksPerSecond}/sec) — {autoClickerPrice}
        </button>

        <p>Autoclicker Level: {autoClickerLevel}</p>

        <br /><br />

        <button onClick={buyRewardMultiplier} disabled={points < rewardMultiplierPrice}>
          Reward Multiplier (x{rewardMultiplier}) — {rewardMultiplierPrice}
        </button>

        <p>Reward Multiplier Level: {rewardMultiplierLevel}</p>
      </div>

      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: "20px",
          position: "relative",
        }}
      >
        <h1>🐱 Cat Clicker</h1>

        <h2>Points: {Math.floor(points)}</h2>

        {/* Cat Button */}
        <img
          src={currentCat}
          alt="cat"
          onClick={handleClick}
          style={{
            width: "200px",
            height: "200px",
          }}
        />

        <p>Clicks: {Math.floor(clickProgress)} / 50</p>

        {/* Progress Bar */}
        <div
          style={{
            width: "300px",
            height: "20px",
            background: "#ddd",
            margin: "0 auto 20px",
            borderRadius: "10px",
            overflow: "hidden"
          }}
        >
          <div
            style={{
              width: `${progressPercent}%`,
              height: "100%",
              background: "#4caf50",
              transition: "width 0.2s"
            }}
          />
        </div>

        <button
          onClick={resetGame}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: "#f44336",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          Reset Game
        </button>
      </div>

      <p>Total Points Earned: {Math.floor(totalPoints)}</p>

    </div>
  );
}