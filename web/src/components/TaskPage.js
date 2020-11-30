import React, { useState, useEffect } from 'react';

import { useStore } from '../store';
import NewApproach from './NewApproach';
import Approach from './Approach';
import TaskSummary from './TaskSummary';

/** GIA NOTES
 * Define GraphQL operations here...
 */

const mockTaskInfo = {
  id: 42,
  content: 'Mock Task content',
  author: { username: 'mock-author' },
  tags: ['tag1', 'tag2'],
  approachList: [
    {
      id: 42,
      content: 'Mock Approach content',
      author: { username: 'mock-author' },
      voteCount: 0,
      detailList: [
        {
          content: 'Mock note...',
          category: 'NOTE',
        },
      ],
    },
  ],
};

export default function TaskPage({ taskId }) {
  const { request, AppLink } = useStore();
  const [taskInfo, setTaskInfo] = useState(null);
  const [showAddApproach, setShowAddApproach] = useState(false);
  const [highlightedApproachId, setHighlightedApproachId] = useState();

  useEffect(() => {
    if (!taskInfo) {
      /** GIA NOTES
       *
       *  1) Invoke the query to get the information of a Task object:
       *     (You can't use `await` here but `promise.then` is okay)
       *
       *  2) Change the line below to use the returned data instead of mockTaskInfo:
       *
       */

      setTaskInfo(mockTaskInfo); // TODO: Replace mockTaskInfo with API_RESP_FOR_taskInfo
    }
  }, [taskId, taskInfo, request]);

  if (!taskInfo) {
    return <div className="loading">Loading...</div>;
  }

  const handleAddNewApproach = (newApproach) => {
    setTaskInfo((pTask) => ({
      ...pTask,
      approachList: [newApproach, ...pTask.approachList],
    }));
    setHighlightedApproachId(newApproach.id);
    setShowAddApproach(false);
  };

  return (
    <div>
      <AppLink to="Home">{'<'} Home</AppLink>
      <TaskSummary task={taskInfo} />
      <div>
        <div>
          {showAddApproach ? (
            <NewApproach
              taskId={taskId}
              onSuccess={handleAddNewApproach}
            />
          ) : (
            <div className="center y-spaced">
              <button
                onClick={() => setShowAddApproach(true)}
                className="btn btn-secondary"
              >
                + Add New Approach
              </button>
            </div>
          )}
        </div>
        <h2>Approaches ({taskInfo.approachList.length})</h2>
        {taskInfo.approachList.map((approach) => (
          <div key={approach.id} id={approach.id}>
            <Approach
              approach={approach}
              isHighlighted={highlightedApproachId === approach.id}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
