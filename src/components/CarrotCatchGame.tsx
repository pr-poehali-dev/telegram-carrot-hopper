import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';

type GameState = 'menu' | 'playing' | 'gameover';

interface Carrot {
  id: number;
  x: number;
  y: number;
}

const CarrotCatchGame = () => {
  const [gameState, setGameState] = useState<GameState>('menu');
  const [score, setScore] = useState(0);
  const [rabbitX, setRabbitX] = useState(50);
  const [carrots, setCarrots] = useState<Carrot[]>([]);
  const [speed, setSpeed] = useState(0.8);
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const carrotIdRef = useRef(0);
  const animationRef = useRef<number>();

  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setRabbitX(50);
    setCarrots([]);
    setSpeed(0.8);
    carrotIdRef.current = 0;
  };

  const restartGame = () => {
    startGame();
  };

  useEffect(() => {
    if (gameState !== 'playing') return;

    const spawnCarrot = () => {
      const newCarrot: Carrot = {
        id: carrotIdRef.current++,
        x: Math.random() * 90 + 5,
        y: -5,
      };
      setCarrots((prev) => [...prev, newCarrot]);
    };

    const spawnInterval = setInterval(spawnCarrot, 1500);

    return () => clearInterval(spawnInterval);
  }, [gameState]);

  useEffect(() => {
    if (gameState !== 'playing') return;

    const gameLoop = () => {
      setCarrots((prevCarrots) => {
        const newCarrots = prevCarrots
          .map((carrot) => ({
            ...carrot,
            y: carrot.y + speed,
          }))
          .filter((carrot) => {
            if (carrot.y > 75 && carrot.y < 85) {
              const distance = Math.abs(carrot.x - rabbitX);
              if (distance < 8) {
                setScore((prev) => prev + 1);
                setSpeed((prev) => Math.min(prev + 0.05, 3));
                return false;
              }
            }
            return carrot.y < 100;
          });

        return newCarrots;
      });

      animationRef.current = requestAnimationFrame(gameLoop);
    };

    animationRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gameState, rabbitX, speed]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (gameState !== 'playing' || !gameAreaRef.current) return;
    const rect = gameAreaRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const targetX = Math.max(5, Math.min(95, x));
    setRabbitX((prev) => prev + (targetX - prev) * 0.15);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (gameState !== 'playing' || !gameAreaRef.current) return;
    const rect = gameAreaRef.current.getBoundingClientRect();
    const x = ((e.touches[0].clientX - rect.left) / rect.width) * 100;
    const targetX = Math.max(5, Math.min(95, x));
    setRabbitX((prev) => prev + (targetX - prev) * 0.15);
  };

  if (gameState === 'menu') {
    return (
      <div className="h-screen w-full bg-gradient-to-b from-sky-300 via-sky-200 to-green-200 flex flex-col items-center justify-center p-4">
        <div className="text-center space-y-8 max-w-md">
          <div className="text-8xl animate-bounce">🐰</div>
          <h1 className="text-5xl font-bold text-orange-600 drop-shadow-lg">
            Заяц ловит морковку
          </h1>
          <p className="text-xl text-gray-700">
            Управляй зайцем и лови падающую морковь!
          </p>
          <Button
            onClick={startGame}
            size="lg"
            className="text-2xl py-8 px-12 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-full shadow-2xl transform hover:scale-105 transition-transform"
          >
            🎮 Начать игру
          </Button>
        </div>
      </div>
    );
  }

  if (gameState === 'gameover') {
    return (
      <div className="h-screen w-full bg-gradient-to-b from-purple-400 via-pink-300 to-orange-200 flex flex-col items-center justify-center p-4">
        <div className="text-center space-y-8 max-w-md bg-white/90 p-8 rounded-3xl shadow-2xl">
          <div className="text-7xl">😢</div>
          <h2 className="text-4xl font-bold text-gray-800">Игра окончена!</h2>
          <div className="bg-yellow-100 py-6 px-8 rounded-2xl border-4 border-yellow-400">
            <p className="text-2xl text-gray-600 mb-2">Твой счёт:</p>
            <p className="text-6xl font-bold text-orange-600">{score}</p>
          </div>
          <Button
            onClick={restartGame}
            size="lg"
            className="text-2xl py-8 px-12 bg-green-500 hover:bg-green-600 text-white font-bold rounded-full shadow-2xl transform hover:scale-105 transition-transform"
          >
            🔄 Играть снова
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={gameAreaRef}
      className="h-screen w-full bg-gradient-to-b from-sky-400 via-sky-300 to-green-300 relative overflow-hidden select-none cursor-none"
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
    >
      <div className="absolute top-8 right-8 text-7xl animate-float">☀️</div>
      
      <div className="absolute top-16 left-12 text-5xl animate-float" style={{ animationDelay: '0.5s' }}>☁️</div>
      <div className="absolute top-24 right-24 text-4xl animate-float" style={{ animationDelay: '1s' }}>☁️</div>
      <div className="absolute top-32 left-1/3 text-6xl animate-float" style={{ animationDelay: '1.5s' }}>☁️</div>

      <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/90 px-8 py-4 rounded-full shadow-xl z-10">
        <p className="text-3xl font-bold text-orange-600">
          🥕 Счёт: {score}
        </p>
      </div>

      {carrots.map((carrot) => (
        <div
          key={carrot.id}
          className="absolute text-6xl transition-transform"
          style={{
            left: `${carrot.x}%`,
            top: `${carrot.y}%`,
            transform: 'translate(-50%, -50%) rotate(15deg)',
          }}
        >
          🥕
        </div>
      ))}

      <img
        src="https://cdn.poehali.dev/projects/a1f7d45a-95df-4bc5-b706-40d58218c7df/files/e1bf0a03-daa1-49b4-bcff-5db353abf1e5.jpg"
        alt="Rabbit"
        className="absolute transition-all duration-200 ease-out"
        style={{
          left: `${rabbitX}%`,
          bottom: '8%',
          transform: 'translateX(-50%)',
          width: '120px',
          height: 'auto',
          filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))'
        }}
      />

      <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-green-600 to-transparent">
        <div className="absolute bottom-0 w-full flex justify-around text-4xl">
          <span>🌾</span>
          <span>🌿</span>
          <span>🌾</span>
          <span>🌻</span>
          <span>🌿</span>
          <span>🌾</span>
          <span>🌻</span>
          <span>🌿</span>
        </div>
      </div>
    </div>
  );
};

export default CarrotCatchGame;