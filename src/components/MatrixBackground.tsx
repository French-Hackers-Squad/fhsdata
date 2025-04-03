import React, { useEffect, useState } from 'react';

interface MatrixBackgroundProps {
  density?: number;
}

const MatrixBackground: React.FC<MatrixBackgroundProps> = ({ density = 150 }) => {
  const [characters, setCharacters] = useState<Array<{ id: number; char: string; x: number; delay: number; speed: number; color: string }>>([]);

  useEffect(() => {
    const matrixChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789$+-=*/[]{}!?<>|&^%éèêëàâäôöùûüÿçÉÈÊËÀÂÄÔÖÙÛÜŸÇ";
    const colors = ['#0055A4', '#FFFFFF', '#EF4135'];
    
    const initialChars = Array.from({ length: density }, (_, i) => ({
      id: i,
      char: matrixChars.charAt(Math.floor(Math.random() * matrixChars.length)),
      x: Math.random() * 100,
      delay: Math.random() * 1,
      speed: 0.5 + Math.random() * 2,
      color: colors[i % 3]
    }));
    
    setCharacters(initialChars);
    
    const interval = setInterval(() => {
      setCharacters(prev => 
        prev.map(char => ({
          ...char,
          char: Math.random() > 0.7
            ? matrixChars.charAt(Math.floor(Math.random() * matrixChars.length)) 
            : char.char
        }))
      );
    }, 100);
    
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
