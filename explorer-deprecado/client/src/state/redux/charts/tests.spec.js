/**
 *    SPDX-License-Identifier: Apache-2.0
 */

import nock from 'nock';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import actions from './actions';
import operations from './operations';
import reducers from './reducers';
import * as selectors from './selectors';
import types from './types';

const middleware = [thunk];
const mockStore = configureMockStore(middleware);
const initialState = {};

describe('Charts', () => {
	describe('Operations', () => {
		afterEach(() => {
			nock.cleanAll();
		});

		const channel = 'mychannel';

		test('blockPerHour', async done => {
			nock(/\w*(\W)/g)
				.get(`/api/blocksByHour/${channel}/1`)
				.reply(200, {
					rows: [{ test: 'rows' }]
				});

			const expectedActions = [{ type: types.BLOCK_CHART_HOUR }];
			const store = mockStore(initialState, expectedActions);

			await store.dispatch(operations.blockPerHour('mychannel'));
			const actions = store.getActions();
			expect(actions[0].type).toBe(types.BLOCK_CHART_HOUR);
			done();
		});

		test('blockPerHour catch error', async done => {
			spyOn(console, 'error');
			nock(/\w*(\W)/g)
				.get(`/api/blocksByHour/${channel}/1`)
				.replyWithError({ code: 'ECONNREFUSED' });

			const expectedActions = [{ type: types.BLOCK_CHART_HOUR }];
			const store = mockStore(initialState, expectedActions);

			await store.dispatch(operations.blockPerHour(channel));
			const actions = store.getActions();
			expect(actions).toEqual([]);
			done();
		});

		test('blockPerMin', async done => {
			nock(/\w*(\W)/g)
				.get(`/api/blocksByMinute/${channel}/1`)
				.reply(200, {
					rows: [{ test: 'rows' }]
				});

			const expectedActions = [{ type: types.BLOCK_CHART_MIN }];
			const store = mockStore(initialState, expectedActions);

			await store.dispatch(operations.blockPerMin(channel));
			const actions = store.getActions();
			expect(actions[0].type).toBe(types.BLOCK_CHART_MIN);
			done();
		});

		test('blockPerMin catch error', async done => {
			spyOn(console, 'error');
			nock(/\w*(\W)/g)
				.get(`/api/blocksByMinute/${channel}/1`)
				.replyWithError({ code: 'ECONNREFUSED' });

			const expectedActions = [{ type: types.BLOCK_CHART_MIN }];
			const store = mockStore(initialState, expectedActions);

			await store.dispatch(operations.blockPerMin(channel));
			const actions = store.getActions();
			expect(actions).toEqual([]);
			done();
		});

		test('changeChannel', async done => {
			nock(/\w*(\W)/g)
				.get(`/api/changeChannel/${channel}`)
				.reply(200, {
					rows: [{ test: 'rows' }]
				});

			const expectedActions = [{ type: types.CHANGE_CHANNEL }];
			const store = mockStore(initialState, expectedActions);

			await store.dispatch(operations.changeChannel(channel));
			const actions = store.getActions();
			expect(actions[0].type).toBe(types.CHANGE_CHANNEL);
			done();
		});

		test('changeChannel catch error', async done => {
			spyOn(console, 'error');
			nock(/\w*(\W)/g)
				.get(`/api/changeChannel/${channel}`)
				.replyWithError({ code: 'ECONNREFUSED' });

			const expectedActions = [{ type: types.CHANGE_CHANNEL }];
			const store = mockStore(initialState, expectedActions);

			await store.dispatch(operations.changeChannel(channel));
			const actions = store.getActions();
			expect(actions).toEqual([]);
			done();
		});

		test('channel', async done => {
			nock(/\w*(\W)/g)
				.get('/api/curChannel')
				.reply(200, {
					rows: [{ test: 'rows' }]
				});

			const expectedActions = [{ type: types.CHANNEL }];
			const store = mockStore(initialState, expectedActions);

			await store.dispatch(operations.channel());
			const actions = store.getActions();
			expect(actions[0].type).toBe(types.CHANNEL);
			done();
		});

		test('channel catch error', async done => {
			spyOn(console, 'error');
			nock(/\w*(\W)/g)
				.get('/api/curChannel')
				.replyWithError({ code: 'ECONNREFUSED' });

			const expectedActions = [{ type: types.CHANGE_CHANNEL }];
			const store = mockStore(initialState, expectedActions);

			await store.dispatch(operations.channel());
			const actions = store.getActions();
			expect(actions).toEqual([]);
			done();
		});

		test('channelList', async done => {
			nock(/\w*(\W)/g)
				.get('/api/channels')
				.reply(200, {
					rows: [{ test: 'rows' }]
				});

			const expectedActions = [{ type: types.CHANNEL_LIST }];
			const store = mockStore(initialState, expectedActions);

			await store.dispatch(operations.channelList());
			const actions = store.getActions();
			expect(actions[0].type).toBe(types.CHANNEL_LIST);
			done();
		});

		test('channelList catch error', async done => {
			spyOn(console, 'error');
			nock(/\w*(\W)/g)
				.get('/api/channels')
				.replyWithError({ code: 'ECONNREFUSED' });

			const expectedActions = [{ type: types.CHANNEL_LIST }];
			const store = mockStore(initialState, expectedActions);

			await store.dispatch(operations.channelList());
			const actions = store.getActions();
			expect(actions).toEqual([]);
			done();
		});

		test('dashStats', async done => {
			nock(/\w*(\W)/g)
				.get(`/api/status/${channel}`)
				.reply(200, {
					rows: [{ test: 'rows' }]
				});

			const expectedActions = [{ type: types.DASHBOARD_STATS }];
			const store = mockStore(initialState, expectedActions);

			await store.dispatch(operations.dashStats(channel));
			const actions = store.getActions();
			expect(actions[0].type).toBe(types.DASHBOARD_STATS);
			done();
		});

		test('dashStats catch error', async done => {
			spyOn(console, 'error');
			nock(/\w*(\W)/g)
				.get(`/api/status/${channel}`)
				.replyWithError({ code: 'ECONNREFUSED' });

			const expectedActions = [{ type: types.DASHBOARD_STATS }];
			const store = mockStore(initialState, expectedActions);

			await store.dispatch(operations.dashStats(channel));
			const actions = store.getActions();
			expect(actions).toEqual([]);
			done();
		});

		test('notification', () => {
			const expectedActions = [{ type: types.NOTIFICATION_LOAD }];
			const store = mockStore(initialState, expectedActions);

			store.dispatch(operations.notification('{"test": true}'));
			const actions = store.getActions();
			expect(actions[0].type).toBe(types.NOTIFICATION_LOAD);
		});

		test('peerStatus', async done => {
			nock(/\w*(\W)/g)
				.get(`/api/peersStatus/${channel}`)
				.reply(200, {
					rows: [{ test: 'rows' }]
				});

			const expectedActions = [{ type: types.PEER_STATUS }];
			const store = mockStore(initialState, expectedActions);

			await store.dispatch(operations.peerStatus(channel));
			const actions = store.getActions();
			expect(actions[0].type).toBe(types.PEER_STATUS);
			done();
		});

		test('peerStatus catch error', async done => {
			spyOn(console, 'error');
			nock(/\w*(\W)/g)
				.get(`/api/peersStatus/${channel}`)
				.replyWithError({ code: 'ECONNREFUSED' });

			const expectedActions = [{ type: types.peerStatus }];
			const store = mockStore(initialState, expectedActions);

			await store.dispatch(operations.peerStatus(channel));
			const actions = store.getActions();
			expect(actions).toEqual([]);
			done();
		});

		test('transactionByOrg', async done => {
			nock(/\w*(\W)/g)
				.get(`/api/txByOrg/${channel}`)
				.reply(200, {
					rows: [{ test: 'rows' }]
				});

			const expectedActions = [{ type: types.TRANSACTION_CHART_ORG }];
			const store = mockStore(initialState, expectedActions);

			await store.dispatch(operations.transactionByOrg(channel));
			const actions = store.getActions();
			expect(actions[0].type).toBe(types.TRANSACTION_CHART_ORG);
			done();
		});

		test('transactionByOrg catch error', async done => {
			spyOn(console, 'error');
			nock(/\w*(\W)/g)
				.get(`/api/txByOrg/${channel}`)
				.replyWithError({ code: 'ECONNREFUSED' });

			const expectedActions = [{ type: types.TRANSACTION_CHART_ORG }];
			const store = mockStore(initialState, expectedActions);

			await store.dispatch(operations.transactionByOrg(channel));
			const actions = store.getActions();
			expect(actions).toEqual([]);
			done();
		});

		test('transactionPerHour', async done => {
			nock(/\w*(\W)/g)
				.get(`/api/txByHour/${channel}/1`)
				.reply(200, {
					rows: [{ test: 'rows' }]
				});

			const expectedActions = [{ type: types.TRANSACTION_CHART_HOUR }];
			const store = mockStore(initialState, expectedActions);

			await store.dispatch(operations.transactionPerHour(channel));
			const actions = store.getActions();
			expect(actions[0].type).toBe(types.TRANSACTION_CHART_HOUR);
			done();
		});

		test('transactionPerHour catch error', async done => {
			spyOn(console, 'error');
			nock(/\w*(\W)/g)
				.get(`/api/txByHour/${channel}/1`)
				.replyWithError({ code: 'ECONNREFUSED' });

			const expectedActions = [{ type: types.TRANSACTION_CHART_HOUR }];
			const store = mockStore(initialState, expectedActions);

			await store.dispatch(operations.transactionPerHour(channel));
			const actions = store.getActions();
			expect(actions).toEqual([]);
			done();
		});

		test('transactionPerMin', async done => {
			nock(/\w*(\W)/g)
				.get(`/api/txByMinute/${channel}/1`)
				.reply(200, {
					rows: [{ test: 'rows' }]
				});

			const expectedActions = [{ type: types.TRANSACTION_CHART_MIN }];
			const store = mockStore(initialState, expectedActions);

			await store.dispatch(operations.transactionPerMin(channel));
			const actions = store.getActions();
			expect(actions[0].type).toBe(types.TRANSACTION_CHART_MIN);
			done();
		});

		test('transactionPerMin catch error', async done => {
			spyOn(console, 'error');
			nock(/\w*(\W)/g)
				.get(`/api/txByMinute/${channel}/1`)
				.replyWithError({ code: 'ECONNREFUSED' });

			const expectedActions = [{ type: types.TRANSACTION_CHART_MIN }];
			const store = mockStore(initialState, expectedActions);

			await store.dispatch(operations.transactionPerMin(channel));
			const actions = store.getActions();
			expect(actions).toEqual([]);
			done();
		});

		test('blockActivity', async done => {
			nock(/\w*(\W)/g)
				.get(`/api/blockActivity/${channel}`)
				.reply(200, {
					rows: [{ test: 'rows' }]
				});

			const expectedActions = [{ type: types.BLOCK_ACTIVITY }];
			const store = mockStore(initialState, expectedActions);

			await store.dispatch(operations.blockActivity(channel));
			const actions = store.getActions();
			expect(actions[0].type).toBe(types.BLOCK_ACTIVITY);
			done();
		});

		test('blockActivity catch error', async done => {
			spyOn(console, 'error');
			nock(/\w*(\W)/g)
				.get(`/api/blockActivity/${channel}`)
				.replyWithError({ code: 'ECONNREFUSED' });

			const expectedActions = [{ type: types.BLOCK_ACTIVITY }];
			const store = mockStore(initialState, expectedActions);

			await store.dispatch(operations.blockActivity(channel));
			const actions = store.getActions();
			expect(actions).toEqual([]);
			done();
		});
	});

	describe('Reducers', () => {
		test('blockPerHourReducer', () => {
			const payload = { rows: 'test' };
			const action = actions.getBlockPerHour(payload);

			const newState = reducers(initialState, action);
			expect(newState.blockPerHour.rows).toBe('test');
		});

		test('blockPerMinReducer', () => {
			const payload = { rows: 'test' };
			const action = actions.getBlockPerMin(payload);

			const newState = reducers(initialState, action);
			expect(newState.blockPerMin.rows).toBe('test');
		});

		test('channelListReducer', () => {
			const payload = { channels: 'test' };
			const action = actions.getChannelList(payload);

			const newState = reducers(initialState, action);
			expect(newState.channelList.list).toBe('test');
		});

		describe('channelReducer', () => {
			test('getChannel action', () => {
				const payload = 'test';
				const action = actions.getChannel(payload);

				const newState = reducers(initialState, action);
				expect(newState.channel).toBe('test');
			});

			test('updateChannel action', () => {
				const payload = 'test';
				const action = actions.updateChannel(payload);

				const newState = reducers(initialState, action);
				expect(newState.channel).toBe('test');
			});
		});

		test('dashStatsReducer', () => {
			const payload = 'test';
			const action = actions.getDashStats(payload);

			const newState = reducers(initialState, action);
			expect(newState.dashStats).toBe('test');
		});

		test('notificationReducer', () => {
			const payload = 'test';
			const action = actions.getNotification(payload);

			const newState = reducers(initialState, action);
			expect(newState.notification).toBe('test');
		});

		test('peerStatusReducer', () => {
			const payload = { peers: 'test' };
			const action = actions.getPeerStatus(payload);

			const newState = reducers(initialState, action);
			expect(newState.peerStatus.list).toBe('test');
		});

		test('transactionByOrgReducer', () => {
			const payload = { rows: 'test' };
			const action = actions.getTransactionByOrg(payload);

			const newState = reducers(initialState, action);
			expect(newState.transactionByOrg.rows).toBe('test');
		});

		test('transactionPerHourReducer', () => {
			const payload = { rows: 'test' };
			const action = actions.getTransactionPerHour(payload);

			const newState = reducers(initialState, action);
			expect(newState.transactionPerHour.rows).toBe('test');
		});

		test('transactionPerMinReducer', () => {
			const payload = { rows: 'test' };
			const action = actions.getTransactionPerMin(payload);

			const newState = reducers(initialState, action);
			expect(newState.transactionPerMin.rows).toBe('test');
		});

		test('errorMessageReducer', () => {
			const payload = 'error';
			const action = actions.getErroMessage(payload);

			const newState = reducers(initialState, action);
			expect(newState.errorMessage.error).toBe('error');
		});

		test('blockActivityReducer', () => {
			const payload = { row: 'testing' };
			const action = actions.getBlockActivity(payload);

			const newState = reducers(initialState, action);
			expect(newState.blockActivity.rows).toBe('testing');
		});
	});

	describe('selector', () => {
		test('blockPerHourSelector', () => {
			const state = { charts: { blockPerHour: { rows: 'test' } } };
			const blockPerHour = selectors.blockPerHourSelector(state);
			expect(blockPerHour).toBe('test');
		});

		test('blockPerMinSelector', () => {
			const state = { charts: { blockPerMin: { rows: 'test' } } };
			const blockPerMin = selectors.blockPerMinSelector(state);
			expect(blockPerMin).toBe('test');
		});

		test('channelListSelector', () => {
			const state = { charts: { channelList: { list: 'test' } } };
			const channelList = selectors.channelListSelector(state);
			expect(channelList).toBe('test');
		});

		test('currentChannelSelector', () => {
			const state = { charts: { channel: { currentChannel: 'test' } } };
			const currentChannel = selectors.currentChannelSelector(state);
			expect(currentChannel).toBe('test');
		});
	});

	test('dashStatsSelector', () => {
		const state = { charts: { dashStats: 'test' } };
		const dashStats = selectors.dashStatsSelector(state);
		expect(dashStats).toBe('test');
	});

	test('notificationSelector', () => {
		const state = { charts: { notification: 'test' } };
		const notification = selectors.notificationSelector(state);
		expect(notification).toBe('test');
	});

	test('peerStatusSelector', () => {
		const state = { charts: { peerStatus: { list: 'test' } } };
		const peerStatus = selectors.peerStatusSelector(state);
		expect(peerStatus).toBe('test');
	});

	test('transactionByOrgSelector', () => {
		const state = { charts: { transactionByOrg: { rows: 'test' } } };
		const transactionByOrg = selectors.transactionByOrgSelector(state);
		expect(transactionByOrg).toBe('test');
	});

	test('transactionPerHourSelector', () => {
		const state = { charts: { transactionPerHour: { rows: 'test' } } };
		const transactionPerHour = selectors.transactionPerHourSelector(state);
		expect(transactionPerHour).toBe('test');
	});

	test('transactionPerMinSelector', () => {
		const state = { charts: { transactionPerMin: { rows: 'test' } } };
		const transactionPerMin = selectors.transactionPerMinSelector(state);
		expect(transactionPerMin).toBe('test');
	});

	test('errorMessageSelector', () => {
		const state = { charts: { errorMessage: { error: 'test' } } };
		const errorMessage = selectors.errorMessageSelector(state);
		expect(errorMessage).toBe('test');
	});

	test('blockActivitySelector', () => {
		const state = { charts: { blockActivity: { rows: 'test' } } };
		const blockActivity = selectors.blockActivitySelector(state);
		expect(blockActivity).toBe('test');
	});
});
