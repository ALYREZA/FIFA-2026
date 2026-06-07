import { initTelegramTheme } from '$lib/telegram/theme';

export type TelegramWebAppUser = {
	id: number;
	first_name: string;
	last_name?: string;
	username?: string;
	language_code?: string;
	is_premium?: boolean;
	photo_url?: string;
};

export type TelegramThemeParams = {
	bg_color?: string;
	text_color?: string;
	hint_color?: string;
	link_color?: string;
	button_color?: string;
	button_text_color?: string;
	secondary_bg_color?: string;
	header_bg_color?: string;
	accent_text_color?: string;
	section_bg_color?: string;
	section_header_text_color?: string;
	subtitle_text_color?: string;
	destructive_text_color?: string;
	bottom_bar_bg_color?: string;
};

export type TelegramWebApp = {
	initData: string;
	initDataUnsafe: {
		user?: TelegramWebAppUser;
		auth_date?: number;
		query_id?: string;
	};
	ready: () => void;
	expand: () => void;
	close: () => void;
	colorScheme: 'light' | 'dark';
	themeParams: TelegramThemeParams;
	platform: string;
	version: string;
	setHeaderColor: (color: string) => void;
	setBackgroundColor: (color: string) => void;
	onEvent: (eventType: 'themeChanged', callback: () => void) => void;
	offEvent: (eventType: 'themeChanged', callback: () => void) => void;
};

declare global {
	interface Window {
		Telegram?: {
			WebApp: TelegramWebApp;
		};
	}
}

export function isTelegramWebApp(): boolean {
	if (typeof window === 'undefined') return false;
	return Boolean(window.Telegram?.WebApp?.initData);
}

export function getTelegramInitData(): string | null {
	if (!isTelegramWebApp()) return null;
	return window.Telegram!.WebApp.initData || null;
}

export function initTelegramWebApp(): (() => void) | undefined {
	if (!isTelegramWebApp()) return undefined;
	const webApp = window.Telegram!.WebApp;
	webApp.ready();
	webApp.expand();
	return initTelegramTheme();
}

export async function signInWithTelegram(initData: string): Promise<{ ok: true } | { ok: false; message: string }> {
	const response = await fetch('/api/auth/sign-in/telegram', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		credentials: 'include',
		body: JSON.stringify({ initData })
	});

	if (!response.ok) {
		let message = 'Telegram sign-in failed';
		try {
			const body = (await response.json()) as { message?: string };
			if (body.message) message = body.message;
		} catch {
			// ignore parse errors
		}
		return { ok: false, message };
	}

	return { ok: true };
}
