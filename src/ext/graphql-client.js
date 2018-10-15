
import ApolloClient from 'apollo-boost';

// options = {
//     uri
// };

class GraphQLClient {
    constructor (opts) {
        this.opts = opts;
        this.client = null;
    }

    connect () {
        if (!this.opts || !this.opts.uri) {
            throw new Error('uri parameter missed.');
        }
        this.client = new ApolloClient(this.opts);
    }

    query ({query, variables}) {
        // console.log('ql request = ' + JSON.stringify(query));
        return new Promise((resolve, reject) => {
            if (this.client) {
                const schema = {
                    query: query,
                    variables: variables || {}
                }
                this.client.query(schema)
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
                const schema = {
                    mutation: mutation,
                    variables: variables || {}
                }
                this.client.mutate(schema)
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
}

export default GraphQLClient;