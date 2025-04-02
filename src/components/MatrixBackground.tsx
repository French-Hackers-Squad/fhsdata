
import React, { useEffect, useState } from 'react';

interface MatrixBackgroundProps {
  density?: number;
}

const MatrixBackground: React.FC<MatrixBackgroundProps> = ({ density = 50 }) => {
  const [characters, setCharacters] = useState<Array<{ id: number; char: string; x: number; delay: number; speed: number }>>([]);

  useEffect(() => {
    // Matrix characters (mix of random letters, numbers, and French accented chars)
    const matrixChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789$+-=*/[]{}!?<>|&^%éèêëàâäôöùûüÿçÉÈÊËÀÂÄÔÖÙÛÜŸÇ";
    
    // Create initial characters with faster animation speed
    const initialChars = Array.from({ length: density }, (_, i) => ({
      id: i,
      char: matrixChars.charAt(Math.floor(Math.random() * matrixChars.length)),
      x: Math.random() * 100, // Random horizontal position (0-100%)
      delay: Math.random() * 2, // Reduced delay for animation start (0-2s instead of 0-5s)
      speed: 1 + Math.random() * 5 // Faster speed (1-6s instead of 3-10s)
    }));
    
    setCharacters(initialChars);
    
    // Change characters more frequently
    const interval = setInterval(() => {
      setCharacters(prev => 
        prev.map(char => ({
          ...char,
          char: Math.random() > 0.7 // Increase probability of character change
            ? matrixChars.charAt(Math.floor(Math.random() * matrixChars.length)) 
            : char.char
        }))
      );
    }, 500); // Update twice per second instead of once
    
    return () => clearInterval(interval);
  }, [density]);

  return (
    <div className="matrix-bg">
      {characters.map((char) => (
        <div
          key={char.id}
          className="matrix-char"
          style={{
            left: `${char.x}%`,
            animationDuration: `${char.speed}s`,
            animationDelay: `${char.delay}s`,
          }}
        >
          {char.char}
        </div>
      ))}
    </div>
  );
};

export default MatrixBackground;
