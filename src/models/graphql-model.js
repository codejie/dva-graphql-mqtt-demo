
import GraphQLClient from '../ext/graphql-client';

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
                request: action.request
            });
            yield put({
                type: 'update',
                result: ret
            });
        }
    },
    subscriptions: {
        init ({ history, disaptch }) {
            const opts = {
                uri: 'http://localhost:3490/ql'
            };
            graphqlModel.client = new GraphQLClient(opts);
            graphqlModel.client.connect();
        }
    },

    client: null,
    invoke ({method, request}) {
        return graphqlModel.client[method](request);
    }
    // query (request) {
    //     return graphqlModel.client.query(request);
    // }
};

export default graphqlModel;