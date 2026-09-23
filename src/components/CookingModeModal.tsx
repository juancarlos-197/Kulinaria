import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Clock,
  Check,
  CheckCircle2,
  Flame,
  ChefHat,
  Sparkles,
} from 'lucide-react';
import { Recipe, RecipeStep } from '../types/recipe';
import { RecipeService } from '../services/recipeService';

interface CookingModeModalProps {
  recipe: Recipe;
  servings: number;
  onClose: () => void;
}

export const CookingModeModal: React.FC<CookingModeModalProps> = ({
  recipe,
  servings,
  onClose,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Timer state
  const currentStep = recipe.steps[currentStepIndex];
  const initialSeconds = (currentStep?.durationMinutes || 5) * 60;
  const [timerSeconds, setTimerSeconds] = useState(initialSeconds);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerAlertFired, setTimerAlertFired] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);

  // Scale ingredients for display reference in cooking mode
  const scaledIngredients = RecipeService.scaleRecipeIngredients(
    recipe.ingredients,
    recipe.servings || 2,
    servings
  );

  // Reset timer when step changes
  useEffect(() => {
    const stepDuration = (recipe.steps[currentStepIndex]?.durationMinutes || 5) * 60;
    setTimerSeconds(stepDuration);
    setIsTimerRunning(false);
    setTimerAlertFired(false);

    // Stop speaking if moving between steps
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [currentStepIndex, recipe.steps]);

  // Timer interval
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((sec) => sec - 1);
      }, 1000);
    } else if (timerSeconds === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      setTimerAlertFired(true);
      playChime();
    }

    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  // Audio chime using Web Audio API
  const playChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      // 3 pleasant tones
      [523.25, 659.25, 783.99].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.15);
        gain.gain.setValueAtTime(0.3, ctx.currentTime + i * 0.15);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.15 + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + i * 0.15);
        osc.stop(ctx.currentTime + i * 0.15 + 0.45);
      });
    } catch (e) {
      console.warn('Audio chime error', e);
    }
  };

  // Web Speech API Read aloud
  const toggleSpeech = () => {
    if (!('speechSynthesis' in window)) {
      alert('La síntesis de voz no está soportada en tu navegador.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      window.speechSynthesis.cancel();
      const textToSpeak = `Paso ${currentStep.stepNumber}. ${currentStep.title}. ${currentStep.instruction}. ${
        currentStep.tip ? `Consejo del chef: ${currentStep.tip}` : ''
      }`;

      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = 'es-ES';
      utterance.rate = 0.95;

      utterance.onend = () => {
        setIsSpeaking(false);
      };
      utterance.onerror = () => {
        setIsSpeaking(false);
      };

      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  // Keyboard navigation for accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        if (currentStepIndex < recipe.steps.length - 1) {
          setCurrentStepIndex((prev) => prev + 1);
        }
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        if (currentStepIndex > 0) {
          setCurrentStepIndex((prev) => prev - 1);
        }
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [currentStepIndex, recipe.steps.length, onClose]);

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progressPercent = Math.round(
    ((currentStepIndex + 1) / recipe.steps.length) * 100
  );

  return (
    <div
      role="dialog"
      aria-label="Modo cocina interactivo"
      className="fixed inset-0 z-50 bg-[#141413] text-white flex flex-col justify-between overflow-hidden selection:bg-[#E85D36]"
    >
      {/* Top Bar */}
      <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-[#E85D36] animate-pulse" />
          <div>
            <span className="text-[10px] font-mono tracking-widest uppercase text-white/50 block">
              Modo Cocina Accesible ({servings} {servings === 1 ? 'porción' : 'porciones'})
            </span>
            <h1 className="text-sm sm:text-base font-bold text-white tracking-tight truncate max-w-md">
              {recipe.title}
            </h1>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {/* Read aloud toggle */}
          <button
            onClick={toggleSpeech}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-sm border text-xs font-semibold transition-colors ${
              isSpeaking
                ? 'bg-[#E85D36] text-white border-[#E85D36]'
                : 'bg-white/5 text-white/80 border-white/20 hover:bg-white/10'
            }`}
            title="Leer este paso en voz alta"
          >
            {isSpeaking ? (
              <>
                <VolumeX className="w-4 h-4" />
                <span className="hidden sm:inline">Pausar Voz</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4" />
                <span className="hidden sm:inline">Leer en Voz Alta</span>
              </>
            )}
          </button>

          <button
            onClick={onClose}
            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-sm transition-colors"
            aria-label="Salir del modo cocina"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-white/10 h-1">
        <div
          className="bg-[#E85D36] h-full transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Center Body: Step by Step */}
      <div className="flex-1 overflow-y-auto px-6 sm:px-12 lg:px-24 py-8 flex flex-col justify-center max-w-5xl mx-auto w-full">
        <div className="flex items-center justify-between mb-4 text-white/50 text-xs sm:text-sm font-mono">
          <span>
            PASO {currentStep.stepNumber} DE {recipe.steps.length}
          </span>
          <span>{progressPercent}% completado</span>
        </div>

        {/* Huge Step Title */}
        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-6 leading-tight">
          {currentStep.title}
        </h2>

        {/* Big Instruction Text */}
        <div className="bg-white/5 border border-white/10 p-6 sm:p-8 rounded-sm mb-6">
          <p className="text-lg sm:text-2xl text-white/90 leading-relaxed font-light">
            {currentStep.instruction}
          </p>

          {currentStep.tip && (
            <div className="mt-6 pt-4 border-t border-white/10 flex items-start gap-3 text-sm sm:text-base text-amber-200">
              <Sparkles className="w-5 h-5 text-[#E85D36] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white">Consejo: </span>
                <span>{currentStep.tip}</span>
              </div>
            </div>
          )}
        </div>

        {/* Integrated Step Kitchen Timer */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white/5 border border-white/10 rounded-sm">
          <div className="flex items-center gap-4">
            <Clock className="w-6 h-6 text-[#E85D36]" />
            <div>
              <span className="text-xs text-white/50 uppercase font-mono block">
                Temporizador del Paso
              </span>
              <span
                className={`text-3xl sm:text-4xl font-mono font-bold tabular-nums tracking-wider ${
                  timerAlertFired ? 'text-[#E85D36] animate-bounce' : 'text-white'
                }`}
              >
                {formatTimer(timerSeconds)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#E85D36] hover:bg-[#D44E28] text-white font-bold text-sm rounded-sm transition-colors shadow-sm"
            >
              {isTimerRunning ? (
                <>
                  <Pause className="w-4 h-4 fill-white" />
                  <span>Pausar</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>Iniciar</span>
                </>
              )}
            </button>

            <button
              onClick={() => {
                setTimerSeconds((s) => s + 60);
              }}
              className="px-3 py-2 text-xs font-mono bg-white/10 hover:bg-white/20 text-white rounded-sm transition-colors"
              title="Añadir 1 minuto"
            >
              +1 min
            </button>

            <button
              onClick={() => {
                setTimerSeconds((currentStep.durationMinutes || 5) * 60);
                setIsTimerRunning(false);
                setTimerAlertFired(false);
              }}
              className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-sm transition-colors"
              title="Reiniciar temporizador"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {timerAlertFired && (
          <div className="mt-3 p-3 bg-[#E85D36] text-white text-xs sm:text-sm font-semibold rounded-sm text-center animate-pulse">
            🔔 ¡Tiempo cumplido para este paso! Revisa tu sartén o cazuela.
          </div>
        )}
      </div>

      {/* Bottom Step Navigation Bar */}
      <div className="px-6 py-4 bg-black/40 border-t border-white/10 flex items-center justify-between">
        <button
          onClick={() => setCurrentStepIndex((prev) => Math.max(0, prev - 1))}
          disabled={currentStepIndex === 0}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-sm border border-white/20 text-white hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Paso Anterior</span>
        </button>

        {/* Step dots */}
        <div className="hidden sm:flex items-center gap-2">
          {recipe.steps.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentStepIndex(i)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                i === currentStepIndex
                  ? 'bg-[#E85D36] w-6'
                  : i < currentStepIndex
                  ? 'bg-white/70'
                  : 'bg-white/20'
              }`}
              aria-label={`Ir al paso ${i + 1}`}
            />
          ))}
        </div>

        {currentStepIndex < recipe.steps.length - 1 ? (
          <button
            onClick={() => setCurrentStepIndex((prev) => prev + 1)}
            className="inline-flex items-center gap-2 px-6 py-2.5 text-xs sm:text-sm font-bold rounded-sm bg-white text-[#141413] hover:bg-white/90 transition-colors"
          >
            <span>Siguiente Paso</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={onClose}
            className="inline-flex items-center gap-2 px-6 py-2.5 text-xs sm:text-sm font-bold rounded-sm bg-emerald-500 text-white hover:bg-emerald-600 transition-colors"
          >
            <Check className="w-4 h-4" />
            <span>¡Finalizar y Emplatar!</span>
          </button>
        )}
      </div>
    </div>
  );
};
