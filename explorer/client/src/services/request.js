/**
 *    SPDX-License-Identifier: Apache-2.0
 */

import agent from 'superagent';

import Auth from '../state/Auth';

export const post = (uri, payload) =>
	new Promise((resolve, reject) => {
		agent
			.post(uri)
			.send(payload)
			.set('Accept', 'application/json')
			.set('Authorization', `bearer ${Auth.getToken()}`)
			.end(withPromiseCallback(resolve, reject));
	});
export const get = uri =>
	new Promise((resolve, reject) => {
		agent
			.get(uri)
			.set('Accept', 'application/json')
			.set('Authorization', `bearer ${Auth.getToken()}`)
			.set('Cache-Control', 'no-cache')
			.end(withPromiseCallback(resolve, reject));
	});
export const put = (uri, payload) =>
	new Promise((resolve, reject) => {
		agent
			.put(uri)
			.send(payload)
			.set('Accept', 'application/json')
			.set('Authorization', `bearer ${Auth.getToken()}`)
			.end(withPromiseCallback(resolve, reject));
	});
export const deleteRequest = (uri, payload) =>
	new Promise((resolve, reject) => {
		agent
			.delete(uri)
			.send(payload)
			.set('Accept', 'application/json')
			.set('Authorization', `bearer ${Auth.getToken()}`)
			.end(withPromiseCallback(resolve, reject));
	});
export const withPromiseCallback = (resolve, reject) => (error, response) => {
	if (error) {
		console.error(error);
		if (response && response.status === 401) {
			Auth.deauthenticateUser();
		}
		reject({ error });
	} else {
		resolve(response.body);
	}
};
