export interface IRecruitmentPost {
  id: number;
  title: string;
  describe: string;
  request: string;
  form: string;
  salary: string;
  dateClose: string;
  createdAt: string;
  updatedAt: string;
  level: string;
  location: string;
  user_id: number;
  skills: Skill[];
}

interface Skill {
  id: number;
  name: string;
}