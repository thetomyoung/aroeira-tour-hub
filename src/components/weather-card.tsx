import { useQuery } from "@tanstack/react-query";
import {
  CloudRain,
  Droplets,
  Sunrise,
  Sunset,
  Wind,
  Cloud,
  CloudSun,
  Sun,
  CloudLightning,
  Snowflake,
  CloudFog,
} from "lucide-react";
import { useSetting } from "@/lib/data";

type WeatherResponse = {
  current: {
    temperature_2m: number;
    apparent_temperature: number;
    weather_code: number;
    wind_speed_10m: number;
    relative_humidity_2m: number;
  };
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_probability_max: number[];
    wind_speed_10m_max: number[];
    sunrise: string[];
    sunset: string[];
  };
};

const CODES: Record<number, { label: string; icon: typeof Sun }> = {
  0: { label: "Clear sky", icon: Sun },
  1: { label: "Mainly clear", icon: CloudSun },
  2: { label: "Partly cloudy", icon: CloudSun },
  3: { label: "Overcast", icon: Cloud },
  45: { label: "Fog", icon: CloudFog },
  48: { label: "Rime fog", icon: CloudFog },
  51: { label: "Light drizzle", icon: CloudRain },
  61: { label: "Light rain", icon: CloudRain },
  63: { label: "Rain", icon: CloudRain },
  65: { label: "Heavy rain", icon: CloudRain },
  80: { label: "Rain showers", icon: CloudRain },
  95: { label: "Thunderstorm", icon: CloudLightning },
  71: { label: "Snow", icon: Snowflake },
};

const describe = (code: number) => CODES[code] ?? { label: "Fair", icon: CloudSun };
const time = (iso: string) =>
  new Date(iso).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

export function WeatherCard() {
  const { value: loc } = useSetting("weather", {
    lat: 38.5167,
    lon: -9.2167,
    label: "Aroeira, Portugal",
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ["weather", loc.lat, loc.lon],
    refetchInterval: 15 * 60 * 1000,
    queryFn: async () => {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${loc.lat}&longitude=${loc.lon}&current=temperature_2m,apparent_temperature,weather_code,wind_speed_10m,relative_humidity_2m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max,sunrise,sunset&timezone=auto&forecast_days=5`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Weather unavailable");
      return (await res.json()) as WeatherResponse;
    },
  });

  if (isLoading) {
    return <div className="glass h-72 animate-pulse rounded-2xl" />;
  }
  if (isError || !data) {
    return (
      <div className="glass rounded-2xl p-6 text-sm text-muted-foreground">
        Weather is unavailable right now. It will retry shortly.
      </div>
    );
  }

  const current = describe(data.current.weather_code);
  const CurrentIcon = current.icon;

  return (
    <div className="glass overflow-hidden rounded-2xl">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 border-b border-border/60 p-6">
        <div className="min-w-0">
          <p className="eyebrow">{loc.label}</p>
          <p className="mt-2 font-display text-6xl leading-none text-gilded">
            {Math.round(data.current.temperature_2m)}°
          </p>
          <p className="mt-1 truncate text-sm text-muted-foreground">
            {current.label} · feels {Math.round(data.current.apparent_temperature)}°
          </p>
        </div>
        <CurrentIcon className="size-14 shrink-0 text-primary" strokeWidth={1.2} />
      </div>

      <div className="grid grid-cols-2 gap-px bg-border/40 sm:grid-cols-4">
        <Stat icon={Wind} label="Wind" value={`${Math.round(data.current.wind_speed_10m)} km/h`} />
        <Stat
          icon={Droplets}
          label="Rain chance"
          value={`${data.daily.precipitation_probability_max[0] ?? 0}%`}
        />
        <Stat icon={Sunrise} label="Sunrise" value={time(data.daily.sunrise[0]!)} />
        <Stat icon={Sunset} label="Sunset" value={time(data.daily.sunset[0]!)} />
      </div>

      <ul className="divide-y divide-border/50">
        {data.daily.time.map((day, i) => {
          const d = describe(data.daily.weather_code[i]!);
          const Icon = d.icon;
          return (
            <li key={day} className="grid grid-cols-[3.2rem_auto_minmax(0,1fr)_auto] items-center gap-3 px-6 py-3">
              <span className="text-xs uppercase tracking-widest text-muted-foreground">
                {i === 0 ? "Today" : new Date(day).toLocaleDateString("en-GB", { weekday: "short" })}
              </span>
              <Icon className="size-4 shrink-0 text-primary" />
              <span className="truncate text-xs text-muted-foreground">
                {d.label} · {data.daily.precipitation_probability_max[i] ?? 0}% ·{" "}
                {Math.round(data.daily.wind_speed_10m_max[i]!)} km/h
              </span>
              <span className="text-sm tabular-nums">
                {Math.round(data.daily.temperature_2m_max[i]!)}°
                <span className="text-muted-foreground">
                  /{Math.round(data.daily.temperature_2m_min[i]!)}°
                </span>
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Sun;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-card/50 px-4 py-4">
      <Icon className="size-4 text-primary" />
      <p className="mt-2 text-[0.6rem] uppercase tracking-[0.2em] text-muted-foreground">{label}</p>
      <p className="text-sm font-semibold">{value}</p>
    </div>
  );
}
