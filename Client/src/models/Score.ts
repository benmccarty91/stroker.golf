export interface Score {
  ScoreId: string;
  PlayerId: string;
  PlayerName: string;
  CourseId: string;
  CourseName: string;
  RoundType: RoundType;
  TeeboxColor: string;
  Date: number;
  PrettyDate: string;
  Score: number;
  RelativeScore: number;
}

export enum RoundType {
  FULL_18 = 'Full 18',
  FRONT_9 = 'Front 9',
  BACK_9 = 'Back 9'
}
