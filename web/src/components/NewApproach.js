import React, { useState, useEffect } from 'react';

import { useStore } from '../store';
import Errors from './Errors';

/** GIA NOTES
 * Define GraphQL operations here...
 */

export default function NewApproach({ taskId, onSuccess }) {
  const { useLocalAppState, request } = useStore();
  const [detailCategories, setDetailCategories] = useState([]);
  const [detailRows, setDetailRows] = useState([0]);
  const [uiErrors, setUIErrors] = useState([]);

  useEffect(() => {
    if (detailCategories.length === 0) {
      /** GIA NOTES
       *
       * 1) Invoke the query to get the detail categories:
       *    (You can't use `await` here but `promise.then` is okay)
       *
       * 2) Use the line below on the returned data:

        setDetailCategories(API_RESP_FOR_detailCategories);

       */
    }
  }, [detailCategories, request]);

  const user = useLocalAppState('user');

  if (!user) {
    return (
      <div className="box">
        <div className="center">
          Please login to add a new Approach record to this Task
        </div>
      </div>
    );
  }

  const handleNewApproachSubmit = async (event) => {
    event.preventDefault();
    setUIErrors([]);
    const input = event.target.elements;
    const detailList = detailRows.map((detailId) => ({
      category: input[`detail-category-${detailId}`].value,
      content: input[`detail-content-${detailId}`].value,
    }));
    /** GIA NOTES
     *
     * 1) Invoke the mutation to create a new approach:
     *   - Variable `taskId` is for the parent Task of this new Approach
     *   - detailList is an array of all the input for the details of this new Approach
     *   - input.*.value has what a user types in an input box
     *
     * 2) Use the code below after that. It needs these variables:
     *   - `errors` is an array of objects of type UserError
     *   - `approach` is the newly created Approach object

      if (errors.length > 0) {
        return setUIErrors(errors);
      }
      onSuccess(approach);

    */
  };

  return (
    <div className="main-container">
      <div className="box box-primary">
        <form method="POST" onSubmit={handleNewApproachSubmit}>
          <div className="form-entry">
            <label>
              APPROACH
              <textarea name="content" placeholder="Be brief!" />
            </label>
          </div>
          <div className="form-entry">
            <label>
              DETAILS
              {detailRows.map((detailId) => (
                <div key={detailId} className="details-row">
                  <select name={`detail-category-${detailId}`}>
                    {detailCategories.map((category) => (
                      <option key={category.name} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    name={`detail-content-${detailId}`}
                    placeholder="Be brief!"
                  />
                </div>
              ))}
            </label>
            <button
              type="button"
              className="y-spaced"
              onClick={() =>
                setDetailRows((rows) => [...rows, rows.length])
              }
            >
              + Add more details
            </button>
          </div>
          <Errors errors={uiErrors} />
          <div className="spaced">
            <button className="btn btn-primary" type="submit">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
