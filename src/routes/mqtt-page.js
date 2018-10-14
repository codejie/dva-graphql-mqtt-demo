import { connect } from 'dva';

function onButtonConnect () {
    MQTTPage.props.dispatch({
        type: 'mqtt/connect',
    });
}

function onButtonSubscribe () {
    MQTTPage.props.dispatch({
        type: 'mqtt/subscribe',
        topic: 'dva_test'
    });    
}

function onButtonPublish () {
    MQTTPage.props.dispatch({
        type: 'mqtt/publish',
        topic: 'dva_test',
        message: 'hello mqtt',
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
            </div>
            <div>
                <button onClick={onButtonSubscribe}>subscribe</button>
            </div>
            <div>
                <button onClick={onButtonPublish}>publish</button>
            </div>
        </div>
    );
}

export default connect((state) => state.mqtt)(MQTTPage);