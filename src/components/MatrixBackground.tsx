import React, { useEffect, useState } from 'react';

interface MatrixBackgroundProps {
  density?: number;
}

const MatrixBackground: React.FC<MatrixBackgroundProps> = ({ density = 150 }) => {
  const [characters, setCharacters] = useState<Array<{ id: number; char: string; x: number; delay: number; speed: number; color: string }>>([]);

  useEffect(() => {
    // Matrix characters (mix of random letters, numbers, and French accented chars)
    const matrixChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789$+-=*/[]{}!?<>|&^%éèêëàâäôöùûüÿçÉÈÊËÀÂÄÔÖÙÛÜŸÇ";
    const colors = ['#0055A4', '#FFFFFF', '#EF4135']; // Bleu, Blanc, Rouge
    
    // Create initial characters with faster animation speed
    const initialChars = Array.from({ length: density }, (_, i) => ({
      id: i,
      char: matrixChars.charAt(Math.floor(Math.random() * matrixChars.length)),
      x: Math.random() * 100, // Random horizontal position (0-100%)
      delay: Math.random() * 1, // Reduced delay for animation start (0-1s)
      speed: 0.5 + Math.random() * 2, // Faster speed (0.5-2.5s)
      color: colors[i % 3] // Alternate between French colors
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
    }, 100); // Update 10 times per second
    
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
            color: char.color,
            textShadow: `0 0 5px ${char.color}, 0 0 10px ${char.color}`
          }}
        >
          {char.char}
        </div>
      ))}
    </div>
  );
};

export default MatrixBackground;
