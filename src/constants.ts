import { Team } from './types';

export const TEAMS: Team[] = [
  {
    id: 'rcb',
    name: 'Royal Challengers Bengaluru',
    shortName: 'RCB',
    color: '#EC1C24',
    secondaryColor: '#FFD700',
    logo: '🏏'
  },
  {
    id: 'csk',
    name: 'Chennai Super Kings',
    shortName: 'CSK',
    color: '#FFFF00',
    secondaryColor: '#0081C9',
    logo: '🦁'
  },
  {
    id: 'mi',
    name: 'Mumbai Indians',
    shortName: 'MI',
    color: '#004BA0',
    secondaryColor: '#ED1B24',
    logo: '🌀'
  },
  {
    id: 'kkr',
    name: 'Kolkata Knight Riders',
    shortName: 'KKR',
    color: '#3A225D',
    secondaryColor: '#FFD700',
    logo: '⚖️'
  },
  {
    id: 'gt',
    name: 'Gujarat Titans',
    shortName: 'GT',
    color: '#1B2133',
    secondaryColor: '#AF913B',
    logo: '⚡'
  }
];

export const MOCK_MATCHES = [
  {
    id: 'm1',
    teamA: TEAMS[0],
    teamB: TEAMS[1],
    status: 'live',
    scoreA: '145/4 (16.2)',
    scoreB: 'Yet to bat',
    venue: 'M. Chinnaswamy Stadium, Bengaluru',
    time: '19:30 IST'
  }
];
