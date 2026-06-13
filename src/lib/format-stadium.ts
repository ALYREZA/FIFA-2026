import { getLocale } from '$lib/paraglide/runtime';

export type StadiumDisplay = {
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

export function formatStadiumLabel(stadium: StadiumDisplay, locale: string = getLocale()): string {
	const name = locale === 'fa' ? stadium.nameFa : stadium.nameEn;
	const city = locale === 'fa' ? stadium.cityFa : stadium.cityEn;
	return `${name} · ${city}`;
}
