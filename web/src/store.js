import React from 'react';
import { useApolloClient, useQuery, gql } from '@apollo/client';

export const LOCAL_APP_STATE = gql`
  query localAppState {
    component @client {
      name
      props
    }
    user @client {
      username
      authToken
    }
  }
`;

export const useStore = () => {
  const client = useApolloClient();

  const useLocalAppState = (...stateMapper) => {
    const { data } = useQuery(LOCAL_APP_STATE);
    if (stateMapper.length === 1) {
      return data[stateMapper[0]];
    }
    return stateMapper.map((element) => data[element]);
  };

  const setLocalAppState = (newState) => {
    if (newState.component) {
      newState.component.props = newState.component.props ?? {};
    }
    const currentState = client.readQuery({
      query: LOCAL_APP_STATE,
    });
    const updateState = () => {
      client.writeQuery({
        query: LOCAL_APP_STATE,
        data: { ...currentState, ...newState },
      });
    };
    if (newState.user || newState.user === null) {
      client.onResetStore(updateState);
      client.resetStore();
    } else {
      updateState();
    }
  };

  // This is a component that can be used in place of
  // HTML anchor elements to navigate between pages
  // in the single-page app. The `to` prop is expected to be
  // a React component (like `Home` or `TaskPage`)
  const AppLink = ({ children, to, ...props }) => {
    const handleClick = (event) => {
      event.preventDefault();
      setLocalAppState({
        component: { name: to, props },
      });
    };
    return (
      <a href={to} onClick={handleClick}>
        {children}
      </a>
    );
  };

  // In React components, the following is the object you get
  // when you make a useStore() call
  return {
    useLocalAppState,
    setLocalAppState,
    AppLink,
    client,
  };
};
