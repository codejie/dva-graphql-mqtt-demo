import MQTT from 'mqtt';

// options = {
//     url,
//     clientId,
//     onConnected,
//     onMessage,
//     onClose,
//     onError,
//     onOffline
// };

class MQTTClient {
    constructor (opts) {
        this.opts = opts;
        this.client = null;

        this.topics = {};
    }

    connect () {
        if (!this.opts || !this.opts.url) {
            throw new Error('url parameter missed.');
        }
        const opts = {
            clientId: this.opts.clientId || 'mqtt-client-dva'
        };
        this.client = MQTT.connect(this.opts.url, opts);
        if (this.opts.onConnected) {
            this.client.on('connect', this.opts.onConnected);
        }
        if (this.opts.onMessage) {
            this.client.on('message', this.opts.onMessage);
        }
        if (this.opts.onError) {
            this.client.on('error', this.opts.onError);
        }
        if (this.opts.onClose) {
            this.client.on('close', this.opts.onClose);
        }
        if (this.opts.onOffline) {
            this.client.on('offline', this.opts.onOffline);
        }
    }

    disconnect () {
        if (this.client) {
            this.client.end();
        }
    }

    subscribe ({topic}) {
        return new Promise((resolve, reject) => {
            if (this.client) {
                this.client.subscribe(topic, (err) => {
                    if (err) {
                        return reject(err);
                    }

                    this.topics[topic] = new Date();

                    resolve({topic});
                });
            } else {
                reject(new Error('not connected'));
            }
        });
    }

    unsubscribe ({topic}) {
        return new Promise((resolve, reject) => {
            if (this.client) {
                this.client.unsubscribe(topic, (err) => {
                    if (err) {
                        return reject(err);
                    }

                    delete this.topics[topic];

                    resolve({topic});
                });
            } else {
                reject(new Error('not connected'));
            }
        });
    }

    unsubscribeAll () {
        return new Promise((resolve, reject) => {
            if (this.client) {
                const array = [];
                Object.keys(this.topics).map(key => {
                    array.push(key);
                });
                this.client.unsubscribe(array, (err) => {
                    if (err) {
                        return reject(err);
                    }

                    this.topics = {};

                    resolve();
                });
            } else {
                reject(new Error('not connected'));
            }
        });
    }

    publish ({topic, message}) {
        return new Promise((resolve, reject) => {
            if (this.client) {
                this.client.publish(topic, message, undefined, (err) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve({
                        topic,
                        message
                    });
                });
            } else {
                reject(new Error('not connected'));
            }            
        });
    }
}

export default MQTTClient;