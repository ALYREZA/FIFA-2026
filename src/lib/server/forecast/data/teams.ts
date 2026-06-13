/** FIFA World Cup 2026 teams & groups — source: https://github.com/rezarahiminia/worldcup2026 */
export type TeamSeed = {
	id: string;
	name: string;
	code: string;
	flag: string;
	groupId: string;
};

export const FIFA_2026_GROUPS: Record<string, TeamSeed[]> = {
	A: [
		{ id: 'mex', name: 'Mexico', code: 'MEX', flag: '🇲🇽', groupId: 'A' },
		{ id: 'rsa', name: 'South Africa', code: 'RSA', flag: '🇿🇦', groupId: 'A' },
		{ id: 'kor', name: 'South Korea', code: 'KOR', flag: '🇰🇷', groupId: 'A' },
		{ id: 'cze', name: 'Czech Republic', code: 'CZE', flag: '🇨🇿', groupId: 'A' }
	],
	B: [
		{ id: 'can', name: 'Canada', code: 'CAN', flag: '🇨🇦', groupId: 'B' },
		{ id: 'bih', name: 'Bosnia and Herzegovina', code: 'BIH', flag: '🇧🇦', groupId: 'B' },
		{ id: 'qat', name: 'Qatar', code: 'QAT', flag: '🇶🇦', groupId: 'B' },
		{ id: 'sui', name: 'Switzerland', code: 'SUI', flag: '🇨🇭', groupId: 'B' }
	],
	C: [
		{ id: 'bra', name: 'Brazil', code: 'BRA', flag: '🇧🇷', groupId: 'C' },
		{ id: 'mar', name: 'Morocco', code: 'MAR', flag: '🇲🇦', groupId: 'C' },
		{ id: 'hai', name: 'Haiti', code: 'HAI', flag: '🇭🇹', groupId: 'C' },
		{ id: 'sco', name: 'Scotland', code: 'SCO', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', groupId: 'C' }
	],
	D: [
		{ id: 'usa', name: 'United States', code: 'USA', flag: '🇺🇸', groupId: 'D' },
		{ id: 'par', name: 'Paraguay', code: 'PAR', flag: '🇵🇾', groupId: 'D' },
		{ id: 'aus', name: 'Australia', code: 'AUS', flag: '🇦🇺', groupId: 'D' },
		{ id: 'tur', name: 'Turkey', code: 'TUR', flag: '🇹🇷', groupId: 'D' }
	],
	E: [
		{ id: 'ger', name: 'Germany', code: 'GER', flag: '🇩🇪', groupId: 'E' },
		{ id: 'cur', name: 'Curaçao', code: 'CUW', flag: '🇨🇼', groupId: 'E' },
		{ id: 'civ', name: 'Ivory Coast', code: 'CIV', flag: '🇨🇮', groupId: 'E' },
		{ id: 'ecu', name: 'Ecuador', code: 'ECU', flag: '🇪🇨', groupId: 'E' }
	],
	F: [
		{ id: 'ned', name: 'Netherlands', code: 'NED', flag: '🇳🇱', groupId: 'F' },
		{ id: 'jpn', name: 'Japan', code: 'JPN', flag: '🇯🇵', groupId: 'F' },
		{ id: 'swe', name: 'Sweden', code: 'SWE', flag: '🇸🇪', groupId: 'F' },
		{ id: 'tun', name: 'Tunisia', code: 'TUN', flag: '🇹🇳', groupId: 'F' }
	],
	G: [
		{ id: 'bel', name: 'Belgium', code: 'BEL', flag: '🇧🇪', groupId: 'G' },
		{ id: 'egy', name: 'Egypt', code: 'EGY', flag: '🇪🇬', groupId: 'G' },
		{ id: 'irn', name: 'Iran', code: 'IRN', flag: '🇮🇷', groupId: 'G' },
		{ id: 'nzl', name: 'New Zealand', code: 'NZL', flag: '🇳🇿', groupId: 'G' }
	],
	H: [
		{ id: 'esp', name: 'Spain', code: 'ESP', flag: '🇪🇸', groupId: 'H' },
		{ id: 'cpv', name: 'Cape Verde', code: 'CPV', flag: '🇨🇻', groupId: 'H' },
		{ id: 'ksa', name: 'Saudi Arabia', code: 'KSA', flag: '🇸🇦', groupId: 'H' },
		{ id: 'uru', name: 'Uruguay', code: 'URU', flag: '🇺🇾', groupId: 'H' }
	],
	I: [
		{ id: 'fra', name: 'France', code: 'FRA', flag: '🇫🇷', groupId: 'I' },
		{ id: 'sen', name: 'Senegal', code: 'SEN', flag: '🇸🇳', groupId: 'I' },
		{ id: 'irq', name: 'Iraq', code: 'IRQ', flag: '🇮🇶', groupId: 'I' },
		{ id: 'nor', name: 'Norway', code: 'NOR', flag: '🇳🇴', groupId: 'I' }
	],
	J: [
		{ id: 'arg', name: 'Argentina', code: 'ARG', flag: '🇦🇷', groupId: 'J' },
		{ id: 'alg', name: 'Algeria', code: 'ALG', flag: '🇩🇿', groupId: 'J' },
		{ id: 'aut', name: 'Austria', code: 'AUT', flag: '🇦🇹', groupId: 'J' },
		{ id: 'jor', name: 'Jordan', code: 'JOR', flag: '🇯🇴', groupId: 'J' }
	],
	K: [
		{ id: 'por', name: 'Portugal', code: 'POR', flag: '🇵🇹', groupId: 'K' },
		{ id: 'cod', name: 'Democratic Republic of the Congo', code: 'COD', flag: '🇨🇩', groupId: 'K' },
		{ id: 'uzb', name: 'Uzbekistan', code: 'UZB', flag: '🇺🇿', groupId: 'K' },
		{ id: 'col', name: 'Colombia', code: 'COL', flag: '🇨🇴', groupId: 'K' }
	],
	L: [
		{ id: 'eng', name: 'England', code: 'ENG', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', groupId: 'L' },
		{ id: 'cro', name: 'Croatia', code: 'CRO', flag: '🇭🇷', groupId: 'L' },
		{ id: 'gha', name: 'Ghana', code: 'GHA', flag: '🇬🇭', groupId: 'L' },
		{ id: 'pan', name: 'Panama', code: 'PAN', flag: '🇵🇦', groupId: 'L' }
	]
};

export const FIFA_2026_TEAMS: TeamSeed[] = Object.values(FIFA_2026_GROUPS).flat();

/** Numeric team id (1–48) from worldcup2026 API → internal team id */
export const API_TEAM_ID_MAP: Record<string, string> = {
	'1': 'mex',
	'2': 'rsa',
	'3': 'kor',
	'4': 'cze',
	'5': 'can',
	'6': 'bih',
	'7': 'qat',
	'8': 'sui',
	'9': 'bra',
	'10': 'mar',
	'11': 'hai',
	'12': 'sco',
	'13': 'usa',
	'14': 'par',
	'15': 'aus',
	'16': 'tur',
	'17': 'ger',
	'18': 'cur',
	'19': 'civ',
	'20': 'ecu',
	'21': 'ned',
	'22': 'jpn',
	'23': 'swe',
	'24': 'tun',
	'25': 'bel',
	'26': 'egy',
	'27': 'irn',
	'28': 'nzl',
	'29': 'esp',
	'30': 'cpv',
	'31': 'ksa',
	'32': 'uru',
	'33': 'fra',
	'34': 'sen',
	'35': 'irq',
	'36': 'nor',
	'37': 'arg',
	'38': 'alg',
	'39': 'aut',
	'40': 'jor',
	'41': 'por',
	'42': 'cod',
	'43': 'uzb',
	'44': 'col',
	'45': 'eng',
	'46': 'cro',
	'47': 'gha',
	'48': 'pan'
};
