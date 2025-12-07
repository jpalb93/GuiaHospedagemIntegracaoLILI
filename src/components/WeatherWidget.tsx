import React, { useState, useEffect } from 'react';
import { ThermometerSun, CloudSun } from 'lucide-react';

const WeatherWidget: React.FC = () => {
    const [weather, setWeather] = useState<{ temp: number; code: number } | null>({
        temp: 30,
        code: 0,
    });

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                const res = await fetch(
                    'https://api.open-meteo.com/v1/forecast?latitude=-9.39&longitude=-40.50&current=temperature_2m,weather_code&timezone=America%2FSao_Paulo'
                );
                const data = await res.json();

                if (data.current) {
                    setWeather({
                        temp: Math.round(data.current.temperature_2m),
                        code: data.current.weather_code,
                    });
                }
            } catch (e) {
                console.error('Erro ao buscar clima', e);
            }
        };

        fetchWeather();
        const weatherInterval = setInterval(fetchWeather, 900000);

        return () => clearInterval(weatherInterval);
    }, []);

    const getWeatherMessage = () => {
        if (!weather) return null;
        const { temp, code } = weather;

        const isRaining = (code >= 51 && code <= 67) || (code >= 80 && code <= 82);

        if (isRaining) return { text: `Chuvinha! 🌧️ ${temp}°C`, alert: false };
        if (temp >= 33) return { text: `Solzão! ☀️ ${temp}°C`, alert: true };
        if (temp >= 28) return { text: `Calor 🌤️ ${temp}°C`, alert: false };
        if (temp <= 25) return { text: `Fresquinho 🍃 ${temp}°C`, alert: false };

        return { text: `Petrolina • ${temp}°C`, alert: false };
    };

    const info = getWeatherMessage();

    if (!info) return null;

    return (
        <div
            className={`px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-bold font-sans shadow-lg border flex items-center gap-1.5 backdrop-blur-md transition-all animate-fadeIn
      ${info.alert ? 'bg-red-500/90 text-white border-red-400 shadow-red-500/20' : 'bg-black/40 dark:bg-black/60 text-white border-white/20 shadow-black/10'}`}
        >
            {info.alert ? (
                <ThermometerSun size={12} className="text-yellow-300 animate-breathing" />
            ) : (
                <CloudSun size={12} className="animate-breathing" />
            )}
            {info.text}
        </div>
    );
};

export default WeatherWidget;
