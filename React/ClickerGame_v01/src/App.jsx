import React, { useState, useEffect } from "react";

export default function ClickerGameWithStore() {
  // Points system (persistent)
  const [points, setPoints] = useState(() => {
    const saved = localStorage.getItem("points");
    return saved ? Number(saved) : 0;
  });

  const [totalPoints, setTotalPoints] = useState(() => {
    const saved = localStorage.getItem("totalPoints");
    return saved ? Number(saved) : 0;
  });

  // Button animation
  const [isClicked, setIsClicked] = useState(false);

  // Store: multiplier and price
  const [multiplier, setMultiplier] = useState(() => {
    const saved = localStorage.getItem("multiplier");
    return saved ? Number(saved) : 1;
  });
  const [multiplierPrice, setMultiplierPrice] = useState(() => {
    const saved = localStorage.getItem("multiplierPrice");
    return saved ? Number(saved) : 100;
  });

  // Handle button click
  const handleClick = () => {
    setIsClicked(true);
    setPoints(prev => prev + multiplier);
    setTotalPoints(prev => prev + multiplier); // increment total points earned
    setTimeout(() => setIsClicked(false), 150);
  };

  // Buy multiplier
  const buyMultiplier = () => {
    if (points >= multiplierPrice) {
      setPoints(prev => prev - multiplierPrice);
      setMultiplier(prev => prev * 2);
      setMultiplierPrice(prev => prev * 2);
    }
  };

  // Reset everything
  const resetGame = () => {
    setPoints(0);
    setTotalPoints(0);
    setMultiplier(1);
    setMultiplierPrice(100);
    localStorage.removeItem("points");
    localStorage.removeItem("totalPoints");
    localStorage.removeItem("multiplier");
    localStorage.removeItem("multiplierPrice");
  };

  // Save points, multiplier, price, and total points
  useEffect(() => {
    localStorage.setItem("points", points);
    localStorage.setItem("multiplier", multiplier);
    localStorage.setItem("multiplierPrice", multiplierPrice);
    localStorage.setItem("totalPoints", totalPoints);
  }, [points, multiplier, multiplierPrice, totalPoints]);

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        width: "100vw",
      }}
    >
      {/* Store panel */}
      <div
        style={{
          width: "250px",
          padding: "20px",
          backgroundColor: "#808080",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          color: "white",
        }}
      >
        <h2>Store</h2>
        <p>Multiplier: x{multiplier}</p>
        <p>Upgrade Cost: {multiplierPrice} points</p>
        <button
          onClick={buyMultiplier}
          disabled={points < multiplierPrice}
          style={{
            padding: "10px",
            fontSize: "16px",
            cursor: points >= multiplierPrice ? "pointer" : "not-allowed",
          }}
        >
          Buy Multiplier
        </button>
      </div>

      {/* Right panel */}
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
        {/* Score display above button */}
        <h1>Points: {points}</h1>

        {/* Click button */}
        <button
          onClick={handleClick}
          style={{
            width: "200px",
            height: "200px",
            fontSize: "40px",
            borderRadius: "50%",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            cursor: "pointer",
            transition: "transform 0.1s",
            transform: isClicked ? "scale(0.8)" : "scale(1)",
          }}
        >
          Click Me
        </button>

        {/* Reset button below the main button */}
        <button
          onClick={resetGame}
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            fontSize: "16px",
            cursor: "pointer",
            borderRadius: "5px",
            backgroundColor: "#f44336",
            color: "white",
            border: "none",
          }}
        >
          Reset Game
        </button>

        {/* Total points in bottom-right */}
        <div
          style={{
            position: "absolute",
            bottom: "10px",
            right: "10px",
            fontSize: "14px",
            color: "#333",
            backgroundColor: "rgba(255, 255, 255, 0.7)",
            padding: "5px 10px",
            borderRadius: "5px",
          }}
        >
          Total Points: {totalPoints}
        </div>
      </div>
    </div>
  );
}