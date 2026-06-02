"use client";

/**
 * AudioProvider - Shared Audio State Context
 */

import {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";

export type TimedLyric = {
  start: number;
  end: number;
  lyric: string;
  annotation: string;
  hiddenNote: string;
  images: string[];
  layout: "image-left" | "image-right" | "image-top";
  intensity?: "soft" | "warm" | "peak";
};

// Synced to the timestamp set provided by user
export const timedLyrics: TimedLyric[] = [
  {
    start: 22,
    end: 38,
    lyric: "For just a chance to win your heart",
    annotation: "You could set the bar beyond the stars, I'll do anything.",
    hiddenNote: "I'd do anything, anything you ask me to.",
    images: ["/images/lyric-1.jpg", "/images/lyric-2.jpg"],
    layout: "image-top",
    intensity: "warm",
  },
  {
    start: 38,
    end: 44,
    lyric: "Anything you ask me to",
    annotation: "Every promise starts from this one line.",
    hiddenNote: "No hesitation. No doubt.",
    images: ["/images/lyric-2.jpg", "/images/lyric-3.jpg"],
    layout: "image-left",
    intensity: "warm",
  },
  {
    start: 44,
    end: 54,
    lyric: "Say you want the moon, watch me learn to fly",
    annotation: "Ain't no mountain you could point to I wouldn't climb.",
    hiddenNote: "This is where the chorus starts to hit.",
    images: ["/images/lyric-3.jpg", "/images/lyric-4.jpg"],
    layout: "image-right",
    intensity: "peak",
  },
  {
    start: 54,
    end: 67,
    lyric: "It's crazy but it's true",
    annotation: "There's nothing I won't do, I'd risk it all for you.",
    hiddenNote: "Confession line.",
    images: ["/images/lyric-4.jpg", "/images/lyric-5.jpg", "/images/lyric-6.jpg"],
    layout: "image-left",
    intensity: "peak",
  },
  {
    start: 67,
    end: 78,
    lyric: "To hold your hand and call you mine",
    annotation: "I'm trying to be your man 'til the end of time.",
    hiddenNote: "Steady love, not temporary.",
    images: ["/images/lyric-5.jpg", "/images/lyric-6.jpg"],
    layout: "image-right",
    intensity: "warm",
  },
  {
    start: 78,
    end: 88,
    lyric: "I'll do anything, anything you ask me to",
    annotation: "The promise repeats, louder and clearer.",
    hiddenNote: "Still the same answer: yes.",
    images: ["/images/lyric-6.jpg", "/images/lyric-7.jpg"],
    layout: "image-left",
    intensity: "warm",
  },
  {
    start: 88,
    end: 98,
    lyric: "I would run through a fire just to be by your side",
    annotation: "If your heart's on the line, you could take mine.",
    hiddenNote: "No fear when it's for you.",
    images: ["/images/lyric-7.jpg", "/images/lyric-8.jpg"],
    layout: "image-right",
    intensity: "peak",
  },
  {
    start: 98,
    end: 111,
    lyric: "It's crazy but it's true",
    annotation: "There's nothing I won't do, I'd risk it all for you.",
    hiddenNote: "The core line returns.",
    images: ["/images/lyric-8.jpg", "/images/lyric-9.jpg"],
    layout: "image-top",
    intensity: "peak",
  },
  {
    start: 111,
    end: 123,
    lyric: "I will swim across the sea just to show you",
    annotation: "Sacrifice my life just to hold you.",
    hiddenNote: "Proof through action.",
    images: ["/images/lyric-9.jpg", "/images/lyric-10.jpg"],
    layout: "image-left",
    intensity: "peak",
  },
  {
    start: 123,
    end: 155,
    lyric: "I could go on and on to prove",
    annotation: "That you belong here in my arms.",
    hiddenNote: "Long hold before final chorus.",
    images: ["/images/lyric-10.jpg", "/images/lyric-1.jpg", "/images/lyric-9.jpg"],
    layout: "image-right",
    intensity: "warm",
  },
  {
    start: 155,
    end: 165,
    lyric: "Say you want the moon, watch me learn to fly",
    annotation: "Ain't no mountain you could point to I wouldn't climb.",
    hiddenNote: "Final lift.",
    images: ["/images/lyric-2.jpg", "/images/lyric-5.jpg"],
    layout: "image-left",
    intensity: "peak",
  },
  {
    start: 165,
    end: 178,
    lyric: "It's crazy but it's true, there's nothing I won't do",
    annotation: "I'd risk it all for you.",
    hiddenNote: "Everything leads here.",
    images: ["/images/lyric-3.jpg", "/images/lyric-8.jpg"],
    layout: "image-right",
    intensity: "peak",
  },
  {
    start: 178,
    end: 192,
    lyric: "There's nothing I won't do, I'd risk it all for you",
    annotation: "The final promise, repeated to the end.",
    hiddenNote: "Last echo.",
    images: ["/images/lyric-4.jpg", "/images/lyric-10.jpg"],
    layout: "image-top",
    intensity: "peak",
  },
];

export const SONG_CONFIG = {
  title: "Risk It All",
  artist: "Bruno Mars",
  audioSrc: "/audio/risk-it-all.mp3",
  albumArt: "/images/risk-it-all.jpg",
};

interface AudioContextValue {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isAudioLoaded: boolean;
  isAudioError: boolean;
  activeLyricIndex: number;
  followLyrics: boolean;
  wantsMusic: boolean | null;
  togglePlay: () => void;
  seek: (time: number) => void;
  setVolume: (vol: number) => void;
  toggleMute: () => void;
  setFollowLyrics: (follow: boolean) => void;
  setWantsMusic: (wants: boolean | null) => void;
  audioRef: React.RefObject<HTMLAudioElement | null>;
}

const AudioCtx = createContext<AudioContextValue | null>(null);

export function useAudio() {
  const ctx = useContext(AudioCtx);
  if (!ctx) throw new Error("useAudio must be used within AudioProvider");
  return ctx;
}

export default function AudioProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [isAudioLoaded, setIsAudioLoaded] = useState(false);
  const [isAudioError, setIsAudioError] = useState(false);
  const [activeLyricIndex, setActiveLyricIndex] = useState(-1);
  const [followLyrics, setFollowLyrics] = useState(false);
  const [wantsMusic, setWantsMusic] = useState<boolean | null>(null);

  const getActiveLyricIndex = useCallback((time: number) => {
    return timedLyrics.findIndex((line) => time >= line.start && time < line.end);
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsAudioLoaded(true);
      setIsAudioError(false);
    };

    const onTimeUpdate = () => {
      const nextTime = audio.currentTime;
      setCurrentTime(nextTime);
      setActiveLyricIndex(getActiveLyricIndex(nextTime));
    };

    const onEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      setActiveLyricIndex(-1);
    };

    const onError = () => {
      setIsAudioError(true);
      setIsAudioLoaded(false);
    };

    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("error", onError);

    if (audio.readyState >= 1) {
      setDuration(audio.duration);
      setIsAudioLoaded(true);
    }

    return () => {
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("error", onError);
    };
  }, [getActiveLyricIndex]);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(() => {
          setIsAudioError(true);
        });
    }
  }, [isPlaying]);

  const seek = useCallback(
    (time: number) => {
      const audio = audioRef.current;
      if (!audio) return;
      audio.currentTime = time;
      setCurrentTime(time);
      setActiveLyricIndex(getActiveLyricIndex(time));
    },
    [getActiveLyricIndex]
  );

  const setVolume = useCallback(
    (vol: number) => {
      const audio = audioRef.current;
      if (audio) {
        audio.volume = vol;
      }
      setVolumeState(vol);
      if (vol > 0 && isMuted) setIsMuted(false);
    },
    [isMuted]
  );

  const toggleMute = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.muted = !isMuted;
    }
    setIsMuted((prev) => !prev);
  }, [isMuted]);

  return (
    <AudioCtx.Provider
      value={{
        isPlaying,
        currentTime,
        duration,
        volume,
        isMuted,
        isAudioLoaded,
        isAudioError,
        activeLyricIndex,
        followLyrics,
        wantsMusic,
        togglePlay,
        seek,
        setVolume,
        toggleMute,
        setFollowLyrics,
        setWantsMusic,
        audioRef,
      }}
    >
      <audio ref={audioRef} src={SONG_CONFIG.audioSrc} preload="auto" />
      {children}
    </AudioCtx.Provider>
  );
}
