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
      <div className="h-screen w-full bg-gradient-to-b from-[#87CEEB] via-[#7EC8E3] to-[#98D982] flex flex-col items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute top-8 right-12 w-32 h-32 bg-gradient-radial from-yellow-300 via-yellow-400 to-orange-400 rounded-full shadow-2xl animate-float"></div>
        
        <img 
          src="https://cdn.poehali.dev/projects/a1f7d45a-95df-4bc5-b706-40d58218c7df/files/df011fe1-d536-40bd-a4ba-45fc024d39ce.jpg"
          alt="Cloud"
          className="absolute top-16 left-12 w-40 opacity-90 animate-float"
          style={{ animationDelay: '0.5s', mixBlendMode: 'screen' }}
        />
        <img 
          src="https://cdn.poehali.dev/projects/a1f7d45a-95df-4bc5-b706-40d58218c7df/files/df011fe1-d536-40bd-a4ba-45fc024d39ce.jpg"
          alt="Cloud"
          className="absolute top-24 right-24 w-32 opacity-80 animate-float"
          style={{ animationDelay: '1s', mixBlendMode: 'screen' }}
        />
        <img 
          src="https://cdn.poehali.dev/projects/a1f7d45a-95df-4bc5-b706-40d58218c7df/files/df011fe1-d536-40bd-a4ba-45fc024d39ce.jpg"
          alt="Cloud"
          className="absolute top-32 left-1/3 w-36 opacity-85 animate-float"
          style={{ animationDelay: '1.5s', mixBlendMode: 'screen' }}
        />
        
        <div className="text-center space-y-8 max-w-md relative z-10">
          <img 
            src="https://cdn.poehali.dev/projects/a1f7d45a-95df-4bc5-b706-40d58218c7df/files/4bb8a550-1507-4fb5-992c-f73cad0366e9.jpg"
            alt="Rabbit"
            className="w-48 h-48 mx-auto animate-bounce"
            style={{
              filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.3))',
              background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)',
              borderRadius: '50%'
            }}
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
        
        <div 
          className="absolute bottom-0 w-full h-40 bg-cover bg-center"
          style={{
            backgroundImage: `url(https://cdn.poehali.dev/projects/a1f7d45a-95df-4bc5-b706-40d58218c7df/files/8962edd5-ef7d-4319-a586-fef2aa3edec9.jpg)`,
            maskImage: 'linear-gradient(to top, black 60%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to top, black 60%, transparent 100%)'
          }}
        >
          <img 
            src="https://cdn.poehali.dev/projects/a1f7d45a-95df-4bc5-b706-40d58218c7df/files/7ce37af1-d6ba-4fb9-9307-e9fdbee37dd8.jpg"
            alt="Carrots"
            className="absolute bottom-4 left-8 w-20 h-20 object-cover rounded-lg shadow-lg"
          />
          <img 
            src="https://cdn.poehali.dev/projects/a1f7d45a-95df-4bc5-b706-40d58218c7df/files/7ce37af1-d6ba-4fb9-9307-e9fdbee37dd8.jpg"
            alt="Carrots"
            className="absolute bottom-8 right-12 w-16 h-16 object-cover rounded-lg shadow-lg"
          />
        </div>
      </div>
    );
  }

  if (gameState === 'gameover') {
    return (
      <div className="h-screen w-full bg-gradient-to-b from-[#FFB6C1] to-[#FFA07A] flex flex-col items-center justify-center p-4">
        <div className="text-center space-y-8 max-w-md bg-white p-8 rounded-3xl shadow-2xl border-8 border-[#FF69B4]">
          <img 
            src="https://cdn.poehali.dev/projects/a1f7d45a-95df-4bc5-b706-40d58218c7df/files/4bb8a550-1507-4fb5-992c-f73cad0366e9.jpg"
            alt="Rabbit"
            className="w-32 h-32 mx-auto opacity-60"
            style={{
              filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))',
              background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)',
              borderRadius: '50%'
            }}
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
      className="h-screen w-full bg-gradient-to-b from-[#87CEEB] via-[#7EC8E3] to-[#98D982] relative overflow-hidden select-none cursor-none"
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
    >
      <div className="absolute top-8 right-12 w-32 h-32 bg-gradient-radial from-yellow-300 via-yellow-400 to-orange-400 rounded-full shadow-2xl animate-float"></div>
      
      <img 
        src="https://cdn.poehali.dev/projects/a1f7d45a-95df-4bc5-b706-40d58218c7df/files/df011fe1-d536-40bd-a4ba-45fc024d39ce.jpg"
        alt="Cloud"
        className="absolute top-16 left-12 w-40 opacity-90 animate-float"
        style={{ animationDelay: '0.5s', mixBlendMode: 'screen' }}
      />
      <img 
        src="https://cdn.poehali.dev/projects/a1f7d45a-95df-4bc5-b706-40d58218c7df/files/df011fe1-d536-40bd-a4ba-45fc024d39ce.jpg"
        alt="Cloud"
        className="absolute top-24 right-24 w-32 opacity-80 animate-float"
        style={{ animationDelay: '1s', mixBlendMode: 'screen' }}
      />
      <img 
        src="https://cdn.poehali.dev/projects/a1f7d45a-95df-4bc5-b706-40d58218c7df/files/df011fe1-d536-40bd-a4ba-45fc024d39ce.jpg"
        alt="Cloud"
        className="absolute top-32 left-1/3 w-36 opacity-85 animate-float"
        style={{ animationDelay: '1.5s', mixBlendMode: 'screen' }}
      />

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
            filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
            background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)',
            borderRadius: '30%'
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
          filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.4))',
          transition: 'bottom 0.3s ease-out',
          background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)',
          borderRadius: '50%'
        }}
      />

      <div 
        className="absolute bottom-0 w-full h-48 bg-cover bg-center"
        style={{
          backgroundImage: `url(https://cdn.poehali.dev/projects/a1f7d45a-95df-4bc5-b706-40d58218c7df/files/8962edd5-ef7d-4319-a586-fef2aa3edec9.jpg)`,
          maskImage: 'linear-gradient(to top, black 70%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to top, black 70%, transparent 100%)'
        }}
      />
    </div>
  );
};

export default CarrotCatchGame;
