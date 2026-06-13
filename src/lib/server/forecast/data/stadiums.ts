/** FIFA World Cup 2026 stadiums — source: https://github.com/rezarahiminia/worldcup2026 */
export type StadiumSeed = {
	id: string;
	nameEn: string;
	nameFa: string;
	fifaName: string;
	cityEn: string;
	cityFa: string;
	countryEn: string;
	countryFa: string;
	capacity: number;
};

export const FIFA_2026_STADIUMS: StadiumSeed[] = [
	{
		id: '1',
		nameEn: 'Estadio Azteca',
		nameFa: 'استادیوم آزتکا',
		fifaName: 'Mexico City Stadium',
		cityEn: 'Mexico City',
		cityFa: 'مکزیکوسیتی',
		countryEn: 'Mexico',
		countryFa: 'مکزیک',
		capacity: 83000
	},
	{
		id: '2',
		nameEn: 'Estadio Akron',
		nameFa: 'استادیوم آکرون',
		fifaName: 'Estadio Guadalajara',
		cityEn: 'Guadalajara (Zapopan)',
		cityFa: 'گوادالاخارا',
		countryEn: 'Mexico',
		countryFa: 'مکزیک',
		capacity: 48000
	},
	{
		id: '3',
		nameEn: 'Estadio BBVA',
		nameFa: 'استادیوم بی‌بی‌وی‌ای',
		fifaName: 'Estadio Monterrey',
		cityEn: 'Monterrey (Guadalupe)',
		cityFa: 'مونتری',
		countryEn: 'Mexico',
		countryFa: 'مکزیک',
		capacity: 53500
	},
	{
		id: '4',
		nameEn: 'AT&T Stadium',
		nameFa: 'استادیوم ای‌تی‌اند‌تی',
		fifaName: 'Dallas Stadium',
		cityEn: 'Dallas (Arlington, Texas)',
		cityFa: 'دالاس',
		countryEn: 'United States',
		countryFa: 'آمریکا',
		capacity: 94000
	},
	{
		id: '5',
		nameEn: 'NRG Stadium',
		nameFa: 'استادیوم ان‌آر‌جی',
		fifaName: 'Houston Stadium',
		cityEn: 'Houston',
		cityFa: 'هیوستون',
		countryEn: 'United States',
		countryFa: 'آمریکا',
		capacity: 72000
	},
	{
		id: '6',
		nameEn: 'GEHA Field at Arrowhead Stadium',
		nameFa: 'استادیوم اروهد',
		fifaName: 'Kansas City Stadium',
		cityEn: 'Kansas City',
		cityFa: 'کانزاس سیتی',
		countryEn: 'United States',
		countryFa: 'آمریکا',
		capacity: 73000
	},
	{
		id: '7',
		nameEn: 'Mercedes-Benz Stadium',
		nameFa: 'استادیوم مرسدس بنز',
		fifaName: 'Atlanta Stadium',
		cityEn: 'Atlanta',
		cityFa: 'آتلانتا',
		countryEn: 'United States',
		countryFa: 'آمریکا',
		capacity: 75000
	},
	{
		id: '8',
		nameEn: 'Hard Rock Stadium',
		nameFa: 'استادیوم هارد راک',
		fifaName: 'Miami Stadium',
		cityEn: 'Miami (Miami Gardens)',
		cityFa: 'میامی',
		countryEn: 'United States',
		countryFa: 'آمریکا',
		capacity: 65000
	},
	{
		id: '9',
		nameEn: 'Gillette Stadium',
		nameFa: 'استادیوم ژیلت',
		fifaName: 'Boston Stadium',
		cityEn: 'Boston (Foxborough)',
		cityFa: 'بوستون',
		countryEn: 'United States',
		countryFa: 'آمریکا',
		capacity: 65000
	},
	{
		id: '10',
		nameEn: 'Lincoln Financial Field',
		nameFa: 'استادیوم لینکلن فایننشال',
		fifaName: 'Philadelphia Stadium',
		cityEn: 'Philadelphia',
		cityFa: 'فیلادلفیا',
		countryEn: 'United States',
		countryFa: 'آمریکا',
		capacity: 69000
	},
	{
		id: '11',
		nameEn: 'MetLife Stadium',
		nameFa: 'استادیوم متلایف',
		fifaName: 'New York/New Jersey Stadium',
		cityEn: 'New York/New Jersey (East Rutherford)',
		cityFa: 'نیویورک/نیوجرسی',
		countryEn: 'United States',
		countryFa: 'آمریکا',
		capacity: 82500
	},
	{
		id: '12',
		nameEn: 'BMO Field',
		nameFa: 'استادیوم بی‌ام‌او',
		fifaName: 'Toronto Stadium',
		cityEn: 'Toronto',
		cityFa: 'تورنتو',
		countryEn: 'Canada',
		countryFa: 'کانادا',
		capacity: 45000
	},
	{
		id: '13',
		nameEn: 'BC Place',
		nameFa: 'استادیوم بی‌سی پلیس',
		fifaName: 'BC Place Vancouver',
		cityEn: 'Vancouver',
		cityFa: 'ونکوور',
		countryEn: 'Canada',
		countryFa: 'کانادا',
		capacity: 54000
	},
	{
		id: '14',
		nameEn: 'Lumen Field',
		nameFa: 'استادیوم لومن فیلد',
		fifaName: 'Seattle Stadium',
		cityEn: 'Seattle',
		cityFa: 'سیاتل',
		countryEn: 'United States',
		countryFa: 'آمریکا',
		capacity: 69000
	},
	{
		id: '15',
		nameEn: "Levi's Stadium",
		nameFa: 'استادیوم لیوایز',
		fifaName: 'San Francisco Bay Area Stadium',
		cityEn: 'San Francisco Bay Area (Santa Clara)',
		cityFa: 'سن‌فرانسیسکو',
		countryEn: 'United States',
		countryFa: 'آمریکا',
		capacity: 71000
	},
	{
		id: '16',
		nameEn: 'SoFi Stadium',
		nameFa: 'استادیوم سوفای',
		fifaName: 'Los Angeles Stadium',
		cityEn: 'Los Angeles (Inglewood)',
		cityFa: 'لس‌آنجلس',
		countryEn: 'United States',
		countryFa: 'آمریکا',
		capacity: 70000
	}
];

export const FIFA_2026_STADIUM_MAP: Record<string, StadiumSeed> = Object.fromEntries(
	FIFA_2026_STADIUMS.map((s) => [s.id, s])
);
