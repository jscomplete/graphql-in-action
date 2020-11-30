import React from 'react';

export default function Errors({ errors }) {
  if (!errors) {
    return null;
  }

  return errors.map((uiError, i) => (
    <div key={i} className="error">
      {uiError.message}
    </div>
  ));
}
