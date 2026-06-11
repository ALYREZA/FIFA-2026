<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { authClient } from '$lib/auth-client';
	import { normalizeIranPhone } from '$lib/phone';
	import { USERNAME_RULES } from '$lib/forecast/game-rules';
	import LocaleSwitcher from '$lib/components/LocaleSwitcher.svelte';
	import { getTelegramInitData, isTelegramWebApp, signInWithTelegram } from '$lib/telegram/webapp';
	import * as m from '$lib/paraglide/messages';

	let { data, form } = $props();

	let phoneInput = $state('');
	let otpCode = $state('');
	let usernameInput = $state('');
	let step = $state<'phone' | 'otp' | 'username' | 'telegram'>('phone');
	let loading = $state(false);
	let error = $state('');
	let telegramSignInStarted = $state(false);

	$effect.pre(() => {
		if (data.needsUsername) {
			step = 'username';
		}
	});

	$effect(() => {
		if (data.needsUsername || step === 'username') return;
		if (!isTelegramWebApp() || telegramSignInStarted) return;

		telegramSignInStarted = true;
		step = 'telegram';
		void handleTelegramSignIn();
	});

	function redirectAfterLogin() {
		const redirect = page.url.searchParams.get('redirect') ?? '';
		const loginUrl = redirect
			? `${resolve('/login')}?redirect=${encodeURIComponent(redirect)}`
			: resolve('/login');
		window.location.href = loginUrl;
	}

	async function handleTelegramSignIn() {
		error = '';
		loading = true;

		const initData = getTelegramInitData();
		if (!initData) {
			error = m.login_telegram_failed();
			loading = false;
			return;
		}

		const result = await signInWithTelegram(initData);
		loading = false;

		if (!result.ok) {
			error = result.message || m.login_telegram_failed();
			return;
		}

		redirectAfterLogin();
	}

	function usernameErrorMessage(code: string | undefined) {
		switch (code) {
			case 'too_short':
				return m.login_username_too_short();
			case 'too_long':
				return m.login_username_too_long();
			case 'invalid_format':
				return m.login_username_invalid();
			case 'reserved':
				return m.login_username_reserved();
			case 'taken':
				return m.login_username_taken();
			case 'already_set':
				return m.login_username_already_set();
			case 'not_authenticated':
				return m.login_username_not_authenticated();
			default:
				return m.login_username_invalid();
		}
	}

	async function handleSendOtp() {
		error = '';
		loading = true;

		const normalized = normalizeIranPhone(phoneInput);
		if (!normalized) {
			error = m.login_invalid_phone();
			loading = false;
			return;
		}

		const result = await authClient.phoneNumber.sendOtp({ phoneNumber: normalized });

		loading = false;

		if (result.error) {
			error = result.error.message ?? m.login_send_failed();
			return;
		}

		step = 'otp';
	}

	async function handleVerifyOtp() {
		error = '';
		loading = true;

		const normalized = normalizeIranPhone(phoneInput);
		if (!normalized) {
			error = m.login_invalid_phone();
			loading = false;
			return;
		}

		const result = await authClient.phoneNumber.verify({
			phoneNumber: normalized,
			code: otpCode
		});

		loading = false;

		if (result.error) {
			error = result.error.message ?? m.login_invalid_otp();
			return;
		}

		redirectAfterLogin();
	}

	function handleBack() {
		step = 'phone';
		otpCode = '';
		error = '';
	}
</script>

<div
	class="safe-area-top safe-area-bottom safe-area-x flex min-h-dvh flex-col bg-background text-foreground"
>
	<header class="flex shrink-0 items-center justify-end py-3">
		<LocaleSwitcher />
	</header>

	<main class="flex flex-1 items-center justify-center px-4 pb-8">
	<div class="card w-full max-w-md border-header-border p-6 sm:p-8">
		<div class="mb-8 text-center">
			<h1 class="text-2xl font-bold text-accent-text">{m.login_title()}</h1>
			<p class="mt-2 text-sm text-muted">
				{#if step === 'username'}
					{m.login_username_subtitle()}
				{:else if step === 'telegram'}
					{m.login_telegram_subtitle()}
				{:else}
					{m.login_subtitle()}
				{/if}
			</p>
		</div>

		{#if error || form?.usernameError}
			<div class="alert-error mb-4 px-4 py-3">
				{error || usernameErrorMessage(form?.usernameError)}
			</div>
		{/if}

		{#if step === 'username'}
			<form method="POST" action="?/setUsername" class="space-y-4">
				<div>
					<label for="username" class="label">{m.login_username_label()}</label>
					<input
						id="username"
						name="username"
						type="text"
						bind:value={usernameInput}
						placeholder={m.login_username_placeholder()}
						dir="ltr"
						autocapitalize="off"
						autocomplete="username"
						maxlength={USERNAME_RULES.maxLength}
						class="input w-full px-4 py-3 placeholder:text-subtle"
					/>
					<p class="mt-1 text-xs text-subtle">{m.login_username_hint()}</p>
				</div>

				<button
					type="submit"
					disabled={loading || usernameInput.trim().length < USERNAME_RULES.minLength}
					class="btn-primary w-full py-3"
				>
					{loading ? m.login_username_saving() : m.login_username_continue()}
				</button>
			</form>
		{:else if step === 'phone'}
			<form
				onsubmit={(e) => {
					e.preventDefault();
					handleSendOtp();
				}}
				class="space-y-4"
			>
				<div>
					<label for="phone" class="label">{m.login_phone_label()}</label>
					<input
						id="phone"
						type="tel"
						bind:value={phoneInput}
						placeholder={m.login_phone_placeholder()}
						dir="ltr"
						class="input w-full px-4 py-3 placeholder:text-subtle"
					/>
					<p class="mt-1 text-xs text-subtle">{m.login_phone_hint()}</p>
				</div>

				<button type="submit" disabled={loading} class="btn-primary w-full py-3">
					{loading ? m.login_sending() : m.login_send_otp()}
				</button>
			</form>
		{:else if step === 'telegram'}
			<div class="space-y-4 py-6 text-center">
				<p class="text-sm text-muted">
					{loading ? m.login_telegram_signing_in() : m.login_telegram_subtitle()}
				</p>
				{#if !loading && error}
					<button type="button" onclick={handleTelegramSignIn} class="btn-primary w-full py-3">
						{m.login_telegram_retry()}
					</button>
				{/if}
			</div>
		{:else}
			<form
				onsubmit={(e) => {
					e.preventDefault();
					handleVerifyOtp();
				}}
				class="space-y-4"
			>
				<p class="text-center text-sm text-muted">
					{m.login_code_sent({ phone: phoneInput })}
				</p>

				<div>
					<label for="otp" class="label">{m.login_code_label()}</label>
					<input
						id="otp"
						type="text"
						inputmode="numeric"
						maxlength="6"
						bind:value={otpCode}
						placeholder="123456"
						dir="ltr"
						class="input w-full px-4 py-3 text-center text-2xl tracking-widest"
					/>
				</div>

				<button
					type="submit"
					disabled={loading || otpCode.length < 6}
					class="btn-primary w-full py-3"
				>
					{loading ? m.login_verifying() : m.login_verify()}
				</button>

				<button
					type="button"
					onclick={handleBack}
					class="w-full text-sm text-muted hover:text-accent-text"
				>
					{m.login_change_phone()}
				</button>
			</form>
		{/if}

		<p class="mt-6 text-center text-xs text-subtle">{m.login_disclaimer()}</p>
	</div>
	</main>
</div>
