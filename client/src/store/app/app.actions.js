import { nanoid } from 'nanoid';
import { createActions } from 'reduxsauce';

const { Types, Creators } = createActions(
	{
		/* redux state actions */
		hideAlert: ['id'], // put token into store
		showAlert: (message, options) => {
			const timeout = options.variant === 'danger' ? 0 : 5;

			return {
				type: 'APP_SHOW_ALERT',
				id: options.id || nanoid(),
				message,
				variant: options.variant || 'success',
				timeout:
					typeof options.timeout === 'number' ? options.timeout : timeout,
			};
		},

		closePrompt: null,
		showPrompt: (message, onConfirm) => {
			return {
				type: 'APP_SHOW_PROMPT',
				id: nanoid(),
				message,
				onConfirm,
			};
		},

		setStatus: ['key', 'status'],
	},
	{
		prefix: 'APP_',
	},
);

export const appActionTypes = Types;
export default Creators;
