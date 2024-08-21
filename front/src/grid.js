import React, { useState } from "react";
import "./App.css"; // Include the updated CSS file

const GRID_SIZE = 14;

const ships = [
  { name: "Destroyer", size: 2 },
  { name: "Submarine", size: 3 },
  { name: "Cruiser", size: 3 },
  { name: "Battleship", size: 4 },
  { name: "Carrier", size: 5 },
];

const GridLogic = () => {
  const [selectedShip, setSelectedShip] = useState(null);
  const [grid, setGrid] = useState(Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(null)));
  const [isHorizontal, setIsHorizontal] = useState(true); // New rotation state
  const [placedShips, setPlacedShips] = useState({}); // Track placed ships

  const toggleOrientation = () => {
    setIsHorizontal(!isHorizontal);
  };

  const handleCellClick = (row, col) => {
    if (selectedShip && !placedShips[selectedShip.name]) {
      placeShip(row, col);
    }
  };

  const placeShip = (row, col) => {
    if (!selectedShip) return;

    const newGrid = [...grid];

    // Check if the ship placement is valid (doesn't overlap or go out of bounds)
    if (isPlacementValid(row, col)) {
      // Horizontal placement logic
      if (isHorizontal) {
        for (let i = 0; i < selectedShip.size; i++) {
          newGrid[row][col + i] = selectedShip.name;
        }
      }
      // Vertical placement logic
      else {
        for (let i = 0; i < selectedShip.size; i++) {
          newGrid[row + i][col] = selectedShip.name;
        }
      }

      setGrid(newGrid);
      setPlacedShips({ ...placedShips, [selectedShip.name]: { row, col, isHorizontal } }); // Track placed ship
      setSelectedShip(null); // Reset ship after placement
    } else {
      alert("Ship can't be placed here. It either overlaps with another ship or goes out of bounds.");
    }
  };

  const isPlacementValid = (row, col) => {
    // Check horizontal placement
    if (isHorizontal) {
      if (col + selectedShip.size > GRID_SIZE) return false; // Out of bounds check

      for (let i = 0; i < selectedShip.size; i++) {
        if (grid[row][col + i] !== null) return false; // Check for overlap
      }
    }
    // Check vertical placement
    else {
      if (row + selectedShip.size > GRID_SIZE) return false; // Out of bounds check

      for (let i = 0; i < selectedShip.size; i++) {
        if (grid[row + i][col] !== null) return false; // Check for overlap
      }
    }

    return true;
  };

  const resetShip = (ship) => {
    if (!placedShips[ship.name]) return;

    const { row, col, isHorizontal } = placedShips[ship.name];
    const newGrid = [...grid];

    // Remove the ship from the grid
    if (isHorizontal) {
      for (let i = 0; i < ship.size; i++) {
        newGrid[row][col + i] = null;
      }
    } else {
      for (let i = 0; i < ship.size; i++) {
        newGrid[row + i][col] = null;
      }
    }

    setGrid(newGrid);
    const updatedPlacedShips = { ...placedShips };
    delete updatedPlacedShips[ship.name];
    setPlacedShips(updatedPlacedShips);
  };

  return (
    <div className="App">
      <h1>Battleship Game</h1>
      <ShipSelection
        ships={ships}
        setSelectedShip={setSelectedShip}
        selectedShip={selectedShip}
        placedShips={placedShips}
        resetShip={resetShip}
      />
      <button onClick={toggleOrientation}>
        Rotate Ship ({isHorizontal ? "Horizontal" : "Vertical"})
      </button>
      <Grid grid={grid} handleCellClick={handleCellClick} />
    </div>
  );
};

const ShipSelection = ({ ships, setSelectedShip, selectedShip, placedShips, resetShip }) => {
  return (
    <div className="ship-selection">
      <h2>Select a Ship</h2>
      <ul>
        {ships.map((ship) => (
          <li
            key={ship.name}
            className={selectedShip && selectedShip.name === ship.name ? "selected" : ""}
            onClick={() => !placedShips[ship.name] && setSelectedShip(ship)} // Disable selection if placed
          >
            {ship.name} ({ship.size} spaces)
            {placedShips[ship.name] && (
              <button onClick={() => resetShip(ship)}>Reset</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

const Grid = ({ grid, handleCellClick }) => {
  return (
    <div className="grid">
      {grid.map((row, rowIndex) => (
        <div key={rowIndex} className="row">
          {row.map((cell, colIndex) => (
            <div
              key={colIndex}
              className={`cell ${cell ? "ship" : ""}`}
              onClick={() => handleCellClick(rowIndex, colIndex)}
            >
              {cell ? "X" : ""}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default GridLogic;
