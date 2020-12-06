import React from 'react';

import { useStore } from '../store';

export const TASK_SUMMARY_FRAGMENT = `
  fragment TaskSummary on Task {
    content
    author {
      username
    }
    tags
  }
`;

export default function TaskSummary({ task, link = false }) {
  const { AppLink } = useStore();

  return (
    <div className="box box-primary">
      {link ? (
        <AppLink to="TaskPage" taskId={task.id}>
          {task.content}
        </AppLink>
      ) : (
        task.content
      )}
      <div className="box-footer">
        <div className="text-secondary">{task.author.username}</div>
        <div className="tags">
          {task.tags.map((tag) => (
            <span key={tag} className="box-label">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
