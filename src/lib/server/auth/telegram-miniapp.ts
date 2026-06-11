import type { BetterAuthPlugin } from 'better-auth';
import { APIError, createAuthEndpoint } from 'better-auth/api';
import { setSessionCookie } from 'better-auth/cookies';
import { parseUserOutput } from 'better-auth/db';
import { getWorkerEnv } from '$lib/server/worker-env';
import { validateTelegramInitData } from '$lib/server/telegram/validate-init-data';
import * as z from 'zod';

const signInTelegramBodySchema = z.object({
	initData: z.string().min(1)
});

function telegramDisplayName(user: {
	first_name: string;
	last_name?: string;
	username?: string;
	id: number;
}): string {
	const fullName = [user.first_name, user.last_name].filter(Boolean).join(' ');
	return fullName || user.username || String(user.id);
}

export function telegramMiniApp(): BetterAuthPlugin {
	return {
		id: 'telegram-miniapp',
		endpoints: {
			signInTelegram: createAuthEndpoint(
				'/sign-in/telegram',
				{
					method: 'POST',
					body: signInTelegramBodySchema
				},
				async (ctx) => {
					const botToken = getWorkerEnv().TELEGRAM_BOT_TOKEN;
					if (!botToken) {
						throw new APIError('INTERNAL_SERVER_ERROR', {
							message: 'Telegram auth is not configured'
						});
					}

					let validated;
					try {
						validated = await validateTelegramInitData(ctx.body.initData, botToken);
					} catch {
						throw new APIError('UNAUTHORIZED', { message: 'Invalid Telegram init data' });
					}

					const telegramId = String(validated.user.id);
					const email = `${telegramId}@telegram.local`;
					const name = telegramDisplayName(validated.user);

					const existingAccount = (await ctx.context.adapter.findOne({
						model: 'account',
						where: [
							{ field: 'providerId', operator: 'eq', value: 'telegram' },
							{ field: 'accountId', operator: 'eq', value: telegramId }
						]
					})) as { userId: string } | null;

					let user = existingAccount
						? await ctx.context.internalAdapter.findUserById(existingAccount.userId)
						: null;

					if (!user) {
						user = await ctx.context.internalAdapter.createUser({
							email,
							name,
							emailVerified: true,
							image: validated.user.photo_url ?? null
						});

						if (!user) {
							throw new APIError('INTERNAL_SERVER_ERROR', { message: 'Failed to create user' });
						}

						await ctx.context.internalAdapter.createAccount({
							userId: user.id,
							providerId: 'telegram',
							accountId: telegramId,
							createdAt: new Date(),
							updatedAt: new Date()
						});
					} else if (validated.user.photo_url && user.image !== validated.user.photo_url) {
						user = await ctx.context.internalAdapter.updateUser(user.id, {
							image: validated.user.photo_url
						});
					}

					const session = await ctx.context.internalAdapter.createSession(user.id);
					if (!session) {
						throw new APIError('INTERNAL_SERVER_ERROR', { message: 'Failed to create session' });
					}

					await setSessionCookie(ctx, { session, user });

					return ctx.json({
						token: session.token,
						user: parseUserOutput(ctx.context.options, user)
					});
				}
			)
		}
	};
}
