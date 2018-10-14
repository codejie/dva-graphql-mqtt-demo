import MQTT from 'mqtt';

// options = {
//     uri,
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
    }

    connect () {
        if (!this.opts || !this.opts.uri) {
            throw new Error('uri parameter missed.');
        }
        this.client = MQTT.connect(this.opts.uri);
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

    // onMessage (topic, message) {
    //     this.opts.onMessage(topic, message.toString());
    // }

    subscribe (topic) {
        return new Promise((resolve, reject) => {
            if (this.client) {
                this.client.subscribe(topic, (err) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve({topic});
                });
            } else {
                reject(new Error('not connected'));
            }
        });
    }

    publish (topic, message) {
        return new Promise((resolve, reject) => {
            if (this.client) {
                this.client.publish(topic, message, (err) => {
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