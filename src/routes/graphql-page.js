import { connect } from 'dva';

import gql from 'graphql-tag';

function onQueryClick () {
    graphqlPage.props.dispatch({
        type: 'graphql/query',
        query: gql`
            query version {
                version
            }
        `,
        variables: {}
    });
}

function onMutationClick () {
    graphqlPage.props.dispatch({
        type: 'graphql/mutate',
        mutation: gql`
        mutation archivesMutation(
            $eqId: String!
            $title: String!
        ){
            archivesMutation {
              archiveUpdate(req: {
                  eqId: $eqId,
                  title: $title
              }) {
                result {
                  code
                }
                id
                title
              }
            }
          }       
        `,
        variables: {
            eqId: "EQII_86089d0ae24ec471",
            title: "456"
        }
    });
}

function onMutation1Click () {
    graphqlPage.props.dispatch({
        type: 'graphql/mutate',
        mutation: gql`
        mutation archivesMutation(
            $req: updateOpts!
        ){
            archivesMutation {
              archiveUpdate(req: $req) {
                result {
                  code
                }
                id
                title
              }
            }
          }       
        `,
        variables: {
            req:{
                eqId: "EQII_86089d0ae24ec471",
                title: "789"
            }
        }
    });
}

function graphqlPage (props) {
    graphqlPage.props = props;
    return (
        <div>
            <h1>result = {props.data ? JSON.stringify(props.data) : JSON.stringify(props.error)}</h1>
            <div>
                <button onClick={ onQueryClick }>query</button>
            </div>
            <div>
                <button onClick={ onMutationClick }>mutation</button>
            </div>
            <div>
                <button onClick={ onMutation1Click }>mutation by other way</button>
            </div>                   
        </div>
    );
}

export default connect(state => state.graphql)(graphqlPage);