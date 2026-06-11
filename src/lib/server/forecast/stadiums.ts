import { FIFA_2026_STADIUM_MAP, type StadiumSeed } from './data/stadiums';

export type StadiumInfo = StadiumSeed;

export function getStadiumById(stadiumId: string | null | undefined): StadiumInfo | null {
	if (!stadiumId) return null;
	return FIFA_2026_STADIUM_MAP[stadiumId] ?? null;
}

export function attachStadium<T extends { stadiumId?: string | null }>(
	item: T
): T & { stadium: StadiumInfo | null } {
	return { ...item, stadium: getStadiumById(item.stadiumId) };
}
