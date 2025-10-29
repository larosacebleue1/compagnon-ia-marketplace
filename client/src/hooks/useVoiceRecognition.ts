import { useState, useEffect, useRef, useCallback } from 'react';

interface UseVoiceRecognitionProps {
  onResult: (transcript: string) => void;
  onError?: (error: string) => void;
  continuous?: boolean;
  language?: string;
}

interface UseVoiceRecognitionReturn {
  isListening: boolean;
  transcript: string;
  startListening: () => void;
  stopListening: () => void;
  isSupported: boolean;
}

export function useVoiceRecognition({
  onResult,
  onError,
  continuous = false,
  language = 'fr-FR',
}: UseVoiceRecognitionProps): UseVoiceRecognitionReturn {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Vérifier si Web Speech API est disponible
    const SpeechRecognition = 
      (window as any).SpeechRecognition || 
      (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      setIsSupported(true);
      recognitionRef.current = new SpeechRecognition();
      
      // Configuration
      recognitionRef.current.continuous = continuous;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = language;
      recognitionRef.current.maxAlternatives = 1;

      // Événement : résultat de la reconnaissance
      recognitionRef.current.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }

        // Mettre à jour le transcript en temps réel
        setTranscript(interimTranscript || finalTranscript);

        // Si résultat final, appeler le callback
        if (finalTranscript) {
          onResult(finalTranscript.trim());
          setTranscript('');
        }
      };

      // Événement : erreur
      recognitionRef.current.onerror = (event: any) => {
        console.error('Erreur reconnaissance vocale:', event.error);
        setIsListening(false);
        
        const errorMessages: Record<string, string> = {
          'no-speech': 'Aucune parole détectée. Réessayez.',
          'audio-capture': 'Microphone non disponible.',
          'not-allowed': 'Permission microphone refusée.',
          'network': 'Erreur réseau.',
        };

        const message = errorMessages[event.error] || 'Erreur inconnue.';
        if (onError) {
          onError(message);
        }
      };

      // Événement : fin de reconnaissance
      recognitionRef.current.onend = () => {
        setIsListening(false);
        setTranscript('');
      };
    } else {
      setIsSupported(false);
      console.warn('Web Speech API non supportée par ce navigateur');
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [onResult, onError, continuous, language]);

  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (error) {
        console.error('Erreur démarrage reconnaissance:', error);
      }
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      setTranscript('');
    }
  }, [isListening]);

  return {
    isListening,
    transcript,
    startListening,
    stopListening,
    isSupported,
  };
}

