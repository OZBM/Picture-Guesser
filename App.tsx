import React, { useState, useCallback } from 'react';
import { GameState } from './types';
import type { GameStats } from './types';
import { SUBJECTS, INITIAL_IMAGE_PROMPT, REFINEMENT_PROMPTS, MAX_ATTEMPTS, getDynamicPrompt } from './constants';
import { generateImage, refineImage } from './services/geminiService';
import GameUI from './components/GameUI';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.Start);
  const [currentSubject, setCurrentSubject] = useState<string>('');
  const [currentImage, setCurrentImage] = useState<string>('');
  const [currentGuess, setCurrentGuess] = useState<string>('');
  const [attempts, setAttempts] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string>('');
  const [gameStats, setGameStats] = useState<GameStats>({ score: 0, streak: 0 });

  const selectRandomSubject = (): string => {
    return SUBJECTS[Math.floor(Math.random() * SUBJECTS.length)];
  };

  const startNewRound = useCallback(async () => {
    setIsLoading(true);
    setGameState(GameState.Playing);
    setCurrentGuess('');
    setFeedback('');
    setAttempts(0);
    
    const subject = selectRandomSubject();
    setCurrentSubject(subject);

    try {
      const basePrompt = INITIAL_IMAGE_PROMPT.replace('${subject}', subject);
      const prompt = getDynamicPrompt(basePrompt, gameStats.streak);
      const imageB64 = await generateImage(prompt);
      setCurrentImage(imageB64);
    } catch (error) {
      console.error("Failed to generate initial image:", error);
      setFeedback('Error generating image. Please try again.');
      setGameState(GameState.Start);
    } finally {
      setIsLoading(false);
    }
  }, [gameStats.streak]);

  const handleGuessSubmit = async () => {
    if (!currentGuess.trim()) return;

    const formattedGuess = currentGuess.trim().toLowerCase();
    const formattedSubject = currentSubject.toLowerCase();

    if (formattedGuess === formattedSubject) {
      setGameState(GameState.Won);
      setGameStats(prev => ({ score: prev.score + (MAX_ATTEMPTS - attempts) * 10, streak: prev.streak + 1 }));
      setFeedback(`Correct! It was a ${currentSubject}.`);
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      setCurrentGuess('');

      if (newAttempts >= MAX_ATTEMPTS) {
        setGameState(GameState.Lost);
        setGameStats(prev => ({ ...prev, streak: 0 }));
        setFeedback(`Game Over! The correct answer was ${currentSubject}.`);
        setIsLoading(true);
         try {
            const finalPromptTemplate = REFINEMENT_PROMPTS[REFINEMENT_PROMPTS.length - 1];
            const finalPrompt = finalPromptTemplate.replace('${subject}', currentSubject);
            const finalImage = await refineImage(currentImage, finalPrompt);
            setCurrentImage(finalImage);
        } catch (error) {
            console.error("Failed to generate final image:", error);
        } finally {
            setIsLoading(false);
        }

      } else {
        setFeedback('Incorrect. The image is getting clearer...');
        setIsLoading(true);
        try {
          const promptTemplate = REFINEMENT_PROMPTS[newAttempts - 1];
          const basePrompt = promptTemplate.replace('${subject}', currentSubject);
          const prompt = getDynamicPrompt(basePrompt, gameStats.streak);
          const imageB64 = await refineImage(currentImage, prompt);
          setCurrentImage(imageB64);
        } catch (error) {
          console.error("Failed to generate next image:", error);
          setFeedback('Error generating image. Please try again.');
        } finally {
          setIsLoading(false);
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans flex flex-col items-center justify-center p-4">
      <GameUI
        gameState={gameState}
        currentImage={currentImage}
        attempts={attempts}
        maxAttempts={MAX_ATTEMPTS}
        isLoading={isLoading}
        feedback={feedback}
        gameStats={gameStats}
        currentGuess={currentGuess}
        onGuessChange={(e) => setCurrentGuess(e.target.value)}
        onGuessSubmit={handleGuessSubmit}
        onStartGame={startNewRound}
        correctAnswer={currentSubject}
      />
    </div>
  );
};

export default App;