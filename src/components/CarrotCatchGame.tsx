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
  const [isJumping, setIsJumping] = useState(false);
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
                setIsJumping(true);
                setTimeout(() => setIsJumping(false), 300);
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
      <div className="h-screen w-full bg-gradient-to-b from-[#87CEEB] to-[#98D982] flex flex-col items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute top-10 right-10 w-24 h-24 bg-yellow-300 rounded-full shadow-lg"></div>
        <div className="absolute top-20 left-16 w-32 h-20 bg-white rounded-full opacity-80"></div>
        <div className="absolute top-32 right-32 w-24 h-16 bg-white rounded-full opacity-70"></div>
        
        <div className="text-center space-y-8 max-w-md relative z-10">
          <img 
            src="https://cdn.poehali.dev/projects/a1f7d45a-95df-4bc5-b706-40d58218c7df/files/370c52b8-fd5c-4eca-97e2-d69782b3bd62.jpg"
            alt="Rabbit"
            className="w-48 h-48 mx-auto animate-bounce"
          />
          <h1 className="text-5xl font-bold text-[#FF6B35] drop-shadow-lg" style={{ fontFamily: 'Comic Sans MS, cursive' }}>
            Заяц ловит морковку
          </h1>
          <p className="text-xl text-gray-800 font-semibold">
            Управляй зайцем и лови падающую морковь!
          </p>
          <Button
            onClick={startGame}
            size="lg"
            className="text-2xl py-8 px-12 bg-[#FF6B35] hover:bg-[#FF8C61] text-white font-bold rounded-full shadow-2xl transform hover:scale-105 transition-transform border-4 border-[#FF4500]"
          >
            ▶ Начать игру
          </Button>
        </div>
        
        <div className="absolute bottom-0 w-full h-24 bg-[#78B159] rounded-t-[50%]"></div>
      </div>
    );
  }

  if (gameState === 'gameover') {
    return (
      <div className="h-screen w-full bg-gradient-to-b from-[#FFB6C1] to-[#FFA07A] flex flex-col items-center justify-center p-4">
        <div className="text-center space-y-8 max-w-md bg-white p-8 rounded-3xl shadow-2xl border-8 border-[#FF69B4]">
          <img 
            src="https://cdn.poehali.dev/projects/a1f7d45a-95df-4bc5-b706-40d58218c7df/files/370c52b8-fd5c-4eca-97e2-d69782b3bd62.jpg"
            alt="Rabbit"
            className="w-32 h-32 mx-auto opacity-60"
          />
          <h2 className="text-4xl font-bold text-gray-800" style={{ fontFamily: 'Comic Sans MS, cursive' }}>Игра окончена!</h2>
          <div className="bg-[#FFE66D] py-6 px-8 rounded-3xl border-4 border-[#FFC700] shadow-lg">
            <p className="text-2xl text-gray-700 mb-2 font-bold">Твой счёт:</p>
            <p className="text-6xl font-bold text-[#FF6B35]">{score}</p>
          </div>
          <Button
            onClick={restartGame}
            size="lg"
            className="text-2xl py-8 px-12 bg-[#4ECDC4] hover:bg-[#45B7AF] text-white font-bold rounded-full shadow-2xl transform hover:scale-105 transition-transform border-4 border-[#3BA99E]"
          >
            ↻ Играть снова
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={gameAreaRef}
      className="h-screen w-full bg-gradient-to-b from-[#87CEEB] to-[#98D982] relative overflow-hidden select-none cursor-none"
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
    >
      <div className="absolute top-10 right-10 w-24 h-24 bg-yellow-300 rounded-full shadow-lg animate-float"></div>
      
      <div className="absolute top-20 left-16 w-32 h-20 bg-white rounded-full opacity-80 animate-float" style={{ animationDelay: '0.5s' }}></div>
      <div className="absolute top-32 right-32 w-24 h-16 bg-white rounded-full opacity-70 animate-float" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-40 left-1/3 w-28 h-18 bg-white rounded-full opacity-75 animate-float" style={{ animationDelay: '1.5s' }}></div>

      <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white px-8 py-4 rounded-full shadow-xl z-10 border-4 border-[#FF6B35]">
        <p className="text-3xl font-bold text-[#FF6B35]" style={{ fontFamily: 'Comic Sans MS, cursive' }}>
          Счёт: {score}
        </p>
      </div>

      {carrots.map((carrot) => (
        <img
          key={carrot.id}
          src="https://cdn.poehali.dev/projects/a1f7d45a-95df-4bc5-b706-40d58218c7df/files/71e6b90f-b826-4c85-ade0-a31c01615aad.jpg"
          alt="Carrot"
          className="absolute transition-transform"
          style={{
            left: `${carrot.x}%`,
            top: `${carrot.y}%`,
            transform: 'translate(-50%, -50%)',
            width: '60px',
            height: 'auto',
            mixBlendMode: 'multiply'
          }}
        />
      ))}

      <img
        src="https://cdn.poehali.dev/projects/a1f7d45a-95df-4bc5-b706-40d58218c7df/files/4bb8a550-1507-4fb5-992c-f73cad0366e9.jpg"
        alt="Rabbit"
        className={`absolute transition-all duration-200 ease-out ${isJumping ? 'animate-bounce' : ''}`}
        style={{
          left: `${rabbitX}%`,
          bottom: isJumping ? '18%' : '12%',
          transform: 'translateX(-50%)',
          width: '140px',
          height: 'auto',
          filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.3))',
          mixBlendMode: 'multiply',
          transition: 'bottom 0.3s ease-out'
        }}
      />

      <div className="absolute top-1/3 left-8 w-24 h-32 bg-[#8B4513] rounded-t-full"></div>
      <div className="absolute top-1/4 left-6 w-32 h-24 bg-[#228B22] rounded-full opacity-80"></div>
      
      <div className="absolute top-1/2 right-16 w-20 h-28 bg-[#8B4513] rounded-t-full"></div>
      <div className="absolute top-1/2 right-12 w-28 h-20 bg-[#228B22] rounded-full opacity-80"></div>
      
      <div className="absolute top-2/3 left-1/4 w-16 h-24 bg-[#8B4513] rounded-t-full"></div>
      <div className="absolute top-2/3 left-1/4 -ml-2 w-24 h-18 bg-[#228B22] rounded-full opacity-80"></div>
      
      <div className="absolute bottom-0 w-full">
        <div className="w-full h-32 bg-[#78B159] rounded-t-[50%] relative">
          <div className="absolute -top-8 left-0 w-full flex justify-around">
            <div className="w-16 h-20 bg-[#5C9940] rounded-t-full shadow-lg"></div>
            <div className="w-12 h-16 bg-[#5C9940] rounded-t-full shadow-md"></div>
            <div className="w-20 h-24 bg-[#5C9940] rounded-t-full shadow-lg"></div>
            <div className="w-14 h-18 bg-[#5C9940] rounded-t-full shadow-md"></div>
            <div className="w-16 h-20 bg-[#5C9940] rounded-t-full shadow-lg"></div>
            <div className="w-12 h-16 bg-[#5C9940] rounded-t-full shadow-md"></div>
          </div>
          <div className="absolute top-4 left-0 w-full flex justify-around">
            <div className="w-8 h-8 bg-yellow-400 rounded-full shadow-md"></div>
            <div className="w-6 h-6 bg-pink-400 rounded-full shadow-sm"></div>
            <div className="w-8 h-8 bg-red-400 rounded-full shadow-md"></div>
            <div className="w-6 h-6 bg-yellow-400 rounded-full shadow-sm"></div>
            <div className="w-8 h-8 bg-pink-400 rounded-full shadow-md"></div>
            <div className="w-7 h-7 bg-purple-400 rounded-full shadow-sm"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarrotCatchGame;