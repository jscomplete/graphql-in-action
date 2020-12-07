import React, { useState } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';

import { useStore } from '../store';
import Errors from './Errors';
import { APPROACH_FRAGMENT } from './Approach';

const DETAIL_CATEGORIES = gql`
  query getDetailCategories {
    detailCategories: __type(name: "ApproachDetailCategory") {
      enumValues {
        name
      }
    }
  }
`;

const APPROACH_CREATE = gql`
  mutation approachCreate($taskId: ID!, $input: ApproachInput!) {
    approachCreate(taskId: $taskId, input: $input) {
      errors {
        message
      }
      approach {
        id
        ...ApproachFragment
      }
    }
  }
  ${APPROACH_FRAGMENT}
`;

export default function NewApproach({ taskId, onSuccess }) {
  const { useLocalAppState } = useStore();
  const [detailRows, setDetailRows] = useState([0]);
  const [uiErrors, setUIErrors] = useState([]);

  const { error: dcError, loading: dcLoading, data } = useQuery(
    DETAIL_CATEGORIES
  );

  const [createApproach, { error, loading }] = useMutation(
    APPROACH_CREATE,
    {
      update(cache, { data: { approachCreate } }) {
        if (approachCreate.approach) {
          onSuccess((taskInfo) => {
            cache.modify({
              id: cache.identify(taskInfo),
              fields: {
                approachList(currentList) {
                  return [approachCreate.approach, ...currentList];
                },
              },
            });
            return approachCreate.approach.id;
          });
        }
      },
    }
  );

  const user = useLocalAppState('user');

  if (dcLoading) {
    return <div className="loading">Loading...</div>;
  }
  if (dcError || error) {
    return <div className="error">{(dcError || error).message}</div>;
  }
  const detailCategories = data.detailCategories.enumValues;

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
    const { data, errors: rootErrors } = await createApproach({
      variables: {
        taskId,
        input: {
          content: input.content.value,
          detailList,
        },
      },
    });
    if (rootErrors) {
      return setUIErrors(rootErrors);
    }
    const { errors } = data.approachCreate;
    if (errors.length > 0) {
      return setUIErrors(errors);
    }
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
