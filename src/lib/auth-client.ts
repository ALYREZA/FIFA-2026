import { createAuthClient } from 'better-auth/svelte';
import { phoneNumberClient } from 'better-auth/client/plugins';

export const authClient = createAuthClient({
	plugins: [phoneNumberClient()]
});
