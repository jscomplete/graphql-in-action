import React, { useState } from 'react';

import { useStore } from '../store';
import Errors from './Errors';

export const APPROACH_FRAGMENT = `
  fragment ApproachFragment on Approach {
    content
    voteCount
    author {
      username
    }
    detailList {
      content
      category
    }
  }
`;

export default function Approach({ approach, isHighlighted }) {
  const { request } = useStore();
  const [uiErrors, setUIErrors] = useState();
  const [voteCount, setVoteCount] = useState(approach.voteCount);

  const handleVote = (direction) => async (event) => {
    event.preventDefault();
    /** GIA NOTES
     *
     * 1) Invoke the mutation to vote on an approach:
     *   - Variable `direction` is either 'UP' or 'DOWN'
     * 2) Use the code below after that. It needs these variables:
     *   - `errors` is an array of objects of type UserError
     *   - `newVoteCount` is the new count after this vote is cast

      if (errors.length > 0) {
        return setUIErrors(errors);
      }
      setVoteCount(newVoteCount);

    */
  };

  const renderVoteButton = (direction) => (
    <button className="border-none" onClick={handleVote(direction)}>
      <svg
        aria-hidden="true"
        width="24"
        height="24"
        viewBox="0 0 36 36"
        fill="#999"
      >
        {direction === 'UP' ? (
          <path d="M 2 26 h32 L18 10 2 26 z"></path>
        ) : (
          <path d="M 2 10 h32 L18 26 2 10 z"></path>
        )}
      </svg>
    </button>
  );

  return (
    <div className={`box highlighted-${isHighlighted}`}>
      <div className="approach">
        <div className="vote">
          {renderVoteButton('UP')}
          {voteCount}
          {renderVoteButton('DOWN')}
        </div>
        <div className="main">
          <pre className="code">{approach.content}</pre>
          <div className="author">{approach.author.username}</div>
        </div>
      </div>
      <Errors errors={uiErrors} />
      {approach.detailList.map((detail, index) => (
        <div key={index} className="approach-detail">
          <div className="header">{detail.category}</div>
          <div>{detail.content}</div>
        </div>
      ))}
    </div>
  );
}
