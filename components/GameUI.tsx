
import React from 'react';
import { GameState } from '../types';
import type { GameStats } from '../types';
import Spinner from './Spinner';

interface GameUIProps {
  gameState: GameState;
  currentImage: string;
  attempts: number;
  maxAttempts: number;
  isLoading: boolean;
  feedback: string;
  gameStats: GameStats;
  currentGuess: string;
  correctAnswer: string;
  onGuessChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onGuessSubmit: () => void;
  onStartGame: () => void;
}

const GameHeader: React.FC<{ score: number; streak: number; attempts: number; maxAttempts: number }> = ({ score, streak, attempts, maxAttempts }) => (
    <div className="w-full max-w-2xl bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 mb-6 flex justify-between items-center border border-cyan-500/20">
        <div>
            <span className="text-lg font-bold text-cyan-400">SCORE: </span>
            <span className="text-lg font-mono">{score}</span>
        </div>
        <div className="text-center">
            <span className="text-lg font-bold text-pink-400">ATTEMPTS: </span>
            <span className="text-lg font-mono">{attempts} / {maxAttempts}</span>
        </div>
        <div>
            <span className="text-lg font-bold text-yellow-400">STREAK: </span>
            <span className="text-lg font-mono">{streak}</span>
        </div>
    </div>
);

const StartScreen: React.FC<{ onStartGame: () => void }> = ({ onStartGame }) => (
    <div className="text-center bg-gray-800/50 backdrop-blur-sm p-10 rounded-xl shadow-2xl border border-cyan-500/30">
        <h1 className="text-5xl font-extrabold mb-4 text-cyan-300 tracking-wider">Image Guesser AI</h1>
        <p className="text-gray-300 mb-8 max-w-md mx-auto">
            Can you identify the object in an AI-generated image? Each wrong guess makes the image clearer. Guess correctly before you run out of attempts!
        </p>
        <button
            onClick={onStartGame}
            className="bg-cyan-500 hover:bg-cyan-400 text-gray-900 font-bold py-3 px-8 rounded-lg text-xl transition-transform transform hover:scale-105 shadow-lg shadow-cyan-500/20"
        >
            Start New Game
        </button>
    </div>
);

const EndScreen: React.FC<{ status: 'won' | 'lost'; onPlayAgain: () => void; score: number; answer: string; }> = ({ status, onPlayAgain, score, answer }) => (
    <div className="text-center bg-gray-800/70 backdrop-blur-lg p-10 rounded-xl shadow-2xl border border-cyan-500/30 animate-fade-in">
        <h1 className={`text-6xl font-extrabold mb-4 tracking-wider ${status === 'won' ? 'text-green-400' : 'text-red-500'}`}>
            {status === 'won' ? 'You Won!' : 'Game Over'}
        </h1>
        <p className="text-gray-300 mb-2 text-xl">The correct answer was: <span className="font-bold text-cyan-300">{answer}</span></p>
        <p className="text-gray-300 mb-8 text-xl">Final Score: <span className="font-bold text-yellow-400">{score}</span></p>
        <button
            onClick={onPlayAgain}
            className="bg-cyan-500 hover:bg-cyan-400 text-gray-900 font-bold py-3 px-8 rounded-lg text-xl transition-transform transform hover:scale-105 shadow-lg shadow-cyan-500/20"
        >
            Play Again
        </button>
    </div>
);

const GameUI: React.FC<GameUIProps> = (props) => {
    if (props.gameState === GameState.Start) {
        return <StartScreen onStartGame={props.onStartGame} />;
    }

    if (props.gameState === GameState.Won || props.gameState === GameState.Lost) {
        return <EndScreen status={props.gameState} onPlayAgain={props.onStartGame} score={props.gameStats.score} answer={props.correctAnswer}/>;
    }

    return (
        <div className="w-full flex flex-col items-center">
            <GameHeader score={props.gameStats.score} streak={props.gameStats.streak} attempts={props.attempts} maxAttempts={props.maxAttempts} />
            <div className="w-full max-w-2xl aspect-square bg-gray-800 rounded-lg flex items-center justify-center mb-6 relative overflow-hidden border-2 border-cyan-500/30 shadow-2xl shadow-cyan-900/20">
                {props.isLoading && (
                    <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm flex flex-col items-center justify-center z-10">
                        <Spinner />
                        <p className="mt-4 text-cyan-300">Generating next clue...</p>
                    </div>
                )}
                {props.currentImage && (
                    <img
                        src={`data:image/jpeg;base64,${props.currentImage}`}
                        alt="AI generated subject"
                        className={`object-cover w-full h-full transition-opacity duration-500 ${props.isLoading ? 'opacity-30' : 'opacity-100'}`}
                    />
                )}
            </div>

            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    props.onGuessSubmit();
                }}
                className="w-full max-w-2xl flex flex-col items-center"
            >
                <div className="w-full flex gap-3">
                    <input
                        type="text"
                        value={props.currentGuess}
                        onChange={props.onGuessChange}
                        placeholder="Type your guess here..."
                        disabled={props.isLoading}
                        className="flex-grow bg-gray-700 border-2 border-gray-600 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
                    />
                    <button
                        type="submit"
                        disabled={props.isLoading || !props.currentGuess}
                        className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-6 rounded-lg text-lg transition-transform transform hover:scale-105 disabled:bg-gray-600 disabled:cursor-not-allowed disabled:scale-100"
                    >
                        Guess
                    </button>
                </div>
                 {props.feedback && (
                    <p className="mt-4 text-center text-lg text-yellow-300">{props.feedback}</p>
                )}
            </form>
        </div>
    );
};

export default GameUI;
