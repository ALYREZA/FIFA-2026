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

<div class="flex min-h-screen items-center justify-center bg-slate-950 px-4">
	<div class="absolute top-4 end-4">
		<LocaleSwitcher />
	</div>

	<div class="w-full max-w-md rounded-2xl border border-emerald-900/40 bg-slate-900 p-8 shadow-xl">
		<div class="mb-8 text-center">
			<h1 class="text-2xl font-bold text-emerald-400">{m.login_title()}</h1>
			<p class="mt-2 text-sm text-slate-400">{m.login_subtitle()}</p>
		</div>

		{#if error}
			<div class="mb-4 rounded-lg border border-red-900/50 bg-red-950/50 px-4 py-3 text-sm text-red-300">
				{error}
			</div>
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
					<label for="phone" class="mb-1 block text-sm text-slate-300">{m.login_phone_label()}</label>
					<input
						id="phone"
						type="tel"
						bind:value={phoneInput}
						placeholder={m.login_phone_placeholder()}
						dir="ltr"
						class="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:border-emerald-600 focus:outline-none"
					/>
					<p class="mt-1 text-xs text-slate-500">{m.login_phone_hint()}</p>
				</div>

				<button
					type="submit"
					disabled={loading}
					class="w-full rounded-lg bg-emerald-600 py-3 font-medium text-white transition hover:bg-emerald-500 disabled:opacity-50"
				>
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
				<p class="text-center text-sm text-slate-400">
					{m.login_code_sent({ phone: phoneInput })}
				</p>

				<div>
					<label for="otp" class="mb-1 block text-sm text-slate-300">{m.login_code_label()}</label>
					<input
						id="otp"
						type="text"
						inputmode="numeric"
						maxlength="6"
						bind:value={otpCode}
						placeholder="123456"
						dir="ltr"
						class="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-center text-2xl tracking-widest text-slate-100 focus:border-emerald-600 focus:outline-none"
					/>
				</div>

				<button
					type="submit"
					disabled={loading || otpCode.length < 6}
					class="w-full rounded-lg bg-emerald-600 py-3 font-medium text-white transition hover:bg-emerald-500 disabled:opacity-50"
				>
					{loading ? m.login_verifying() : m.login_verify()}
				</button>

				<button
					type="button"
					onclick={handleBack}
					class="w-full text-sm text-slate-400 hover:text-emerald-400"
				>
					{m.login_change_phone()}
				</button>
			</form>
		{/if}

		<p class="mt-6 text-center text-xs text-slate-500">{m.login_disclaimer()}</p>
	</div>
</div>
