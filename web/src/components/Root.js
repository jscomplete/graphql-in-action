import React from 'react';

import { useStore } from '../store';
import * as mainComponents from './index';
import Navbar from './Navbar';

export default function Root() {
  const { useLocalAppState } = useStore();

  const [component, user] = useLocalAppState('component', 'user');
  const Component = mainComponents[component.name];

  return (
    <div className="route-container">
      <Navbar user={user} />
      <div className="main-component">
        <Component {...component.props} />
      </div>
    </div>
  );
}
