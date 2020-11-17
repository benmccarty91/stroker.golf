import { GolfHole } from './GolfHole';
import { TeeBox } from './TeeBox';

export default interface GolfCourse {
  Name: string;
  StreetAddress: string;
  City: string;
  State: string;
  TeeBoxes: TeeBox[];
  Holes: GolfHole[];
}
