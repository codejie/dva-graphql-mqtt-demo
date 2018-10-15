import { connect } from 'dva';

function onButtonConnect () {
    MQTTPage.props.dispatch({
        type: 'mqtt/connect',
    });
}

function onButtonDisconnect () {
    MQTTPage.props.dispatch({
        type: 'mqtt/disconnect',
    });
}

function onButtonSubscribe () {
    MQTTPage.props.dispatch({
        type: 'mqtt/subscribe',
        topic: 'dva_test'
    });    
}

function onButtonUnsubscribe () {
    MQTTPage.props.dispatch({
        type: 'mqtt/unsubscribe',
        topic: 'dva_test'
    });    
}

function onButtonUnsubscribeAll () {
    MQTTPage.props.dispatch({
        type: 'mqtt/unsubscribe_all',
        topic: 'dva_test',
    });    
}

function onButtonPublish () {
    MQTTPage.props.dispatch({
        type: 'mqtt/publish',
        topic: 'dva_test',
        message: (new Date()).toISOString()// 'hello mqtt',
    });    
}

function MQTTPage (props) {
    MQTTPage.props = props;
    return (
        <div>
            <h1>HELLO MQTT</h1>
            <h1>connected = {props.connected ? '1' : 0}</h1>
            <h1>topic = {props.topic}</h1>
            <h1>message = {props.message}</h1>
            <div>
                <button onClick={onButtonConnect}>connect</button>
                <button onClick={onButtonDisconnect}>disconnect</button>
            </div>
            <div>
                <button onClick={onButtonSubscribe}>subscribe</button>
                <button onClick={onButtonUnsubscribe}>unsubscribe</button>
                <button onClick={onButtonUnsubscribeAll}>unsubscribe all</button>
            </div>
            <div>
                <button onClick={onButtonPublish}>publish</button>
            </div>
            <h1>error = {props.error}</h1>
        </div>
    );
}

export default connect((state) => state.mqtt)(MQTTPage);