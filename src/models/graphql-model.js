
import GraphQLClient from '../ext/graphql-client';

const GRAPHQL_URL = 'http://localhost:3000/ql';
const GRAPHQL_SUBSCRIPTION_URL = 'ws://localhost:3000/subscriptions';


const graphqlModel = {
    namespace: 'graphql',
    state: {
        data: null,
        error: null
    },
    reducers: {
        update (state, action) {
            return {
                ...state,
                ...action.result
            };
        }
    },
    effects: {
        *query (action, { call, put }) {
            const ret = yield call(graphqlModel.invoke, {
                method: 'query',
                action
                // request: action.request
            });
            yield put({
                type: 'update',
                result: ret
            });
        },
        *mutate (action, { call, put }) {
            const ret = yield call(graphqlModel.invoke, {
                method: 'mutate',
                action
            });
            yield put({
                type: 'update',
                result: ret
            });
        },
        *subscribe (action, { call, put }) {
            const ret = yield call(graphqlModel.invoke, {
                method: 'subscribe',
                action: {
                    ...action,
                    opts: {
                        url: GRAPHQL_SUBSCRIPTION_URL,
                        onMessage: graphqlModel.onSubscriptionMessage
                    }
                }
            });
            yield put({
                type: 'update',
                result: ret
            });
        },
        *endSubscribe (action, {call, put }) {
            const ret = yield call(graphqlModel.invoke, {
                method: 'endSubscribe',
                action
            });            
        }
    },
    subscriptions: {
        init ({ history, disaptch }) {
            const opts = {
                // url: 'http://localhost:3490/ql'
                url: GRAPHQL_URL
            };
            graphqlModel.client = new GraphQLClient(opts);
            graphqlModel.client.connect();
        }
    },

    onSubscriptionMessage: function (event) {
        console.log('subscription recv = ', event);
    },

    client: null,
    invoke ({method, action}) {
        return graphqlModel.client[method](action);
    }
};

export default graphqlModel;