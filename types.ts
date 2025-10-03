
export enum GameState {
  Start = 'start',
  Playing = 'playing',
  Won = 'won',
  Lost = 'lost',
}

export interface GameStats {
  score: number;
  streak: number;
}
