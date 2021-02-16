import React from 'react';


const Empty = ({ message }) => {
  const avatar = {
    border: '2px solid #ffff'
  };


  return (
    <div className="col-xl-12 col-lg-12 col-sm-12">
      <div className="atbd-empty text-center">
        <div className="atbd-empty__image">
          <img src="../img/folders/2.svg" alt="Empty" />
        </div>
        <div className="atbd-empty__text">
          <p className="disabled">{message}</p>
        </div>
      </div>
    </div>

  );
}

export default Empty;


