import { GolfHole } from './GolfHole';
import { TeeBox } from './TeeBox';

export interface GolfCourse {
  Id: string;
  Name: string;
  StreetAddress: string;
  City: string;
  State: string;
  TeeBoxes: TeeBox[];
  Holes: GolfHole[];
}
