
import ApolloClient from 'apollo-boost';

// options = {
//     url
//     cached: false
// };

// https://www.apollographql.com/docs/react/api/apollo-client.html

class GraphQLClient {
    constructor (opts) {
        this.opts = opts;
        this.client = null;
        this.ws = null;
            //url
            //topic
            // onOpen
            // onError
            //onClose
            //onMessage        
        // this.subscriptions = {}
    }

    connect () {
        if (!this.opts || !this.opts.url) {
            throw new Error('url parameter missed.');
        }
        this.client = new ApolloClient(this.opts);
    }

    query ({query, variables}) {
        // console.log('ql request = ' + JSON.stringify(query));
        return new Promise((resolve, reject) => {
            if (this.client) {
                const options = {
                    query: query,
                    variables: variables || {},
                    fetchPolicy: this.opts.cached ? undefined : 'no-cache'
                }
                this.client.query(options)
                    .then(response => {
                        const ret = {};
                        if (response.error) {
                            ret.error = response.error;
                        } else if (response.data) {
                            ret.data = response.data;
                        } else {
                            ret.error = 'no response';
                        }
                        resolve(ret);
                    })
                    .catch(error => {
                        resolve({
                            error: error.message
                        });
                        // reject(error);
                    });
            } else {
                resolve({
                    error: 'connect graphql server first.'
                });
                // reject(new Error('connect graphql server first.'));
            }
        });
    }

    mutate ({mutation, variables}) {
        return new Promise((resolve, reject) => {
            if (this.client) {
                const options = {
                    mutation: mutation,
                    variables: variables || {}
                }
                this.client.mutate(options)
                    .then(response => {
                        const ret = {};
                        if (response.error) {
                            ret.error = response.error;
                        } else if (response.data) {
                            ret.data = response.data;
                        } else {
                            ret.error = 'no response';
                        }
                        resolve(ret);
                    })
                    .catch(error => {
                        resolve({
                            error: error.message
                        });
                        // reject(error);
                    });                
            } else {
                resolve({
                    error: 'connect graphql server first.'
                });                
            }
        });
    }

    subscribe ({/*topic,*/ subscription, variables, opts}) {
        return new Promise((resolve, reject) => {
            if (!this.ws) {
                this.ws = new WebSocket(opts.url, 'graphql-ws');
                this.ws.onmessage = (event) => {
                    if (event.data) {
                        const data = JSON.parse(event.data);
                        if (data.type === 'data') {
                            if (opts.onMessage) {
                                opts.onMessage({
                                    // topic: topic,
                                    data: data
                                });
                            }
                        }
                    }
                };
                this.ws.onclose = opts.onClose;
                this.ws.onerror = opts.OnError;                

                this.ws.onopen = () => {
                    try {
                        this._wsInit();
                        this._wsSendSubscription({subscription, variables});

                        resolve({});
                    } catch (err) {
                        reject({
                            // topic: topic,
                            error: err.message
                        });
                    }
                };
            } else {
                try {
                    this._wsSendSubscription({subscription, variables});

                    resolve({});
                } catch (err) {
                    reject({
                        // topic: topic,
                        error: err.message
                    });
                }                
            }
        });
    }

    unsubscribe () {
        //NOT find in GraphQL protocol.
        //I don't know how to this.
    }

    endSubscribe () {
        return new Promise((resolve, reject) => {
            if (this.ws) {
                this.ws.close();
            }
            resolve();
        });
    }

    _wsInit () {
        this.ws.send(JSON.stringify({
            type: 'connection_init',
            payload: {}
        }));
    }

    _wsSendSubscription ({subscription, variables}) {
        this.ws.send(JSON.stringify({
            id: 1,
            type: 'start',
            payload: {
                variables,
                query: subscription
            }
        }));
    }

}

export default GraphQLClient;