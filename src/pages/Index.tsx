import { useState } from "react";
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

  const startMission = (missionName: string) => {
    setSelectedMission(missionName);
    setGameStarted(true);
    // Симуляция запуска игры
    alert(
      `🚁 Запуск миссии: ${missionName}!\n\nИспользуйте стрелки для управления дроном.\nПробел - стрельба\nESC - пауза\n\nУдачи в бою, пилот! 🎮`,
    );
  };

  const startFreefly = (areaName: string) => {
    setSelectedArea(areaName);
    setGameStarted(true);
    // Симуляция запуска игры
    alert(
      `🚁 Запуск свободного полета в зоне: ${areaName}!\n\nИспользуйте стрелки для управления дроном.\nПробел - стрельба\nESC - пауза\n\nИсследуйте территорию! 🎮`,
    );
  };

  if (gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white font-['Orbitron'] flex items-center justify-center">
        <div className="text-center">
          <div className="mb-8">
            <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 bg-clip-text text-transparent animate-pulse">
              ИГРА ЗАПУЩЕНА
            </h1>
            <div className="text-2xl text-cyan-400 mb-4">
              {selectedMission
                ? `Миссия: ${selectedMission}`
                : `Зона: ${selectedArea}`}
            </div>
            <div className="text-lg text-gray-300 mb-8">
              Имитация игрового процесса...
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-8 max-w-md mx-auto">
            <div className="bg-slate-800 p-4 rounded">
              <div className="text-orange-400 font-bold">СКОРОСТЬ</div>
              <div className="text-2xl">95 км/ч</div>
            </div>
            <div className="bg-slate-800 p-4 rounded">
              <div className="text-green-400 font-bold">ВЫСОТА</div>
              <div className="text-2xl">150 м</div>
            </div>
            <div className="bg-slate-800 p-4 rounded">
              <div className="text-red-400 font-bold">БОЕЗАПАС</div>
              <div className="text-2xl">100%</div>
            </div>
          </div>

          <Button
            size="lg"
            variant="outline"
            className="border-gray-500 text-gray-400 hover:bg-gray-800 font-bold px-8 py-4 text-xl"
            onClick={() => {
              setGameStarted(false);
              setSelectedMission(null);
              setSelectedArea(null);
              setSelectedMode(null);
            }}
          >
            <Icon name="ArrowLeft" className="mr-3" size={24} />
            ВЕРНУТЬСЯ В МЕНЮ
          </Button>
        </div>
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
