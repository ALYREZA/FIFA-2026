/** FIFA World Cup 2026 match schedule — source: https://github.com/rezarahiminia/worldcup2026 */
export type MatchSeed = {
	id: string;
	stageId: string;
	homeTeamId: string | null;
	awayTeamId: string | null;
	groupId: string | null;
	stadiumId: string;
	kickoffAt: string;
	bracketSlot?: string | null;
	homeSourceMatchId?: string;
	awaySourceMatchId?: string;
	winnerAdvancesToMatchId?: string;
	winnerAdvancesAs?: 'home' | 'away';
};

export const FIFA_2026_MATCHES: MatchSeed[] = [
	{
		id: 'm-1',
		stageId: 'stage-group',
		homeTeamId: 'mex',
		awayTeamId: 'rsa',
		groupId: 'A',
		stadiumId: '1',
		kickoffAt: '2026-06-11T19:00:00.000Z'
	},
	{
		id: 'm-2',
		stageId: 'stage-group',
		homeTeamId: 'kor',
		awayTeamId: 'cze',
		groupId: 'A',
		stadiumId: '2',
		kickoffAt: '2026-06-12T02:00:00.000Z'
	},
	{
		id: 'm-3',
		stageId: 'stage-group',
		homeTeamId: 'can',
		awayTeamId: 'bih',
		groupId: 'B',
		stadiumId: '12',
		kickoffAt: '2026-06-12T19:00:00.000Z'
	},
	{
		id: 'm-4',
		stageId: 'stage-group',
		homeTeamId: 'usa',
		awayTeamId: 'par',
		groupId: 'D',
		stadiumId: '16',
		kickoffAt: '2026-06-13T01:00:00.000Z'
	},
	{
		id: 'm-5',
		stageId: 'stage-group',
		homeTeamId: 'hai',
		awayTeamId: 'sco',
		groupId: 'C',
		stadiumId: '9',
		kickoffAt: '2026-06-14T01:00:00.000Z'
	},
	{
		id: 'm-6',
		stageId: 'stage-group',
		homeTeamId: 'aus',
		awayTeamId: 'tur',
		groupId: 'D',
		stadiumId: '13',
		kickoffAt: '2026-06-14T04:00:00.000Z'
	},
	{
		id: 'm-7',
		stageId: 'stage-group',
		homeTeamId: 'bra',
		awayTeamId: 'mar',
		groupId: 'C',
		stadiumId: '11',
		kickoffAt: '2026-06-13T22:00:00.000Z'
	},
	{
		id: 'm-8',
		stageId: 'stage-group',
		homeTeamId: 'qat',
		awayTeamId: 'sui',
		groupId: 'B',
		stadiumId: '15',
		kickoffAt: '2026-06-13T19:00:00.000Z'
	},
	{
		id: 'm-9',
		stageId: 'stage-group',
		homeTeamId: 'civ',
		awayTeamId: 'ecu',
		groupId: 'E',
		stadiumId: '10',
		kickoffAt: '2026-06-14T23:00:00.000Z'
	},
	{
		id: 'm-10',
		stageId: 'stage-group',
		homeTeamId: 'ger',
		awayTeamId: 'cur',
		groupId: 'E',
		stadiumId: '5',
		kickoffAt: '2026-06-14T17:00:00.000Z'
	},
	{
		id: 'm-11',
		stageId: 'stage-group',
		homeTeamId: 'ned',
		awayTeamId: 'jpn',
		groupId: 'F',
		stadiumId: '4',
		kickoffAt: '2026-06-14T20:00:00.000Z'
	},
	{
		id: 'm-12',
		stageId: 'stage-group',
		homeTeamId: 'swe',
		awayTeamId: 'tun',
		groupId: 'F',
		stadiumId: '3',
		kickoffAt: '2026-06-15T02:00:00.000Z'
	},
	{
		id: 'm-13',
		stageId: 'stage-group',
		homeTeamId: 'irn',
		awayTeamId: 'nzl',
		groupId: 'G',
		stadiumId: '16',
		kickoffAt: '2026-06-16T01:00:00.000Z'
	},
	{
		id: 'm-14',
		stageId: 'stage-group',
		homeTeamId: 'esp',
		awayTeamId: 'cpv',
		groupId: 'H',
		stadiumId: '7',
		kickoffAt: '2026-06-15T16:00:00.000Z'
	},
	{
		id: 'm-15',
		stageId: 'stage-group',
		homeTeamId: 'bel',
		awayTeamId: 'egy',
		groupId: 'G',
		stadiumId: '14',
		kickoffAt: '2026-06-15T19:00:00.000Z'
	},
	{
		id: 'm-16',
		stageId: 'stage-group',
		homeTeamId: 'ksa',
		awayTeamId: 'uru',
		groupId: 'H',
		stadiumId: '8',
		kickoffAt: '2026-06-15T22:00:00.000Z'
	},
	{
		id: 'm-17',
		stageId: 'stage-group',
		homeTeamId: 'fra',
		awayTeamId: 'sen',
		groupId: 'I',
		stadiumId: '11',
		kickoffAt: '2026-06-16T19:00:00.000Z'
	},
	{
		id: 'm-18',
		stageId: 'stage-group',
		homeTeamId: 'irq',
		awayTeamId: 'nor',
		groupId: 'I',
		stadiumId: '9',
		kickoffAt: '2026-06-16T22:00:00.000Z'
	},
	{
		id: 'm-19',
		stageId: 'stage-group',
		homeTeamId: 'arg',
		awayTeamId: 'alg',
		groupId: 'J',
		stadiumId: '6',
		kickoffAt: '2026-06-17T01:00:00.000Z'
	},
	{
		id: 'm-20',
		stageId: 'stage-group',
		homeTeamId: 'aut',
		awayTeamId: 'jor',
		groupId: 'J',
		stadiumId: '15',
		kickoffAt: '2026-06-17T04:00:00.000Z'
	},
	{
		id: 'm-21',
		stageId: 'stage-group',
		homeTeamId: 'por',
		awayTeamId: 'cod',
		groupId: 'K',
		stadiumId: '5',
		kickoffAt: '2026-06-17T17:00:00.000Z'
	},
	{
		id: 'm-22',
		stageId: 'stage-group',
		homeTeamId: 'eng',
		awayTeamId: 'cro',
		groupId: 'L',
		stadiumId: '4',
		kickoffAt: '2026-06-17T20:00:00.000Z'
	},
	{
		id: 'm-23',
		stageId: 'stage-group',
		homeTeamId: 'uzb',
		awayTeamId: 'col',
		groupId: 'K',
		stadiumId: '1',
		kickoffAt: '2026-06-18T02:00:00.000Z'
	},
	{
		id: 'm-24',
		stageId: 'stage-group',
		homeTeamId: 'gha',
		awayTeamId: 'pan',
		groupId: 'L',
		stadiumId: '12',
		kickoffAt: '2026-06-17T23:00:00.000Z'
	},
	{
		id: 'm-25',
		stageId: 'stage-group',
		homeTeamId: 'mex',
		awayTeamId: 'kor',
		groupId: 'A',
		stadiumId: '2',
		kickoffAt: '2026-06-19T01:00:00.000Z'
	},
	{
		id: 'm-26',
		stageId: 'stage-group',
		homeTeamId: 'sui',
		awayTeamId: 'bih',
		groupId: 'B',
		stadiumId: '16',
		kickoffAt: '2026-06-18T19:00:00.000Z'
	},
	{
		id: 'm-27',
		stageId: 'stage-group',
		homeTeamId: 'can',
		awayTeamId: 'qat',
		groupId: 'B',
		stadiumId: '13',
		kickoffAt: '2026-06-18T22:00:00.000Z'
	},
	{
		id: 'm-28',
		stageId: 'stage-group',
		homeTeamId: 'cze',
		awayTeamId: 'rsa',
		groupId: 'A',
		stadiumId: '7',
		kickoffAt: '2026-06-18T16:00:00.000Z'
	},
	{
		id: 'm-29',
		stageId: 'stage-group',
		homeTeamId: 'bra',
		awayTeamId: 'hai',
		groupId: 'C',
		stadiumId: '10',
		kickoffAt: '2026-06-20T01:00:00.000Z'
	},
	{
		id: 'm-30',
		stageId: 'stage-group',
		homeTeamId: 'sco',
		awayTeamId: 'mar',
		groupId: 'C',
		stadiumId: '9',
		kickoffAt: '2026-06-19T22:00:00.000Z'
	},
	{
		id: 'm-31',
		stageId: 'stage-group',
		homeTeamId: 'usa',
		awayTeamId: 'aus',
		groupId: 'D',
		stadiumId: '14',
		kickoffAt: '2026-06-19T19:00:00.000Z'
	},
	{
		id: 'm-32',
		stageId: 'stage-group',
		homeTeamId: 'tur',
		awayTeamId: 'par',
		groupId: 'D',
		stadiumId: '15',
		kickoffAt: '2026-06-20T03:00:00.000Z'
	},
	{
		id: 'm-33',
		stageId: 'stage-group',
		homeTeamId: 'ger',
		awayTeamId: 'civ',
		groupId: 'E',
		stadiumId: '12',
		kickoffAt: '2026-06-20T20:00:00.000Z'
	},
	{
		id: 'm-34',
		stageId: 'stage-group',
		homeTeamId: 'ecu',
		awayTeamId: 'cur',
		groupId: 'E',
		stadiumId: '6',
		kickoffAt: '2026-06-21T00:00:00.000Z'
	},
	{
		id: 'm-35',
		stageId: 'stage-group',
		homeTeamId: 'ned',
		awayTeamId: 'swe',
		groupId: 'F',
		stadiumId: '5',
		kickoffAt: '2026-06-20T17:00:00.000Z'
	},
	{
		id: 'm-36',
		stageId: 'stage-group',
		homeTeamId: 'tun',
		awayTeamId: 'jpn',
		groupId: 'F',
		stadiumId: '3',
		kickoffAt: '2026-06-21T04:00:00.000Z'
	},
	{
		id: 'm-37',
		stageId: 'stage-group',
		homeTeamId: 'bel',
		awayTeamId: 'irn',
		groupId: 'G',
		stadiumId: '16',
		kickoffAt: '2026-06-21T19:00:00.000Z'
	},
	{
		id: 'm-38',
		stageId: 'stage-group',
		homeTeamId: 'nzl',
		awayTeamId: 'egy',
		groupId: 'G',
		stadiumId: '13',
		kickoffAt: '2026-06-22T01:00:00.000Z'
	},
	{
		id: 'm-39',
		stageId: 'stage-group',
		homeTeamId: 'esp',
		awayTeamId: 'ksa',
		groupId: 'H',
		stadiumId: '7',
		kickoffAt: '2026-06-21T16:00:00.000Z'
	},
	{
		id: 'm-40',
		stageId: 'stage-group',
		homeTeamId: 'uru',
		awayTeamId: 'cpv',
		groupId: 'H',
		stadiumId: '8',
		kickoffAt: '2026-06-21T22:00:00.000Z'
	},
	{
		id: 'm-41',
		stageId: 'stage-group',
		homeTeamId: 'fra',
		awayTeamId: 'irq',
		groupId: 'I',
		stadiumId: '10',
		kickoffAt: '2026-06-22T21:00:00.000Z'
	},
	{
		id: 'm-42',
		stageId: 'stage-group',
		homeTeamId: 'nor',
		awayTeamId: 'sen',
		groupId: 'I',
		stadiumId: '11',
		kickoffAt: '2026-06-23T00:00:00.000Z'
	},
	{
		id: 'm-43',
		stageId: 'stage-group',
		homeTeamId: 'arg',
		awayTeamId: 'aut',
		groupId: 'J',
		stadiumId: '4',
		kickoffAt: '2026-06-22T17:00:00.000Z'
	},
	{
		id: 'm-44',
		stageId: 'stage-group',
		homeTeamId: 'jor',
		awayTeamId: 'alg',
		groupId: 'J',
		stadiumId: '15',
		kickoffAt: '2026-06-23T03:00:00.000Z'
	},
	{
		id: 'm-45',
		stageId: 'stage-group',
		homeTeamId: 'por',
		awayTeamId: 'uzb',
		groupId: 'K',
		stadiumId: '5',
		kickoffAt: '2026-06-23T17:00:00.000Z'
	},
	{
		id: 'm-46',
		stageId: 'stage-group',
		homeTeamId: 'pan',
		awayTeamId: 'cro',
		groupId: 'L',
		stadiumId: '12',
		kickoffAt: '2026-06-23T23:00:00.000Z'
	},
	{
		id: 'm-47',
		stageId: 'stage-group',
		homeTeamId: 'col',
		awayTeamId: 'cod',
		groupId: 'K',
		stadiumId: '2',
		kickoffAt: '2026-06-24T02:00:00.000Z'
	},
	{
		id: 'm-48',
		stageId: 'stage-group',
		homeTeamId: 'eng',
		awayTeamId: 'gha',
		groupId: 'L',
		stadiumId: '9',
		kickoffAt: '2026-06-23T20:00:00.000Z'
	},
	{
		id: 'm-49',
		stageId: 'stage-group',
		homeTeamId: 'sco',
		awayTeamId: 'bra',
		groupId: 'C',
		stadiumId: '8',
		kickoffAt: '2026-06-24T22:00:00.000Z'
	},
	{
		id: 'm-50',
		stageId: 'stage-group',
		homeTeamId: 'mar',
		awayTeamId: 'hai',
		groupId: 'C',
		stadiumId: '7',
		kickoffAt: '2026-06-24T22:00:00.000Z'
	},
	{
		id: 'm-51',
		stageId: 'stage-group',
		homeTeamId: 'rsa',
		awayTeamId: 'kor',
		groupId: 'A',
		stadiumId: '3',
		kickoffAt: '2026-06-25T01:00:00.000Z'
	},
	{
		id: 'm-52',
		stageId: 'stage-group',
		homeTeamId: 'cze',
		awayTeamId: 'mex',
		groupId: 'A',
		stadiumId: '1',
		kickoffAt: '2026-06-25T01:00:00.000Z'
	},
	{
		id: 'm-53',
		stageId: 'stage-group',
		homeTeamId: 'bih',
		awayTeamId: 'qat',
		groupId: 'B',
		stadiumId: '14',
		kickoffAt: '2026-06-24T19:00:00.000Z'
	},
	{
		id: 'm-54',
		stageId: 'stage-group',
		homeTeamId: 'sui',
		awayTeamId: 'can',
		groupId: 'B',
		stadiumId: '13',
		kickoffAt: '2026-06-24T19:00:00.000Z'
	},
	{
		id: 'm-55',
		stageId: 'stage-group',
		homeTeamId: 'cur',
		awayTeamId: 'civ',
		groupId: 'E',
		stadiumId: '10',
		kickoffAt: '2026-06-25T20:00:00.000Z'
	},
	{
		id: 'm-56',
		stageId: 'stage-group',
		homeTeamId: 'ecu',
		awayTeamId: 'ger',
		groupId: 'E',
		stadiumId: '11',
		kickoffAt: '2026-06-25T20:00:00.000Z'
	},
	{
		id: 'm-57',
		stageId: 'stage-group',
		homeTeamId: 'par',
		awayTeamId: 'aus',
		groupId: 'D',
		stadiumId: '15',
		kickoffAt: '2026-06-26T02:00:00.000Z'
	},
	{
		id: 'm-58',
		stageId: 'stage-group',
		homeTeamId: 'tur',
		awayTeamId: 'usa',
		groupId: 'D',
		stadiumId: '16',
		kickoffAt: '2026-06-26T02:00:00.000Z'
	},
	{
		id: 'm-59',
		stageId: 'stage-group',
		homeTeamId: 'jpn',
		awayTeamId: 'swe',
		groupId: 'F',
		stadiumId: '4',
		kickoffAt: '2026-06-25T23:00:00.000Z'
	},
	{
		id: 'm-60',
		stageId: 'stage-group',
		homeTeamId: 'tun',
		awayTeamId: 'ned',
		groupId: 'F',
		stadiumId: '6',
		kickoffAt: '2026-06-25T23:00:00.000Z'
	},
	{
		id: 'm-61',
		stageId: 'stage-group',
		homeTeamId: 'sen',
		awayTeamId: 'irq',
		groupId: 'I',
		stadiumId: '12',
		kickoffAt: '2026-06-26T19:00:00.000Z'
	},
	{
		id: 'm-62',
		stageId: 'stage-group',
		homeTeamId: 'nor',
		awayTeamId: 'fra',
		groupId: 'I',
		stadiumId: '9',
		kickoffAt: '2026-06-26T19:00:00.000Z'
	},
	{
		id: 'm-63',
		stageId: 'stage-group',
		homeTeamId: 'egy',
		awayTeamId: 'irn',
		groupId: 'G',
		stadiumId: '14',
		kickoffAt: '2026-06-27T03:00:00.000Z'
	},
	{
		id: 'm-64',
		stageId: 'stage-group',
		homeTeamId: 'nzl',
		awayTeamId: 'bel',
		groupId: 'G',
		stadiumId: '13',
		kickoffAt: '2026-06-27T03:00:00.000Z'
	},
	{
		id: 'm-65',
		stageId: 'stage-group',
		homeTeamId: 'cpv',
		awayTeamId: 'ksa',
		groupId: 'H',
		stadiumId: '5',
		kickoffAt: '2026-06-27T00:00:00.000Z'
	},
	{
		id: 'm-66',
		stageId: 'stage-group',
		homeTeamId: 'uru',
		awayTeamId: 'esp',
		groupId: 'H',
		stadiumId: '2',
		kickoffAt: '2026-06-27T00:00:00.000Z'
	},
	{
		id: 'm-67',
		stageId: 'stage-group',
		homeTeamId: 'pan',
		awayTeamId: 'eng',
		groupId: 'L',
		stadiumId: '11',
		kickoffAt: '2026-06-27T21:00:00.000Z'
	},
	{
		id: 'm-68',
		stageId: 'stage-group',
		homeTeamId: 'cro',
		awayTeamId: 'gha',
		groupId: 'L',
		stadiumId: '10',
		kickoffAt: '2026-06-27T21:00:00.000Z'
	},
	{
		id: 'm-69',
		stageId: 'stage-group',
		homeTeamId: 'alg',
		awayTeamId: 'aut',
		groupId: 'J',
		stadiumId: '6',
		kickoffAt: '2026-06-28T02:00:00.000Z'
	},
	{
		id: 'm-70',
		stageId: 'stage-group',
		homeTeamId: 'jor',
		awayTeamId: 'arg',
		groupId: 'J',
		stadiumId: '4',
		kickoffAt: '2026-06-28T02:00:00.000Z'
	},
	{
		id: 'm-71',
		stageId: 'stage-group',
		homeTeamId: 'col',
		awayTeamId: 'por',
		groupId: 'K',
		stadiumId: '8',
		kickoffAt: '2026-06-27T23:30:00.000Z'
	},
	{
		id: 'm-72',
		stageId: 'stage-group',
		homeTeamId: 'cod',
		awayTeamId: 'uzb',
		groupId: 'K',
		stadiumId: '7',
		kickoffAt: '2026-06-27T23:30:00.000Z'
	},
	{
		id: 'm-73',
		stageId: 'stage-r32',
		homeTeamId: null,
		awayTeamId: null,
		groupId: null,
		stadiumId: '16',
		kickoffAt: '2026-06-28T19:00:00.000Z',
		bracketSlot: 'Runner-up Group A vs Runner-up Group B',
		winnerAdvancesToMatchId: 'm-90',
		winnerAdvancesAs: 'home'
	},
	{
		id: 'm-74',
		stageId: 'stage-r32',
		homeTeamId: null,
		awayTeamId: null,
		groupId: null,
		stadiumId: '9',
		kickoffAt: '2026-06-29T20:30:00.000Z',
		bracketSlot: 'Winner Group E vs 3rd Group A/B/C/D/F',
		winnerAdvancesToMatchId: 'm-89',
		winnerAdvancesAs: 'home'
	},
	{
		id: 'm-75',
		stageId: 'stage-r32',
		homeTeamId: null,
		awayTeamId: null,
		groupId: null,
		stadiumId: '3',
		kickoffAt: '2026-06-30T01:00:00.000Z',
		bracketSlot: 'Winner Group F vs Runner-up Group C',
		winnerAdvancesToMatchId: 'm-90',
		winnerAdvancesAs: 'away'
	},
	{
		id: 'm-76',
		stageId: 'stage-r32',
		homeTeamId: null,
		awayTeamId: null,
		groupId: null,
		stadiumId: '5',
		kickoffAt: '2026-06-29T17:00:00.000Z',
		bracketSlot: 'Winner Group C vs Runner-up Group F',
		winnerAdvancesToMatchId: 'm-91',
		winnerAdvancesAs: 'home'
	},
	{
		id: 'm-77',
		stageId: 'stage-r32',
		homeTeamId: null,
		awayTeamId: null,
		groupId: null,
		stadiumId: '11',
		kickoffAt: '2026-06-30T21:00:00.000Z',
		bracketSlot: 'Winner Group I vs 3rd Group C/D/F/G/H',
		winnerAdvancesToMatchId: 'm-89',
		winnerAdvancesAs: 'away'
	},
	{
		id: 'm-78',
		stageId: 'stage-r32',
		homeTeamId: null,
		awayTeamId: null,
		groupId: null,
		stadiumId: '4',
		kickoffAt: '2026-06-30T17:00:00.000Z',
		bracketSlot: 'Runner-up Group E vs Runner-up Group I',
		winnerAdvancesToMatchId: 'm-91',
		winnerAdvancesAs: 'away'
	},
	{
		id: 'm-79',
		stageId: 'stage-r32',
		homeTeamId: null,
		awayTeamId: null,
		groupId: null,
		stadiumId: '1',
		kickoffAt: '2026-07-01T01:00:00.000Z',
		bracketSlot: 'Winner Group A vs 3rd Group C/E/F/H/I',
		winnerAdvancesToMatchId: 'm-92',
		winnerAdvancesAs: 'home'
	},
	{
		id: 'm-80',
		stageId: 'stage-r32',
		homeTeamId: null,
		awayTeamId: null,
		groupId: null,
		stadiumId: '7',
		kickoffAt: '2026-07-01T16:00:00.000Z',
		bracketSlot: 'Winner Group L vs 3rd Group E/H/I/J/K',
		winnerAdvancesToMatchId: 'm-92',
		winnerAdvancesAs: 'away'
	},
	{
		id: 'm-81',
		stageId: 'stage-r32',
		homeTeamId: null,
		awayTeamId: null,
		groupId: null,
		stadiumId: '15',
		kickoffAt: '2026-07-02T00:00:00.000Z',
		bracketSlot: 'Winner Group D vs 3rd Group B/E/F/I/J',
		winnerAdvancesToMatchId: 'm-94',
		winnerAdvancesAs: 'home'
	},
	{
		id: 'm-82',
		stageId: 'stage-r32',
		homeTeamId: null,
		awayTeamId: null,
		groupId: null,
		stadiumId: '14',
		kickoffAt: '2026-07-01T20:00:00.000Z',
		bracketSlot: 'Winner Group G vs 3rd Group A/E/H/I/J',
		winnerAdvancesToMatchId: 'm-94',
		winnerAdvancesAs: 'away'
	},
	{
		id: 'm-83',
		stageId: 'stage-r32',
		homeTeamId: null,
		awayTeamId: null,
		groupId: null,
		stadiumId: '12',
		kickoffAt: '2026-07-02T23:00:00.000Z',
		bracketSlot: 'Runner-up Group K vs Runner-up Group L',
		winnerAdvancesToMatchId: 'm-93',
		winnerAdvancesAs: 'home'
	},
	{
		id: 'm-84',
		stageId: 'stage-r32',
		homeTeamId: null,
		awayTeamId: null,
		groupId: null,
		stadiumId: '16',
		kickoffAt: '2026-07-02T19:00:00.000Z',
		bracketSlot: 'Winner Group H vs Runner-up Group J',
		winnerAdvancesToMatchId: 'm-93',
		winnerAdvancesAs: 'away'
	},
	{
		id: 'm-85',
		stageId: 'stage-r32',
		homeTeamId: null,
		awayTeamId: null,
		groupId: null,
		stadiumId: '13',
		kickoffAt: '2026-07-03T03:00:00.000Z',
		bracketSlot: 'Winner Group B vs 3rd Group E/F/G/I/J',
		winnerAdvancesToMatchId: 'm-96',
		winnerAdvancesAs: 'home'
	},
	{
		id: 'm-86',
		stageId: 'stage-r32',
		homeTeamId: null,
		awayTeamId: null,
		groupId: null,
		stadiumId: '8',
		kickoffAt: '2026-07-03T22:00:00.000Z',
		bracketSlot: 'Winner Group J vs Runner-up Group H',
		winnerAdvancesToMatchId: 'm-95',
		winnerAdvancesAs: 'home'
	},
	{
		id: 'm-87',
		stageId: 'stage-r32',
		homeTeamId: null,
		awayTeamId: null,
		groupId: null,
		stadiumId: '6',
		kickoffAt: '2026-07-04T01:30:00.000Z',
		bracketSlot: 'Winner Group K vs 3rd Group D/E/I/J/L',
		winnerAdvancesToMatchId: 'm-96',
		winnerAdvancesAs: 'away'
	},
	{
		id: 'm-88',
		stageId: 'stage-r32',
		homeTeamId: null,
		awayTeamId: null,
		groupId: null,
		stadiumId: '4',
		kickoffAt: '2026-07-03T18:00:00.000Z',
		bracketSlot: 'Runner-up Group D vs Runner-up Group G',
		winnerAdvancesToMatchId: 'm-95',
		winnerAdvancesAs: 'away'
	},
	{
		id: 'm-89',
		stageId: 'stage-r16',
		homeTeamId: null,
		awayTeamId: null,
		groupId: null,
		stadiumId: '10',
		kickoffAt: '2026-07-04T21:00:00.000Z',
		bracketSlot: 'Winner Match 74 vs Winner Match 77',
		homeSourceMatchId: 'm-74',
		awaySourceMatchId: 'm-77',
		winnerAdvancesToMatchId: 'm-97',
		winnerAdvancesAs: 'home'
	},
	{
		id: 'm-90',
		stageId: 'stage-r16',
		homeTeamId: null,
		awayTeamId: null,
		groupId: null,
		stadiumId: '5',
		kickoffAt: '2026-07-04T17:00:00.000Z',
		bracketSlot: 'Winner Match 73 vs Winner Match 75',
		homeSourceMatchId: 'm-73',
		awaySourceMatchId: 'm-75',
		winnerAdvancesToMatchId: 'm-97',
		winnerAdvancesAs: 'away'
	},
	{
		id: 'm-91',
		stageId: 'stage-r16',
		homeTeamId: null,
		awayTeamId: null,
		groupId: null,
		stadiumId: '11',
		kickoffAt: '2026-07-05T20:00:00.000Z',
		bracketSlot: 'Winner Match 76 vs Winner Match 78',
		homeSourceMatchId: 'm-76',
		awaySourceMatchId: 'm-78',
		winnerAdvancesToMatchId: 'm-99',
		winnerAdvancesAs: 'home'
	},
	{
		id: 'm-92',
		stageId: 'stage-r16',
		homeTeamId: null,
		awayTeamId: null,
		groupId: null,
		stadiumId: '1',
		kickoffAt: '2026-07-06T00:00:00.000Z',
		bracketSlot: 'Winner Match 79 vs Winner Match 80',
		homeSourceMatchId: 'm-79',
		awaySourceMatchId: 'm-80',
		winnerAdvancesToMatchId: 'm-99',
		winnerAdvancesAs: 'away'
	},
	{
		id: 'm-93',
		stageId: 'stage-r16',
		homeTeamId: null,
		awayTeamId: null,
		groupId: null,
		stadiumId: '4',
		kickoffAt: '2026-07-06T19:00:00.000Z',
		bracketSlot: 'Winner Match 83 vs Winner Match 84',
		homeSourceMatchId: 'm-83',
		awaySourceMatchId: 'm-84',
		winnerAdvancesToMatchId: 'm-98',
		winnerAdvancesAs: 'home'
	},
	{
		id: 'm-94',
		stageId: 'stage-r16',
		homeTeamId: null,
		awayTeamId: null,
		groupId: null,
		stadiumId: '14',
		kickoffAt: '2026-07-07T00:00:00.000Z',
		bracketSlot: 'Winner Match 81 vs Winner Match 82',
		homeSourceMatchId: 'm-81',
		awaySourceMatchId: 'm-82',
		winnerAdvancesToMatchId: 'm-98',
		winnerAdvancesAs: 'away'
	},
	{
		id: 'm-95',
		stageId: 'stage-r16',
		homeTeamId: null,
		awayTeamId: null,
		groupId: null,
		stadiumId: '7',
		kickoffAt: '2026-07-07T16:00:00.000Z',
		bracketSlot: 'Winner Match 86 vs Winner Match 88',
		homeSourceMatchId: 'm-86',
		awaySourceMatchId: 'm-88',
		winnerAdvancesToMatchId: 'm-100',
		winnerAdvancesAs: 'home'
	},
	{
		id: 'm-96',
		stageId: 'stage-r16',
		homeTeamId: null,
		awayTeamId: null,
		groupId: null,
		stadiumId: '13',
		kickoffAt: '2026-07-07T20:00:00.000Z',
		bracketSlot: 'Winner Match 85 vs Winner Match 87',
		homeSourceMatchId: 'm-85',
		awaySourceMatchId: 'm-87',
		winnerAdvancesToMatchId: 'm-100',
		winnerAdvancesAs: 'away'
	},
	{
		id: 'm-97',
		stageId: 'stage-qf',
		homeTeamId: null,
		awayTeamId: null,
		groupId: null,
		stadiumId: '9',
		kickoffAt: '2026-07-09T20:00:00.000Z',
		bracketSlot: 'Winner Match 89 vs Winner Match 90',
		homeSourceMatchId: 'm-89',
		awaySourceMatchId: 'm-90',
		winnerAdvancesToMatchId: 'm-101',
		winnerAdvancesAs: 'home'
	},
	{
		id: 'm-98',
		stageId: 'stage-qf',
		homeTeamId: null,
		awayTeamId: null,
		groupId: null,
		stadiumId: '16',
		kickoffAt: '2026-07-10T19:00:00.000Z',
		bracketSlot: 'Winner Match 93 vs Winner Match 94',
		homeSourceMatchId: 'm-93',
		awaySourceMatchId: 'm-94',
		winnerAdvancesToMatchId: 'm-101',
		winnerAdvancesAs: 'away'
	},
	{
		id: 'm-99',
		stageId: 'stage-qf',
		homeTeamId: null,
		awayTeamId: null,
		groupId: null,
		stadiumId: '8',
		kickoffAt: '2026-07-11T21:00:00.000Z',
		bracketSlot: 'Winner Match 91 vs Winner Match 92',
		homeSourceMatchId: 'm-91',
		awaySourceMatchId: 'm-92',
		winnerAdvancesToMatchId: 'm-102',
		winnerAdvancesAs: 'home'
	},
	{
		id: 'm-100',
		stageId: 'stage-qf',
		homeTeamId: null,
		awayTeamId: null,
		groupId: null,
		stadiumId: '6',
		kickoffAt: '2026-07-12T01:00:00.000Z',
		bracketSlot: 'Winner Match 95 vs Winner Match 96',
		homeSourceMatchId: 'm-95',
		awaySourceMatchId: 'm-96',
		winnerAdvancesToMatchId: 'm-102',
		winnerAdvancesAs: 'away'
	},
	{
		id: 'm-101',
		stageId: 'stage-sf',
		homeTeamId: null,
		awayTeamId: null,
		groupId: null,
		stadiumId: '4',
		kickoffAt: '2026-07-14T19:00:00.000Z',
		bracketSlot: 'Winner Match 97 vs Winner Match 98',
		homeSourceMatchId: 'm-97',
		awaySourceMatchId: 'm-98',
		winnerAdvancesToMatchId: 'm-104',
		winnerAdvancesAs: 'home'
	},
	{
		id: 'm-102',
		stageId: 'stage-sf',
		homeTeamId: null,
		awayTeamId: null,
		groupId: null,
		stadiumId: '7',
		kickoffAt: '2026-07-15T19:00:00.000Z',
		bracketSlot: 'Winner Match 99 vs Winner Match 100',
		homeSourceMatchId: 'm-99',
		awaySourceMatchId: 'm-100',
		winnerAdvancesToMatchId: 'm-104',
		winnerAdvancesAs: 'away'
	},
	{
		id: 'm-103',
		stageId: 'stage-third',
		homeTeamId: null,
		awayTeamId: null,
		groupId: null,
		stadiumId: '8',
		kickoffAt: '2026-07-18T21:00:00.000Z',
		bracketSlot: 'Loser Match 101 vs Loser Match 102'
	},
	{
		id: 'm-104',
		stageId: 'stage-final',
		homeTeamId: null,
		awayTeamId: null,
		groupId: null,
		stadiumId: '11',
		kickoffAt: '2026-07-19T19:00:00.000Z',
		bracketSlot: 'Winner Match 101 vs Winner Match 102',
		homeSourceMatchId: 'm-101',
		awaySourceMatchId: 'm-102'
	}
];
