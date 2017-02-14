import React from 'react';

export const FunctionDefinition = ({ name, desc, params, returns }) => (
  <dl className='function-definition'>
    <div className='name'>{name}</div>
    { desc && <div className='desc'>{desc}</div> }
    { params && params.map((p, i) => (
      <div key={`param-${i}`}>
        <dt>{p.name}</dt>
        <dd>{p.desc}</dd>
      </div>
    ))}
    { returns &&
      <div>
        <dt>Returns</dt>
        <dd>{returns}</dd>
      </div>
    }
  </dl>
);
