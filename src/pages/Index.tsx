import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Icon from "@/components/ui/icon";

const Index = () => {
  const [selectedMode, setSelectedMode] = useState<string | null>(null);
  const [selectedDrone, setSelectedDrone] = useState<string | null>(null);
  const [selectedMission, setSelectedMission] = useState<string | null>(null);
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [gameStarted, setGameStarted] = useState(false);

  // Игровые состояния
  const [dronePosition, setDronePosition] = useState({
    x: 50,
    y: 50,
    rotation: 0,
  });
  const [speed, setSpeed] = useState(0);
  const [altitude, setAltitude] = useState(150);
  const [ammo, setAmmo] = useState(100);
  const [targets, setTargets] = useState([
    { id: 1, x: 20, y: 30, destroyed: false },
    { id: 2, x: 70, y: 20, destroyed: false },
    { id: 3, x: 40, y: 80, destroyed: false },
    { id: 4, x: 80, y: 70, destroyed: false },
  ]);
  const [explosions, setExplosions] = useState<
    { id: number; x: number; y: number }[]
  >([]);
  const [score, setScore] = useState(0);
  const [keys, setKeys] = useState({
    w: false,
    s: false,
    a: false,
    d: false,
    space: false,
  });

  const gameModes = [
    {
      id: "missions",
      title: "МИССИИ",
      description: "Выполняй боевые задания и зарабатывай опыт",
      icon: "Target",
      missions: [
        { name: "Штурм базы", difficulty: "Сложно", targets: "Наземные цели" },
        {
          name: "Воздушный бой",
          difficulty: "Средне",
          targets: "Вражеские дроны",
        },
        { name: "Разведка", difficulty: "Легко", targets: "Скрытность" },
        {
          name: "Сопровождение",
          difficulty: "Средне",
          targets: "Защита союзников",
        },
      ],
    },
    {
      id: "freefly",
      title: "СВОБОДНЫЙ ПОЛЕТ",
      description: "Исследуй карты и тренируй навыки пилотирования",
      icon: "Plane",
      areas: [
        { name: "Пустыня", weather: "Ясно", enemies: "Низко" },
        { name: "Город", weather: "Дождь", enemies: "Высоко" },
        { name: "Горы", weather: "Туман", enemies: "Средне" },
        { name: "База", weather: "Ночь", enemies: "Очень высоко" },
      ],
    },
  ];

  const drones = [
    {
      id: "raptor",
      name: "РАПTOR X1",
      type: "Штурмовой",
      speed: 90,
      armor: 70,
      firepower: 95,
      weapons: ["Ракеты", "Пулемет"],
    },
    {
      id: "stealth",
      name: "SHADOW PRO",
      type: "Разведчик",
      speed: 95,
      armor: 40,
      firepower: 60,
      weapons: ["Камера", "Глушилка"],
    },
    {
      id: "guardian",
      name: "GUARDIAN MK2",
      type: "Защитник",
      speed: 60,
      armor: 95,
      firepower: 80,
      weapons: ["Щит", "Лазер"],
    },
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Легко":
        return "bg-green-500";
      case "Средне":
        return "bg-yellow-500";
      case "Сложно":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getEnemyColor = (level: string) => {
    switch (level) {
      case "Низко":
        return "bg-green-500";
      case "Средне":
        return "bg-yellow-500";
      case "Высоко":
        return "bg-orange-500";
      case "Очень высоко":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  // Управление клавишами
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const key = event.key.toLowerCase();
    if (["w", "s", "a", "d"].includes(key)) {
      setKeys((prev) => ({ ...prev, [key]: true }));
    }
    if (key === " ") {
      event.preventDefault();
      setKeys((prev) => ({ ...prev, space: true }));
      shoot();
    }
    if (key === "escape") {
      setGameStarted(false);
    }
  }, []);

  const handleKeyUp = useCallback((event: KeyboardEvent) => {
    const key = event.key.toLowerCase();
    if (["w", "s", "a", "d"].includes(key)) {
      setKeys((prev) => ({ ...prev, [key]: false }));
    }
    if (key === " ") {
      setKeys((prev) => ({ ...prev, space: false }));
    }
  }, []);

  // Движение дрона
  useEffect(() => {
    if (!gameStarted) return;

    const interval = setInterval(() => {
      setDronePosition((prev) => {
        let newX = prev.x;
        let newY = prev.y;
        let newRotation = prev.rotation;
        let newSpeed = 0;

        if (keys.w) {
          newY = Math.max(0, newY - 1);
          newSpeed = 85;
        }
        if (keys.s) {
          newY = Math.min(100, newY + 1);
          newSpeed = 85;
        }
        if (keys.a) {
          newX = Math.max(0, newX - 1);
          newRotation -= 2;
          newSpeed = 65;
        }
        if (keys.d) {
          newX = Math.min(100, newX + 1);
          newRotation += 2;
          newSpeed = 65;
        }

        setSpeed(newSpeed);
        return { x: newX, y: newY, rotation: newRotation };
      });
    }, 50);

    return () => clearInterval(interval);
  }, [keys, gameStarted]);

  // Управление событиями клавиатуры
  useEffect(() => {
    if (gameStarted) {
      window.addEventListener("keydown", handleKeyDown);
      window.addEventListener("keyup", handleKeyUp);
      return () => {
        window.removeEventListener("keydown", handleKeyDown);
        window.removeEventListener("keyup", handleKeyUp);
      };
    }
  }, [gameStarted, handleKeyDown, handleKeyUp]);

  // Функция стрельбы
  const shoot = () => {
    if (ammo <= 0) return;

    setAmmo((prev) => Math.max(0, prev - 10));

    // Проверка попадания по целям
    targets.forEach((target) => {
      if (!target.destroyed) {
        const distance = Math.sqrt(
          Math.pow(dronePosition.x - target.x, 2) +
            Math.pow(dronePosition.y - target.y, 2),
        );

        if (distance < 15) {
          setTargets((prev) =>
            prev.map((t) =>
              t.id === target.id ? { ...t, destroyed: true } : t,
            ),
          );
          setScore((prev) => prev + 100);

          // Добавить взрыв
          const explosionId = Date.now();
          setExplosions((prev) => [
            ...prev,
            { id: explosionId, x: target.x, y: target.y },
          ]);
          setTimeout(() => {
            setExplosions((prev) =>
              prev.filter((exp) => exp.id !== explosionId),
            );
          }, 1000);
        }
      }
    });
  };

  const startMission = (missionName: string) => {
    setSelectedMission(missionName);
    setGameStarted(true);
    // Сброс игрового состояния
    setDronePosition({ x: 50, y: 50, rotation: 0 });
    setSpeed(0);
    setAltitude(150);
    setAmmo(100);
    setScore(0);
    setTargets([
      { id: 1, x: 20, y: 30, destroyed: false },
      { id: 2, x: 70, y: 20, destroyed: false },
      { id: 3, x: 40, y: 80, destroyed: false },
      { id: 4, x: 80, y: 70, destroyed: false },
    ]);
  };

  const startFreefly = (areaName: string) => {
    setSelectedArea(areaName);
    setGameStarted(true);
    // Сброс игрового состояния
    setDronePosition({ x: 50, y: 50, rotation: 0 });
    setSpeed(0);
    setAltitude(150);
    setAmmo(100);
    setScore(0);
    setTargets([
      { id: 1, x: 30, y: 40, destroyed: false },
      { id: 2, x: 60, y: 30, destroyed: false },
    ]);
  };

  if (gameStarted) {
    return (
      <div className="h-screen w-full bg-black text-white font-['Orbitron'] relative overflow-hidden">
        {/* Игровая область */}
        <div
          className="w-full h-full bg-cover bg-center relative"
          style={{
            backgroundImage:
              "url(/img/25999155-81ec-495e-ab17-cfc22eae044b.jpg)",
          }}
        >
          {/* Прицел */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
            <div className="w-12 h-12 border-2 border-orange-400 rounded-full relative">
              <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-orange-400 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute top-0 left-1/2 w-0.5 h-4 bg-orange-400 transform -translate-x-1/2"></div>
              <div className="absolute bottom-0 left-1/2 w-0.5 h-4 bg-orange-400 transform -translate-x-1/2"></div>
              <div className="absolute left-0 top-1/2 h-0.5 w-4 bg-orange-400 transform -translate-y-1/2"></div>
              <div className="absolute right-0 top-1/2 h-0.5 w-4 bg-orange-400 transform -translate-y-1/2"></div>
            </div>
          </div>

          {/* Карта (вид сверху) */}
          <div className="absolute bottom-4 right-4 w-48 h-48 bg-black/70 border border-cyan-400 rounded-lg p-2">
            <div className="text-xs text-cyan-400 mb-1 text-center">КАРТА</div>
            <div className="relative w-full h-full bg-slate-800/50 rounded">
              {/* Дрон на карте */}
              <div
                className="absolute w-2 h-2 bg-orange-400 rounded-full transform -translate-x-1/2 -translate-y-1/2 transition-all duration-100"
                style={{
                  left: `${dronePosition.x}%`,
                  top: `${dronePosition.y}%`,
                  transform: `translate(-50%, -50%) rotate(${dronePosition.rotation}deg)`,
                }}
              >
                <div className="absolute top-0 left-1/2 w-0.5 h-1 bg-orange-400 transform -translate-x-1/2 -translate-y-full"></div>
              </div>

              {/* Цели на карте */}
              {targets.map(
                (target) =>
                  !target.destroyed && (
                    <div
                      key={target.id}
                      className="absolute w-1.5 h-1.5 bg-red-400 rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-pulse"
                      style={{
                        left: `${target.x}%`,
                        top: `${target.y}%`,
                      }}
                    ></div>
                  ),
              )}

              {/* Взрывы на карте */}
              {explosions.map((explosion) => (
                <div
                  key={explosion.id}
                  className="absolute w-3 h-3 bg-yellow-400 rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-ping"
                  style={{
                    left: `${explosion.x}%`,
                    top: `${explosion.y}%`,
                  }}
                ></div>
              ))}
            </div>
          </div>

          {/* HUD - левая панель */}
          <div className="absolute top-4 left-4 space-y-4">
            <div className="bg-black/70 border border-orange-400 rounded-lg p-3 min-w-48">
              <div className="text-orange-400 text-sm font-bold mb-2">
                СТАТУС ДРОНА
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-xs text-gray-300">Скорость:</span>
                  <span className="text-orange-400 font-bold">
                    {speed} км/ч
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-gray-300">Высота:</span>
                  <span className="text-green-400 font-bold">{altitude} м</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-gray-300">Боезапас:</span>
                  <span className="text-red-400 font-bold">{ammo}%</span>
                </div>
              </div>
            </div>

            <div className="bg-black/70 border border-cyan-400 rounded-lg p-3">
              <div className="text-cyan-400 text-sm font-bold mb-2">МИССИЯ</div>
              <div className="text-xs text-gray-300">
                {selectedMission ? selectedMission : selectedArea}
              </div>
              <div className="text-orange-400 text-lg font-bold mt-2">
                СЧЕТ: {score}
              </div>
            </div>
          </div>

          {/* HUD - верхняя панель */}
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
            <div className="bg-black/70 border border-green-400 rounded-lg px-6 py-2">
              <div className="text-green-400 text-sm font-bold">
                ЦЕЛИ: {targets.filter((t) => !t.destroyed).length} /{" "}
                {targets.length}
              </div>
            </div>
          </div>

          {/* Управление */}
          <div className="absolute bottom-4 left-4">
            <div className="bg-black/70 border border-gray-500 rounded-lg p-3 text-xs text-gray-300">
              <div className="mb-1">
                <strong>WASD</strong> - движение
              </div>
              <div className="mb-1">
                <strong>SPACE</strong> - стрельба
              </div>
              <div>
                <strong>ESC</strong> - выход
              </div>
            </div>
          </div>

          {/* Индикатор попадания */}
          {keys.space && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30">
              <div className="w-16 h-16 border-4 border-red-400 rounded-full animate-ping"></div>
            </div>
          )}

          {/* Взрывы на экране */}
          {explosions.map((explosion) => (
            <div
              key={explosion.id}
              className="absolute z-25 pointer-events-none"
              style={{
                left: `${explosion.x}%`,
                top: `${explosion.y}%`,
                transform: "translate(-50%, -50%)",
              }}
            >
              <div className="w-20 h-20 bg-gradient-radial from-yellow-400 via-orange-500 to-red-600 rounded-full animate-ping opacity-80"></div>
              <div className="absolute top-1/2 left-1/2 w-12 h-12 bg-gradient-radial from-white via-yellow-400 to-orange-500 rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
            </div>
          ))}
        </div>

        {/* Кнопка выхода */}
        <Button
          className="absolute top-4 right-4 bg-red-600 hover:bg-red-700 border border-red-500"
          onClick={() => {
            setGameStarted(false);
            setSelectedMission(null);
            setSelectedArea(null);
            setSelectedMode(null);
          }}
        >
          <Icon name="X" size={16} className="mr-2" />
          ВЫХОД
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white font-['Orbitron']">
      {/* Header */}
      <div
        className="relative h-screen bg-cover bg-center"
        style={{
          backgroundImage: "url(/img/5215ec15-9fdd-4563-8447-3ab60130aea4.jpg)",
        }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative z-10 flex flex-col items-center justify-center h-full px-4">
          <div className="text-center mb-8 animate-fade-in">
            <h1 className="text-6xl md:text-8xl font-bold mb-4 bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 bg-clip-text text-transparent">
              FPV DRONE
            </h1>
            <h2 className="text-4xl md:text-6xl font-bold mb-6 text-cyan-400">
              COMBAT
            </h2>
            <p className="text-xl md:text-2xl text-gray-300 max-w-2xl">
              Боевые действия от первого лица. Аркадный экшен с множественными
              режимами боя.
            </p>
          </div>

          <div className="flex gap-4 mb-8">
            <Button
              size="lg"
              className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold px-8 py-4 text-lg transform hover:scale-105 transition-all"
              onClick={() => {
                setSelectedMode("missions");
                setTimeout(() => {
                  const element = document.getElementById("game-mode-section");
                  element?.scrollIntoView({ behavior: "smooth" });
                }, 100);
              }}
            >
              <Icon name="Target" className="mr-2" size={24} />
              МИССИИ
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black font-bold px-8 py-4 text-lg transform hover:scale-105 transition-all"
              onClick={() => {
                setSelectedMode("freefly");
                setTimeout(() => {
                  const element = document.getElementById("game-mode-section");
                  element?.scrollIntoView({ behavior: "smooth" });
                }, 100);
              }}
            >
              <Icon name="Plane" className="mr-2" size={24} />
              СВОБОДНЫЙ ПОЛЕТ
            </Button>
          </div>
        </div>
      </div>

      {/* Game Mode Selection */}
      {selectedMode && (
        <div id="game-mode-section" className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-cyan-400">
              {selectedMode === "missions" ? "ВЫБЕРИ МИССИЮ" : "ВЫБЕРИ ЗОНУ"}
            </h2>
            <Button
              variant="ghost"
              onClick={() => setSelectedMode(null)}
              className="text-gray-400 hover:text-white"
            >
              <Icon name="ArrowLeft" className="mr-2" size={20} />
              Назад к выбору режима
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {selectedMode === "missions"
              ? gameModes[0].missions.map((mission, index) => (
                  <Card
                    key={index}
                    className="bg-slate-800/50 border-slate-700 hover:border-orange-500 transition-all cursor-pointer transform hover:scale-105"
                  >
                    <CardHeader>
                      <CardTitle className="text-orange-400 text-lg">
                        {mission.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-400">
                            Сложность:
                          </span>
                          <Badge
                            className={`${getDifficultyColor(mission.difficulty)} text-white`}
                          >
                            {mission.difficulty}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-300">
                          <strong>Цели:</strong> {mission.targets}
                        </div>
                        <Button
                          className="w-full bg-orange-500 hover:bg-orange-600"
                          onClick={() => startMission(mission.name)}
                        >
                          ВЫБРАТЬ
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              : gameModes[1].areas.map((area, index) => (
                  <Card
                    key={index}
                    className="bg-slate-800/50 border-slate-700 hover:border-cyan-400 transition-all cursor-pointer transform hover:scale-105"
                  >
                    <CardHeader>
                      <CardTitle className="text-cyan-400 text-lg">
                        {area.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-400">Погода:</span>
                          <span className="text-sm text-white">
                            {area.weather}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-400">Враги:</span>
                          <Badge
                            className={`${getEnemyColor(area.enemies)} text-white`}
                          >
                            {area.enemies}
                          </Badge>
                        </div>
                        <Button
                          className="w-full bg-cyan-500 hover:bg-cyan-600"
                          onClick={() => startFreefly(area.name)}
                        >
                          ЛЕТЕТЬ
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
          </div>
        </div>
      )}

      {/* Drone Selection */}
      <div className="container mx-auto px-4 py-16 bg-slate-900/50">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-orange-400">
            ВЫБЕРИ ДРОН
          </h2>
          <p className="text-gray-400">
            Каждый дрон имеет уникальные характеристики и вооружение
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {drones.map((drone) => (
            <Card
              key={drone.id}
              className={`bg-slate-800/50 border-slate-700 hover:border-orange-500 transition-all cursor-pointer transform hover:scale-105 ${
                selectedDrone === drone.id
                  ? "border-orange-500 bg-orange-500/10"
                  : ""
              }`}
              onClick={() => setSelectedDrone(drone.id)}
            >
              <CardHeader>
                <CardTitle className="text-orange-400 text-xl">
                  {drone.name}
                </CardTitle>
                <Badge variant="secondary" className="w-fit">
                  {drone.type}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Stats */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-400">Скорость:</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-slate-700 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full"
                            style={{ width: `${drone.speed}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-white">
                          {drone.speed}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-400">Броня:</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-slate-700 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full"
                            style={{ width: `${drone.armor}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-white">
                          {drone.armor}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-400">
                        Огневая мощь:
                      </span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-slate-700 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-red-500 to-pink-500 h-2 rounded-full"
                            style={{ width: `${drone.firepower}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-white">
                          {drone.firepower}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Weapons */}
                  <div>
                    <h4 className="text-sm font-bold text-gray-400 mb-2">
                      ВООРУЖЕНИЕ:
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {drone.weapons.map((weapon, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs"
                        >
                          {weapon}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Button
                    className={`w-full ${
                      selectedDrone === drone.id
                        ? "bg-orange-500 hover:bg-orange-600"
                        : "bg-slate-700 hover:bg-slate-600"
                    }`}
                  >
                    {selectedDrone === drone.id ? "ВЫБРАНО" : "ВЫБРАТЬ"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Quick Start */}
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-4xl font-bold mb-8 text-cyan-400">ГОТОВ К БОЮ?</h2>
        <div className="flex justify-center gap-4">
          <Button
            size="lg"
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold px-12 py-6 text-xl transform hover:scale-105 transition-all"
          >
            <Icon name="Play" className="mr-3" size={24} />
            НАЧАТЬ ИГРУ
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-gray-500 text-gray-400 hover:bg-gray-800 font-bold px-8 py-6 text-xl"
          >
            <Icon name="Settings" className="mr-3" size={24} />
            НАСТРОЙКИ
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
