import React from 'react';


const Notice = ({ title, message, type, icon }) => {

  return (
    <div className="col-lg-12">
      <div className="atbd-notice">
        <div className="card card-default card-md mb-4">
          <div className="card-header"></div>
          <div className="card-body">
            <div className="atbd-notice__content">
              <div className="atbd-notice__top text-center">
                <div className={`atbd-notice__icon bg-${type}`}>
                  <i className={icon} />
                </div>
                <div className="atbd-notice__text">
                  <h4>{title}</h4>
                  <p>{message}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>


  );
}

export default Notice;

