import { GolfCourse } from "src/models/GolfCourse";

export interface NewCourseSummary {
  newGolfCourse: GolfCourse;
  numHoles: Number;
  numTeeboxes: Number;
}