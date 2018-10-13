import { connect } from 'dva';

import gql from 'graphql-tag';

function onQueryClick () {
    graphqlPage.props.dispatch({
        type: 'graphql/query',
        request: {
            query: gql`
                query {
                    version
                }
            `,
            variables: {}
        }
    });
}

function graphqlPage (props) {
    graphqlPage.props = props;
    return (
        <div>
            <h1>{props.data ? props.data.version : props.error}</h1>
            <div>
                <button onClick={ onQueryClick }>query</button>
            </div>
        </div>
    );
}

export default connect(state => state.graphql)(graphqlPage);