import React from 'react';


const Big = ({ message }) => {
  return (
    <div className="card card-default card-md mb-4">
      <div className="card-body">
        <div className="atbd-empty text-center">
          <div className="atbd-empty__image">
            <i className="fas fa-inbox text-light" style={{ fontSize: '50px' }}></i>
          </div>
          <div className="atbd-empty__text">
            <p className="text-light" style={{ fontSize: '20px' }}>{message}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Big;