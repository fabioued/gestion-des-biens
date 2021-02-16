import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="container-fluid">
      <div className="row justify-content-center">
        <div className="col-12">
          <div className="min-vh-100 content-center">
            <div className="error-page text-center">
              <img src="img/svg/404.svg" alt={404} className="svg" />
              <div className="error-page__title text-primary">404</div>
              <h5 className="fw-500">Désolé! la page que vous recherchez n'existe pas.</h5>
              <div className="content-center mt-30">
                <Link to="/" className="btn btn-primary btn-default btn-squared px-30"> Accueil</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotFound;