import { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  RotateCcw, 
  Play, 
  Pause, 
  Shuffle, 
  Heart,
  Star,
  Droplets,
  CircleDot,
  Palette,
  Wind
} from "lucide-react";

// Game 1: Bubble Pop
function BubblePop() {
  const [bubbles, setBubbles] = useState<Array<{id: number, x: number, y: number, size: number, color: string}>>([]);
  const [score, setScore] = useState(0);
  const canvasRef = useRef<HTMLDivElement>(null);

  const colors = ['#FF6B9D', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'];

  const createBubble = useCallback(() => {
    const newBubble = {
      id: Date.now() + Math.random(),
      x: Math.random() * 80,
      y: Math.random() * 60,
      size: 20 + Math.random() * 40,
      color: colors[Math.floor(Math.random() * colors.length)]
    };
    setBubbles(prev => [...prev, newBubble]);
  }, []);

  const popBubble = (id: number) => {
    setBubbles(prev => prev.filter(b => b.id !== id));
    setScore(prev => prev + 1);
  };

  useEffect(() => {
    const interval = setInterval(createBubble, 2000);
    return () => clearInterval(interval);
  }, [createBubble]);

  return (
    <div className="relative h-64 bg-gradient-to-b from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 rounded-lg overflow-hidden" ref={canvasRef}>
      <div className="absolute top-2 left-2 text-lg font-bold text-blue-800 dark:text-blue-200">
        Score: {score}
      </div>
      {bubbles.map(bubble => (
        <div
          key={bubble.id}
          className="absolute rounded-full cursor-pointer transition-all duration-300 hover:scale-110 animate-pulse"
          style={{
            left: `${bubble.x}%`,
            top: `${bubble.y}%`,
            width: `${bubble.size}px`,
            height: `${bubble.size}px`,
            backgroundColor: bubble.color,
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
          }}
          onClick={() => popBubble(bubble.id)}
        />
      ))}
    </div>
  );
}

// Game 2: Stress Ball
function StressBall() {
  const [isPressed, setIsPressed] = useState(false);
  const [squeezes, setSqueezes] = useState(0);

  return (
    <div className="flex flex-col items-center justify-center h-64 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 rounded-lg">
      <div className="text-lg font-bold mb-4 text-purple-800 dark:text-purple-200">
        Squeezes: {squeezes}
      </div>
      <div
        className={`w-32 h-32 rounded-full cursor-pointer transition-all duration-150 ${
          isPressed ? 'scale-75' : 'scale-100'
        }`}
        style={{
          background: 'radial-gradient(circle, #FF6B9D, #C44569)',
          boxShadow: isPressed ? '0 2px 10px rgba(0,0,0,0.3)' : '0 8px 25px rgba(0,0,0,0.2)',
        }}
        onMouseDown={() => {
          setIsPressed(true);
          setSqueezes(prev => prev + 1);
        }}
        onMouseUp={() => setIsPressed(false)}
        onMouseLeave={() => setIsPressed(false)}
        onTouchStart={() => {
          setIsPressed(true);
          setSqueezes(prev => prev + 1);
        }}
        onTouchEnd={() => setIsPressed(false)}
      />
      <p className="mt-4 text-sm text-purple-600 dark:text-purple-300">Click and hold to squeeze!</p>
    </div>
  );
}

// Game 3: Color Mixer
function ColorMixer() {
  const [color1, setColor1] = useState('#FF6B9D');
  const [color2, setColor2] = useState('#4ECDC4');
  const [mixedColor, setMixedColor] = useState('#FF6B9D');

  const mixColors = () => {
    // Simple color mixing algorithm
    const r1 = parseInt(color1.substring(1, 3), 16);
    const g1 = parseInt(color1.substring(3, 5), 16);
    const b1 = parseInt(color1.substring(5, 7), 16);
    
    const r2 = parseInt(color2.substring(1, 3), 16);
    const g2 = parseInt(color2.substring(3, 5), 16);
    const b2 = parseInt(color2.substring(5, 7), 16);
    
    const r = Math.floor((r1 + r2) / 2);
    const g = Math.floor((g1 + g2) / 2);
    const b = Math.floor((b1 + b2) / 2);
    
    setMixedColor(`#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`);
  };

  return (
    <div className="h-64 p-4 bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-900 dark:to-orange-900 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <div className="text-center">
          <div className="w-16 h-16 rounded-lg mb-2 border-2 border-white shadow-lg" style={{ backgroundColor: color1 }}></div>
          <input 
            type="color" 
            value={color1} 
            onChange={(e) => setColor1(e.target.value)}
            className="w-12 h-8 rounded border-none"
          />
        </div>
        <Button onClick={mixColors} className="mx-4" data-testid="button-mix-colors">
          <Palette className="w-4 h-4 mr-2" />
          Mix
        </Button>
        <div className="text-center">
          <div className="w-16 h-16 rounded-lg mb-2 border-2 border-white shadow-lg" style={{ backgroundColor: color2 }}></div>
          <input 
            type="color" 
            value={color2} 
            onChange={(e) => setColor2(e.target.value)}
            className="w-12 h-8 rounded border-none"
          />
        </div>
      </div>
      <div className="text-center">
        <div className="w-24 h-24 rounded-lg mx-auto mb-2 border-2 border-white shadow-lg" style={{ backgroundColor: mixedColor }}></div>
        <p className="text-sm text-gray-600 dark:text-gray-300">Mixed Color</p>
      </div>
    </div>
  );
}

// Game 4: Breathing Circles
function BreathingCircles() {
  const [isBreathing, setIsBreathing] = useState(false);
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');

  useEffect(() => {
    if (!isBreathing) return;

    const cycle = () => {
      setPhase('inhale');
      setTimeout(() => setPhase('hold'), 4000);
      setTimeout(() => setPhase('exhale'), 7000);
      setTimeout(() => setPhase('inhale'), 11000);
    };

    const interval = setInterval(cycle, 11000);
    cycle();

    return () => clearInterval(interval);
  }, [isBreathing]);

  return (
    <div className="flex flex-col items-center justify-center h-64 bg-gradient-to-br from-green-100 to-blue-100 dark:from-green-900 dark:to-blue-900 rounded-lg">
      <div className="relative mb-6">
        <div 
          className={`w-32 h-32 rounded-full transition-all duration-4000 ease-in-out ${
            isBreathing ? (phase === 'inhale' ? 'scale-125' : phase === 'exhale' ? 'scale-75' : 'scale-100') : 'scale-100'
          }`}
          style={{
            background: 'radial-gradient(circle, #4ECDC4, #44A08D)',
            boxShadow: '0 0 20px rgba(78, 205, 196, 0.5)',
          }}
        />
        {isBreathing && (
          <div className="absolute inset-0 flex items-center justify-center text-white font-bold">
            {phase.toUpperCase()}
          </div>
        )}
      </div>
      <Button 
        onClick={() => setIsBreathing(!isBreathing)}
        className="mb-2"
        data-testid="button-breathing"
      >
        <Wind className="w-4 h-4 mr-2" />
        {isBreathing ? 'Stop' : 'Start'} Breathing
      </Button>
      <p className="text-sm text-center text-gray-600 dark:text-gray-300">
        Follow the circle: Inhale (4s) → Hold (3s) → Exhale (4s)
      </p>
    </div>
  );
}

// Game 5: Pattern Draw
function PatternDraw() {
  const [pattern, setPattern] = useState<Array<{x: number, y: number}>>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);

  const startDrawing = (e: React.MouseEvent<SVGSVGElement>) => {
    setIsDrawing(true);
    const rect = svgRef.current?.getBoundingClientRect();
    if (rect) {
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setPattern([{x, y}]);
    }
  };

  const draw = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!isDrawing) return;
    const rect = svgRef.current?.getBoundingClientRect();
    if (rect) {
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setPattern(prev => [...prev, {x, y}]);
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearPattern = () => {
    setPattern([]);
  };

  return (
    <div className="h-64 bg-gradient-to-br from-pink-100 to-purple-100 dark:from-pink-900 dark:to-purple-900 rounded-lg p-4">
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-semibold text-purple-800 dark:text-purple-200">Draw Patterns</h4>
        <Button size="sm" onClick={clearPattern} data-testid="button-clear-pattern">
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>
      <svg
        ref={svgRef}
        className="w-full h-48 bg-white dark:bg-gray-800 rounded cursor-crosshair"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
      >
        {pattern.length > 1 && (
          <path
            d={`M ${pattern[0].x} ${pattern[0].y} ${pattern.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ')}`}
            stroke="url(#gradient)"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />
        )}
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF6B9D" />
            <stop offset="50%" stopColor="#4ECDC4" />
            <stop offset="100%" stopColor="#96CEB4" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

// Game 6: Zen Garden
function ZenGarden() {
  const [rakeLines, setRakeLines] = useState<Array<Array<{x: number, y: number}>>>([]);
  const [currentLine, setCurrentLine] = useState<Array<{x: number, y: number}>>([]);
  const [isRaking, setIsRaking] = useState(false);

  const startRaking = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsRaking(true);
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCurrentLine([{x, y}]);
  };

  const rake = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isRaking) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCurrentLine(prev => [...prev, {x, y}]);
  };

  const stopRaking = () => {
    if (currentLine.length > 0) {
      setRakeLines(prev => [...prev, currentLine]);
      setCurrentLine([]);
    }
    setIsRaking(false);
  };

  const clearGarden = () => {
    setRakeLines([]);
    setCurrentLine([]);
  };

  return (
    <div className="h-64 bg-gradient-to-br from-amber-100 to-yellow-100 dark:from-amber-900 dark:to-yellow-900 rounded-lg p-4">
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-semibold text-amber-800 dark:text-amber-200">Zen Garden</h4>
        <Button size="sm" onClick={clearGarden} data-testid="button-clear-garden">
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>
      <div
        className="relative w-full h-48 bg-gradient-to-br from-yellow-200 to-orange-200 dark:from-yellow-800 dark:to-orange-800 rounded cursor-crosshair"
        onMouseDown={startRaking}
        onMouseMove={rake}
        onMouseUp={stopRaking}
        onMouseLeave={stopRaking}
      >
        <svg className="absolute inset-0 w-full h-full">
          {rakeLines.map((line, lineIndex) => (
            <path
              key={lineIndex}
              d={`M ${line[0]?.x} ${line[0]?.y} ${line.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ')}`}
              stroke="rgba(139, 69, 19, 0.4)"
              strokeWidth="2"
              fill="none"
            />
          ))}
          {currentLine.length > 1 && (
            <path
              d={`M ${currentLine[0].x} ${currentLine[0].y} ${currentLine.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ')}`}
              stroke="rgba(139, 69, 19, 0.6)"
              strokeWidth="2"
              fill="none"
            />
          )}
        </svg>
      </div>
    </div>
  );
}

// Game 7: Color Sort
function ColorSort() {
  const [colors, setColors] = useState<string[]>([]);
  const [sortedColors, setSortedColors] = useState<string[]>([]);
  const [score, setScore] = useState(0);

  const colorPalette = ['#FF6B9D', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'];

  const generateColors = () => {
    const shuffled = [...colorPalette].sort(() => Math.random() - 0.5);
    setColors(shuffled);
    setSortedColors([]);
  };

  const sortColor = (color: string) => {
    setColors(prev => prev.filter(c => c !== color));
    setSortedColors(prev => [...prev, color]);
    setScore(prev => prev + 1);
  };

  useEffect(() => {
    generateColors();
  }, []);

  return (
    <div className="h-64 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900 dark:to-purple-900 rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h4 className="font-semibold text-indigo-800 dark:text-indigo-200">Color Sort</h4>
        <div className="flex gap-2">
          <Badge variant="secondary">Score: {score}</Badge>
          <Button size="sm" onClick={generateColors} data-testid="button-new-colors">
            <Shuffle className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 h-40">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-2">
          <p className="text-sm font-medium mb-2 text-center">Unsorted</p>
          <div className="flex flex-wrap gap-2">
            {colors.map((color, index) => (
              <div
                key={index}
                className="w-8 h-8 rounded cursor-pointer hover:scale-110 transition-transform"
                style={{ backgroundColor: color }}
                onClick={() => sortColor(color)}
              />
            ))}
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-2">
          <p className="text-sm font-medium mb-2 text-center">Sorted</p>
          <div className="flex flex-wrap gap-2">
            {sortedColors.map((color, index) => (
              <div
                key={index}
                className="w-8 h-8 rounded"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Game 8: Shape Match
function ShapeMatch() {
  const [shapes, setShapes] = useState<Array<{id: number, shape: string, color: string, matched: boolean}>>([]);
  const [selectedShape, setSelectedShape] = useState<number | null>(null);
  const [matches, setMatches] = useState(0);

  const shapeTypes = ['circle', 'square', 'triangle'];
  const shapeColors = ['#FF6B9D', '#4ECDC4', '#45B7D1'];

  const generateShapes = () => {
    const newShapes = [];
    for (let i = 0; i < 12; i++) {
      const shape = shapeTypes[Math.floor(i / 4)];
      const color = shapeColors[Math.floor(i / 4)];
      newShapes.push({ id: i, shape, color, matched: false });
    }
    setShapes(newShapes.sort(() => Math.random() - 0.5));
    setMatches(0);
    setSelectedShape(null);
  };

  const selectShape = (id: number) => {
    if (shapes[id].matched) return;
    
    if (selectedShape === null) {
      setSelectedShape(id);
    } else if (selectedShape === id) {
      setSelectedShape(null);
    } else {
      const shape1 = shapes[selectedShape];
      const shape2 = shapes[id];
      
      if (shape1.shape === shape2.shape && shape1.color === shape2.color) {
        setShapes(prev => prev.map(s => 
          s.id === selectedShape || s.id === id ? { ...s, matched: true } : s
        ));
        setMatches(prev => prev + 1);
      }
      setSelectedShape(null);
    }
  };

  useEffect(() => {
    generateShapes();
  }, []);

  const renderShape = (shape: string, color: string) => {
    const baseClasses = "w-8 h-8";
    switch (shape) {
      case 'circle':
        return <div className={`${baseClasses} rounded-full`} style={{ backgroundColor: color }} />;
      case 'square':
        return <div className={`${baseClasses} rounded`} style={{ backgroundColor: color }} />;
      case 'triangle':
        return (
          <div 
            className={baseClasses}
            style={{
              width: 0,
              height: 0,
              borderLeft: '16px solid transparent',
              borderRight: '16px solid transparent',
              borderBottom: `32px solid ${color}`,
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-64 bg-gradient-to-br from-teal-100 to-cyan-100 dark:from-teal-900 dark:to-cyan-900 rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h4 className="font-semibold text-teal-800 dark:text-teal-200">Shape Match</h4>
        <div className="flex gap-2">
          <Badge variant="secondary">Matches: {matches}</Badge>
          <Button size="sm" onClick={generateShapes} data-testid="button-new-shapes">
            <Shuffle className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-6 gap-2 h-40">
        {shapes.map((shape) => (
          <div
            key={shape.id}
            className={`flex items-center justify-center cursor-pointer rounded transition-all ${
              shape.matched 
                ? 'bg-green-200 dark:bg-green-800' 
                : selectedShape === shape.id 
                  ? 'bg-yellow-200 dark:bg-yellow-800 scale-110' 
                  : 'bg-white dark:bg-gray-800 hover:scale-105'
            }`}
            onClick={() => selectShape(shape.id)}
          >
            {renderShape(shape.shape, shape.color)}
          </div>
        ))}
      </div>
    </div>
  );
}

// Game 9: Rain Drops
function RainDrops() {
  const [drops, setDrops] = useState<Array<{id: number, x: number, y: number, speed: number}>>([]);
  const [isRaining, setIsRaining] = useState(false);

  useEffect(() => {
    if (!isRaining) return;

    const interval = setInterval(() => {
      setDrops(prev => {
        const newDrops = prev
          .map(drop => ({ ...drop, y: drop.y + drop.speed }))
          .filter(drop => drop.y < 250);
        
        // Add new drops
        if (Math.random() < 0.3) {
          newDrops.push({
            id: Date.now() + Math.random(),
            x: Math.random() * 90,
            y: -10,
            speed: 2 + Math.random() * 3
          });
        }
        
        return newDrops;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isRaining]);

  return (
    <div className="h-64 bg-gradient-to-b from-gray-200 to-gray-400 dark:from-gray-700 dark:to-gray-900 rounded-lg overflow-hidden relative">
      <div className="absolute top-2 left-2 z-10">
        <Button size="sm" onClick={() => setIsRaining(!isRaining)} data-testid="button-rain">
          <Droplets className="w-4 h-4 mr-2" />
          {isRaining ? 'Stop' : 'Start'} Rain
        </Button>
      </div>
      {drops.map(drop => (
        <div
          key={drop.id}
          className="absolute w-1 h-4 bg-blue-400 rounded-full opacity-70"
          style={{
            left: `${drop.x}%`,
            top: `${drop.y}px`,
          }}
        />
      ))}
    </div>
  );
}

// Game 10: Kaleidoscope
function Kaleidoscope() {
  const [isAnimating, setIsAnimating] = useState(false);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    if (!isAnimating) return;

    const interval = setInterval(() => {
      setRotation(prev => (prev + 2) % 360);
    }, 50);

    return () => clearInterval(interval);
  }, [isAnimating]);

  return (
    <div className="h-64 bg-gradient-to-br from-violet-100 to-fuchsia-100 dark:from-violet-900 dark:to-fuchsia-900 rounded-lg flex flex-col items-center justify-center">
      <div className="mb-4">
        <Button onClick={() => setIsAnimating(!isAnimating)} data-testid="button-kaleidoscope">
          {isAnimating ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
          {isAnimating ? 'Pause' : 'Start'} Kaleidoscope
        </Button>
      </div>
      <div className="relative w-32 h-32">
        <div 
          className="w-full h-full rounded-full overflow-hidden"
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          <div className="w-full h-full relative">
            <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-yellow-400 rounded-full opacity-70" />
            <div className="absolute inset-2 bg-gradient-to-l from-blue-400 to-green-400 rounded-full opacity-70" />
            <div className="absolute inset-4 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-70" />
            <div className="absolute inset-6 bg-gradient-to-l from-indigo-400 to-cyan-400 rounded-full opacity-70" />
            <div className="absolute inset-8 bg-gradient-to-r from-orange-400 to-red-400 rounded-full opacity-70" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Games() {
  const games = [
    { id: 1, title: "Bubble Pop", icon: CircleDot, component: BubblePop, description: "Pop colorful bubbles for instant satisfaction!" },
    { id: 2, title: "Stress Ball", icon: Heart, component: StressBall, description: "Squeeze away your stress with a virtual stress ball." },
    { id: 3, title: "Color Mixer", icon: Palette, component: ColorMixer, description: "Mix beautiful colors and create new shades." },
    { id: 4, title: "Breathing Circles", icon: Wind, component: BreathingCircles, description: "Follow the breathing pattern to relax." },
    { id: 5, title: "Pattern Draw", icon: Star, component: PatternDraw, description: "Draw beautiful, flowing patterns." },
    { id: 6, title: "Zen Garden", icon: Wind, component: ZenGarden, description: "Rake peaceful patterns in your zen garden." },
    { id: 7, title: "Color Sort", icon: Palette, component: ColorSort, description: "Organize colors by sorting them." },
    { id: 8, title: "Shape Match", icon: Star, component: ShapeMatch, description: "Match shapes and colors in this memory game." },
    { id: 9, title: "Rain Drops", icon: Droplets, component: RainDrops, description: "Watch peaceful rain drops fall." },
    { id: 10, title: "Kaleidoscope", icon: CircleDot, component: Kaleidoscope, description: "Enjoy mesmerizing kaleidoscope patterns." },
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Satisfaction Games</h1>
        <p className="text-muted-foreground">
          Relax and de-stress with these colorful, satisfying mini-games designed to help calm your mind.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {games.map((game) => {
          const GameComponent = game.component;
          const IconComponent = game.icon;
          
          return (
            <Card key={game.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <IconComponent className="h-5 w-5 text-primary" />
                  {game.title}
                </CardTitle>
                <p className="text-sm text-muted-foreground">{game.description}</p>
              </CardHeader>
              <CardContent>
                <GameComponent />
              </CardContent>
            </Card>
          );
        })}
      </div>
    </main>
  );
}