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
                    type: 'subscribed',
                    subscribed: false,
                    topic: action.topic,
                    error: err.message
                });
            };
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
                    type: 'published',
                    published: false,
                    topic: action.topic,
                    message: action.message
                });
            }
        }
    },
    subscriptions: {
        init ({ history, dispatch }) {
            const opts = {
                uri: 'mqtts://port.51mcee.com:3385',
                onConnected: () => mqttModel.onConnected(dispatch),
                onMessage: (topic, message) => mqttModel.onMessage(dispatch, topic, message.toString())
            };
            mqttModel.client = new MQTTClient(opts);
        }
    },

    client: null,
    invoke ({method, action}) {
        switch(method) {
            case 'connect':
                return mqttModel.client.connect();
            case 'subscribe':
                return mqttModel.client.subscribe(action.topic);
            case 'publish':
                return mqttModel.client.publish(action.topic, action.message);
            default:
                throw new Error('unknown method - ' + method);
        }
    },
    onConnected (dispatch) {
        dispatch({
            type: 'connected',
            connected: true
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