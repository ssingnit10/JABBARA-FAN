export type Team = {
  id: string;
  name: string;
  shortName: string;
  color: string;
  secondaryColor: string;
  logo: string;
};

export type Match = {
  id: string;
  teamA: Team;
  teamB: Team;
  status: 'live' | 'upcoming' | 'completed';
  scoreA?: string;
  scoreB?: string;
  venue: string;
  time: string;
};

export type FanGroup = {
  id: string;
  name: string;
  teamId?: string;
  memberCount: number;
  description: string;
};

export type ChatMessage = {
  id: string;
  sender: string;
  text: string;
  timestamp: string;
  language: string;
  originalText?: string;
};

export type Meetup = {
  id: string;
  title: string;
  matchId: string;
  date: string;
  time: string;
  location: string;
  organizer: string;
  attendees: number;
  description: string;
};
