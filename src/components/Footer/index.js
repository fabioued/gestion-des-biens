import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer-wrapper">
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-12 text-center">
            <div className="footer-copyright">
              <p>2021<Link to="#">MAAH</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;