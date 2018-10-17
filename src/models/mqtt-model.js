import MQTTClient from '../ext/mqtt-client';

const mqttModel = {
    namespace: 'mqtt',
    state: {
        connected: false,
        published: false,
        subscribed: false,
        topic: null,
        message: null,
        error: null
    },
    reducers: {
        connected (state, action) {
            return {
                ...state,
                connected: action.connected
            };
        },
        subscribed (state, action) {
            return {
                ...state,
                subscribed: action.subscribed,
                topic: action.topic
            };
        },
        published (state, action) {
            return {
                ...state,
                published: action.published
            };
        },
        message (state, action) {
            return {
                ...state,
                topic: action.topic,
                message: action.message
            };
        },
        error (state, action) {
            return {
                ...state,
                error: action.error
            };
        }
    },
    effects: {
        *connect (action, { call, put }) {
            yield call(mqttModel.invoke, {
                method: 'connect'
            });
            // yield put({
            //     type: 'connected',
            //     connected: true
            // });
        },
        *disconnect (action, { call, put }) {
            yield call(mqttModel.invoke, {
                method: 'disconnect'
            });
        },
        *subscribe (action, { call, put }) {
            try {
                const ret = yield call(mqttModel.invoke, {
                    method: 'subscribe',
                    action
                });
                yield put({
                    type: 'subscribed',
                    subscribed: true,
                    topic: ret.topic
                });

            } catch (err) {
                yield put({
                    type: 'error',
                    error: err.message
                });
            };
        },
        *unsubscribe (action, { call, put }) {
            try {
                const ret = yield call(mqttModel.invoke, {
                    method: 'unsubscribe',
                    action
                })
            } catch (err) {
                yield put({
                    type: 'error',
                    error: err.message
                });
            }
        },
        *unsubscribe_all (action, { call, put }) {
            try {
                const ret = yield call(mqttModel.invoke, {
                    method: 'unsubscribeAll',
                    action
                })
            } catch (err) {
                yield put({
                    type: 'error',
                    error: err.message
                });
            }            
        },
        *publish (action, { call, put }) {
            try {
                const ret = yield call(mqttModel.invoke, {
                    method: 'publish',
                    action
                });
                yield put({
                    type: 'published',
                    published: true,
                    topic: ret.topic,
                    message: ret.message
                });
            } catch (err) {
                yield put({
                    type: 'error',
                    error: err.message
                });
            }
        }
    },
    subscriptions: {
        init ({ history, dispatch }) {
            const opts = {
                url: 'mqtts://port.51mcee.com:3385',
                clientId: 'test',
                onConnected: () => mqttModel.onConnected(dispatch),
                onClose: () => mqttModel.onDisconnected(dispatch),
                onMessage: (topic, message) => mqttModel.onMessage(dispatch, topic, message.toString())
            };
            mqttModel.client = new MQTTClient(opts);
        }
    },

    client: null,
    invoke ({method, action}) {
        return mqttModel.client[method](action);
    },
    onConnected (dispatch) {
        dispatch({
            type: 'connected',
            connected: true
        });
    },
    onDisconnected (dispatch) {
        dispatch({
            type: 'connected',
            connected: false
        });
    },
    onMessage (dispatch, topic, message) {
        dispatch({
            type: 'message',
            topic: topic,
            message: message
        });
    }
};

export default mqttModel;