export type Activity = {
  title: string;
  description?: string;
  url?: string;
  subItems?: string[];
  startTime?: string;
  endTime?: string;
  location?: string;
  mapUrl?: string;
};

export type ProgramDay = {
  id: string;
  date: string;
  label: string;
  activities: Activity[];
};
