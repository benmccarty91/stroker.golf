import { GolfHole } from './GolfHole';
import { TeeBox } from './TeeBox';

export default interface GolfCourseMeta {
  Name: string;
  StreetAddress: string;
  City: string;
  State: string;
  CoursePar: number;
}
