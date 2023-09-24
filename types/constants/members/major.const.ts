import { MajorType } from "@/types/enums/members/major.enum";

export const PROGRAMMING_MAJORS = [
  {
    key: "fe",
    value: "Front End",
  },
  {
    key: "be",
    value: "Back End",
  },
  {
    key: "mobile",
    value: "Mobile",
  },
  {
    key: "ai",
    value: "Artificial Intelligence",
  },
];

export const DESIGN_MAJORS = [
  {
    key: "graphic",
    value: "Graphic Design",
  },
  {
    key: "uiux",
    value: "UI/UX Design",
  },
  {
    key: "design",
    value: "Design",
  },
];

export const MAJOR_GROUPS = [
  {
    key: MajorType.Programming,
    value: "Programming",
    majors: PROGRAMMING_MAJORS,
  },
  {
    key: MajorType.Design,
    value: "Design",
    majors: DESIGN_MAJORS,
  },
];
