import { useState, useEffect, useCallback } from 'react';

interface UseTextToSpeechProps {
  language?: string;
  rate?: number;
  pitch?: number;
}

interface UseTextToSpeechReturn {
  speak: (text: string) => void;
  stop: () => void;
  isSpeaking: boolean;
  isSupported: boolean;
}

export function useTextToSpeech({
  language = 'fr-FR',
  rate = 1.0,
  pitch = 1.0,
}: UseTextToSpeechProps = {}): UseTextToSpeechReturn {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Vérifier si Web Speech Synthesis API est disponible
    if ('speechSynthesis' in window) {
      setIsSupported(true);
    } else {
      setIsSupported(false);
      console.warn('Web Speech Synthesis API non supportée par ce navigateur');
    }
  }, []);

  const speak = useCallback((text: string) => {
    if (!isSupported || !text) return;

    // Arrêter toute lecture en cours
    window.speechSynthesis.cancel();

    // Créer une nouvelle utterance
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language;
    utterance.rate = rate;
    utterance.pitch = pitch;

    // Événements
    utterance.onstart = () => {
      setIsSpeaking(true);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    utterance.onerror = (event) => {
      console.error('Erreur Text-to-Speech:', event);
      setIsSpeaking(false);
    };

    // Lancer la lecture
    window.speechSynthesis.speak(utterance);
  }, [isSupported, language, rate, pitch]);

  const stop = useCallback(() => {
    if (isSupported) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [isSupported]);

  return {
    speak,
    stop,
    isSpeaking,
    isSupported,
  };
}

