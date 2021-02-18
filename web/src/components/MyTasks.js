import React, { useState, useEffect } from 'react';
import { gql } from '@apollo/client';

import { useStore } from '../store';
import TaskSummary, { TASK_SUMMARY_FRAGMENT } from './TaskSummary';

const MY_TASK_LIST = gql`
  query myTaskList {
    me {
      taskList {
        id
        ...TaskSummary
      }
    }
  }
  ${TASK_SUMMARY_FRAGMENT}
`;

export default function MyTasks() {
  const { query } = useStore();
  const [myTaskList, setMyTaskList] = useState(null);

  useEffect(() => {
    query(MY_TASK_LIST).then(({ data }) => {
      setMyTaskList(data.me.taskList);
    });
  }, [query]);

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
