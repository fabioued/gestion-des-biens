import React from 'react';


const Alert = ({ message, type }) => {
  return (
    <div className={`alert-icon-big alert alert-${type} text-center `} role="alert">
      <div className="alert-icon">
        <span data-feather="layers" />
      </div>
      <div className="alert-content">
        <h6 className="alert-heading">{message}</h6>
      </div>
    </div>

  );
}

export default Alert;




