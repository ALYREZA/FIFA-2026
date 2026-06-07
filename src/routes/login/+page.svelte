<script lang="ts">
	import type { Pathname } from '$app/types';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { authClient } from '$lib/auth-client';
	import { normalizeIranPhone } from '$lib/phone';
	import LocaleSwitcher from '$lib/components/LocaleSwitcher.svelte';
	import * as m from '$lib/paraglide/messages';

	let phoneInput = $state('');
	let otpCode = $state('');
	let step = $state<'phone' | 'otp'>('phone');
	let loading = $state(false);
	let error = $state('');

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

		const redirect = (page.url.searchParams.get('redirect') ?? '/dashboard') as Pathname;
		window.location.href = resolve(redirect);
	}

	function handleBack() {
		step = 'phone';
		otpCode = '';
		error = '';
	}
</script>

<div class="flex min-h-screen items-center justify-center bg-background px-4">
	<div class="absolute end-4 top-4">
		<LocaleSwitcher />
	</div>

	<div class="card w-full max-w-md border-header-border p-6 sm:p-8">
		<div class="mb-8 text-center">
			<h1 class="text-2xl font-bold text-accent-text">{m.login_title()}</h1>
			<p class="mt-2 text-sm text-muted">{m.login_subtitle()}</p>
		</div>

		{#if error}
			<div class="alert-error mb-4 px-4 py-3">{error}</div>
		{/if}

		{#if step === 'phone'}
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

				<button type="button" onclick={handleBack} class="w-full text-sm text-muted hover:text-accent-text">
					{m.login_change_phone()}
				</button>
			</form>
		{/if}

		<p class="mt-6 text-center text-xs text-subtle">{m.login_disclaimer()}</p>
	</div>
</div>
