import type { TelegramWebApp } from '$lib/telegram/webapp';

let themeCleanup: (() => void) | undefined;

function getWebApp(): TelegramWebApp | null {
	if (typeof window === 'undefined') return null;
	return window.Telegram?.WebApp ?? null;
}

function applyTelegramTheme(webApp: TelegramWebApp): void {
	const root = document.documentElement;
	root.dataset.telegramTheme = 'true';
	root.dataset.colorScheme = webApp.colorScheme;

	const bg = webApp.themeParams.bg_color;
	const headerBg = webApp.themeParams.header_bg_color ?? webApp.themeParams.secondary_bg_color;

	if (typeof webApp.setBackgroundColor === 'function') {
		webApp.setBackgroundColor('bg_color');
	}

	if (typeof webApp.setHeaderColor === 'function') {
		webApp.setHeaderColor(headerBg ?? 'secondary_bg_color');
	}

	// Mirror Telegram theme params so our CSS can use --tg-theme-* even before the SDK injects them.
	for (const [key, value] of Object.entries(webApp.themeParams)) {
		if (value) {
			root.style.setProperty(`--tg-theme-${key.replace(/_/g, '-')}`, value);
		}
	}

	if (bg) {
		root.style.setProperty('--tg-theme-bg-color', bg);
	}
}

function onThemeChanged(): void {
	const webApp = getWebApp();
	if (webApp) {
		applyTelegramTheme(webApp);
	}
}

function cleanupTelegramTheme(webApp: TelegramWebApp): void {
	if (typeof webApp.offEvent === 'function') {
		webApp.offEvent('themeChanged', onThemeChanged);
	}

	const root = document.documentElement;
	delete root.dataset.telegramTheme;
	delete root.dataset.colorScheme;

	for (const key of Object.keys(webApp.themeParams)) {
		root.style.removeProperty(`--tg-theme-${key.replace(/_/g, '-')}`);
	}
}

export function initTelegramTheme(): (() => void) | undefined {
	const webApp = getWebApp();
	if (!webApp?.initData) return undefined;

	if (themeCleanup) {
		applyTelegramTheme(webApp);
		return themeCleanup;
	}

	applyTelegramTheme(webApp);

	if (typeof webApp.onEvent === 'function') {
		webApp.onEvent('themeChanged', onThemeChanged);
	}

	themeCleanup = () => {
		cleanupTelegramTheme(webApp);
		themeCleanup = undefined;
	};

	return themeCleanup;
}
