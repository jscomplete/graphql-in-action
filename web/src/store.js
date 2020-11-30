import React, { useState } from 'react';
import fetch from 'cross-fetch';

import * as config from './config';

const initialLocalAppState = {
  component: { name: 'Home', props: {} },
  user: JSON.parse(window.localStorage.getItem('azdev:user')),
};

// The useStoreObject is a custom hook function designed
// to be used with React's context feature
export const useStoreObject = () => {
  // This state object is used to manage
  // all local app state elements (like user/component)
  const [state, setState] = useState(() => initialLocalAppState);

  // This function can be used with 1 or more
  // state elements. For example:
  // const user = useLocalAppState('user');
  // const [component, user] = useLocalAppState('component', 'user');
  const useLocalAppState = (...stateMapper) => {
    if (stateMapper.length === 1) {
      return state[stateMapper[0]];
    }
    return stateMapper.map((element) => state[element]);
  };

  // This function shallow-merges a newState object
  // with the current local app state object
  const setLocalAppState = (newState) => {
    if (newState.component) {
      newState.component.props = newState.component.props ?? {};
    }
    setState((currentState) => {
      return { ...currentState, ...newState };
    });
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

  // This function should make an ajax call to GraphQL server
  // and return the GraphQL response object
  const request = async (requestText, { variables } = {}) => {
    /** GIA NOTES
     *
     * Make an Ajax call here to config.GRAPHQL_SERVER_URL
     * Pass both requestText and variables as body params
     *
     */
  };

  // In React components, the following is the object you get
  // when you make a useStore() call
  return {
    useLocalAppState,
    setLocalAppState,
    AppLink,
    request,
  };
};

// Define React's context object and the useStore
// custom hook function that'll use it
const AZContext = React.createContext();
export const Provider = AZContext.Provider;
export const useStore = () => React.useContext(AZContext);
