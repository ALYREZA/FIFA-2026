/** Knockout bracket tree: each round pairs feed into the next */
export type KnockoutLink = {
	id: string;
	homeSourceId?: string;
	awaySourceId?: string;
	winnerAdvancesToId: string;
	winnerAdvancesAs: 'home' | 'away';
};

export function buildKnockoutBracket(): {
	r32: KnockoutLink[];
	r16: KnockoutLink[];
	qf: KnockoutLink[];
	sf: KnockoutLink[];
	thirdPlace: { id: string; homeSourceId: string; awaySourceId: string };
	final: { id: string; homeSourceId: string; awaySourceId: string };
} {
	const r32: KnockoutLink[] = [];
	const r16: KnockoutLink[] = [];
	const qf: KnockoutLink[] = [];
	const sf: KnockoutLink[] = [];

	for (let i = 1; i <= 16; i++) {
		const id = `m-r32-${String(i).padStart(2, '0')}`;
		const r16Index = Math.ceil(i / 2);
		const r16Id = `m-r16-${String(r16Index).padStart(2, '0')}`;
		r32.push({
			id,
			winnerAdvancesToId: r16Id,
			winnerAdvancesAs: i % 2 === 1 ? 'home' : 'away'
		});
	}

	for (let i = 1; i <= 8; i++) {
		const id = `m-r16-${String(i).padStart(2, '0')}`;
		const qfIndex = Math.ceil(i / 2);
		const qfId = `m-qf-${String(qfIndex).padStart(2, '0')}`;
		r16.push({
			id,
			homeSourceId: `m-r32-${String(i * 2 - 1).padStart(2, '0')}`,
			awaySourceId: `m-r32-${String(i * 2).padStart(2, '0')}`,
			winnerAdvancesToId: qfId,
			winnerAdvancesAs: i % 2 === 1 ? 'home' : 'away'
		});
	}

	for (let i = 1; i <= 4; i++) {
		const id = `m-qf-${String(i).padStart(2, '0')}`;
		const sfIndex = Math.ceil(i / 2);
		const sfId = `m-sf-${String(sfIndex).padStart(2, '0')}`;
		qf.push({
			id,
			homeSourceId: `m-r16-${String(i * 2 - 1).padStart(2, '0')}`,
			awaySourceId: `m-r16-${String(i * 2).padStart(2, '0')}`,
			winnerAdvancesToId: sfId,
			winnerAdvancesAs: i % 2 === 1 ? 'home' : 'away'
		});
	}

	sf.push(
		{
			id: 'm-sf-01',
			homeSourceId: 'm-qf-01',
			awaySourceId: 'm-qf-02',
			winnerAdvancesToId: 'm-final-01',
			winnerAdvancesAs: 'home'
		},
		{
			id: 'm-sf-02',
			homeSourceId: 'm-qf-03',
			awaySourceId: 'm-qf-04',
			winnerAdvancesToId: 'm-final-01',
			winnerAdvancesAs: 'away'
		}
	);

	return {
		r32,
		r16,
		qf,
		sf,
		thirdPlace: { id: 'm-third-01', homeSourceId: 'm-sf-01', awaySourceId: 'm-sf-02' },
		final: { id: 'm-final-01', homeSourceId: 'm-sf-01', awaySourceId: 'm-sf-02' }
	};
}
