import GolfCourse from './GolfCourse';
import { RoundType } from './ScoreSubmission';
import { TeeBox } from './TeeBox';

export interface LiveRound {
  LiveRoundId: string;
  HostPlayerId: string;
  Players: LiveRoundPlayer[];
  CourseId: string;
  Course: GolfCourse;
  RoundDate: number;
  PrettyDate: string;
  RoundType: RoundType
}

export interface LiveRoundPlayer {
  PlayerId: string;
  PlayerName: string;
  Teebox: TeeBox;
  PhotoUrl: string;
}

export interface LiveRoundSingleHoleScore {
  HoleNumber: number;
  Score: number;
  RelativePar?: number;
}

export interface LiveRoundTypeChange {
  HostPlayerId: string;
  NewRoundType: RoundType
}