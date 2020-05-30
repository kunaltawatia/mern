/**
 * Helper functions
 * @module Helpers
 */
import produce from 'immer';
import qs from 'qs';
import crypto from 'crypto-js';
import { format } from 'date-fns';

/**
 * Hash a query object for versioning purposes
 * @param {Object} query the query
 */
export function hash(query = {}) {
	const qstring = qs.stringify(query);
	const qhash = crypto.MD5(qstring).toString(crypto.enc.Hex);
	return { qhash, qstring };
}

/**
 * Log grouped messages to the console
 * @param {string} type
 * @param {string} title
 * @param {*} data
 * @param {Object} [options]
 */
export function logger(type, title, data, options = {}) {
	/* istanbul ignore else */
	if (process.env.NODE_ENV === 'development') {
		/* eslint-disable no-console */
		const {
			collapsed = true,
			hideTimestamp = false,
			typeColor = 'gray',
		} = options;
		const groupMethod = collapsed ? console.groupCollapsed : console.group;
		const parts = [`%c ${type}`];
		const styles = [
			`color: ${typeColor}; font-weight: lighter;`,
			'color: inherit;',
		];

		if (!hideTimestamp) {
			styles.push('color: gray; font-weight: lighter;');
		}

		const time = format(new Date(), 'HH:mm:ss');

		parts.push(`%c${title}`);

		if (!hideTimestamp) {
			parts.push(`%c@ ${time}`);
		}

		/* istanbul ignore else */
		if (!window.SKIP_LOGGER) {
			groupMethod(parts.join(' '), ...styles);
			console.log(data);
			console.groupEnd();
		}
		/* eslint-enable */
	}
}

export const spread = produce(Object.assign);
