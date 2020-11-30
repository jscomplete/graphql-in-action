import React, { useState, useEffect } from 'react';

import { useStore } from '../store';
import TaskSummary from './TaskSummary';

/** GIA NOTES
 * Define GraphQL operations here...
 */

export default function MyTasks() {
  const { request } = useStore();
  const [myTaskList, setMyTaskList] = useState(null);

  useEffect(() => {
    /** GIA NOTES
     *
     *  1) Invoke the query to get current user list of Tasks
     *     (You can't use `await` here but `promise.then` is okay)
     *
     *  2) Use the line below on the returned data:

      setMyTaskList(API_RESP_FOR_userTaskList);

     */
  }, [request]);

  if (!myTaskList) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div>
      <div>
        <h1>My Tasks</h1>
        {myTaskList.length === 0 && (
          <div className="box box-primary">
            You have not created any Task entries yet
          </div>
        )}
        {myTaskList.map((task) => (
          <TaskSummary key={task.id} task={task} link={true} />
        ))}
      </div>
    </div>
  );
}
