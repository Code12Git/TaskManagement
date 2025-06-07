// @ts-nocheck
'use client';
import { useState, useEffect, useRef } from 'react';
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

interface VoiceOptions {
  text: string;
  modelId?: string;
  outputFormat?: string;
}

export const useVoice = () => {
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const elevenlabsRef = useRef<ElevenLabsClient | null>(null);

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY) {
      elevenlabsRef.current = new ElevenLabsClient({
        apiKey: process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY
      });
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const speak = async (text: string) => {
    try {
      if (!elevenlabsRef.current) {
        throw new Error("ElevenLabs client not initialized");
      }

      setIsSpeaking(true);
      setIsPaused(false);
      
      if (!audioRef.current) {
        audioRef.current = new Audio();
        audioRef.current.onended = () => {
          setIsSpeaking(false);
          setIsPaused(false);
        };
      } else {
        audioRef.current.pause();
      }

      const audioBlob: Blob = await elevenlabsRef.current.textToSpeech.convert(
        "pFZP5JQG7iQjrhQiiB3z", 
        {
          text,
          modelId: "eleven_multilingual_v2",
          outputFormat: "mp3_44100_128",
        } as VoiceOptions
      );

      if (!audioBlob) {
        throw new Error("Failed to convert text to speech");
      }

      const audioUrl = URL.createObjectURL(audioBlob);
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        await audioRef.current.play();
      }

    } catch (error) {
      console.error("Error with ElevenLabs:", error);
      if ('speechSynthesis' in window) {
        const msg = new SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(msg);
        msg.onend = () => setIsSpeaking(false);
      }
      setIsSpeaking(false);
    }
  };

  const pause = () => {
    if (audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause();
      setIsPaused(true);
    }
  };

  const resume = () => {
    if (audioRef.current && audioRef.current.paused) {
      audioRef.current.play();
      setIsPaused(false);
    }
  };

  const stop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsSpeaking(false);
      setIsPaused(false);
    }
  };

  return { 
    speak, 
    isSpeaking, 
    isPaused,
    pause, 
    resume, 
    stop 
  };
};