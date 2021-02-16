import React from 'react';
import { Link } from 'react-router-dom';

const sections = () => {

  const bannerMission = {
    backgroundColor: "#018c3b"
  };

  const bannerPersonnel = {
    backgroundColor: "#59607e"
  };

  const bannerCarburant = {
    backgroundColor: "#6907ed"
  };

  const bannerRetribution = {
    backgroundColor: "#e26d04"
  };

  return (
    <div class="signUP-admin p-5">
      <div class="container-fluid">
        <div class="social-dash-wrap pt-5 m-5 px-3">
          <div class="row">
            <div class="col-xl-6 col-sm-6 ">
              <div class="card  banner-feature banner-feature--3 " style={bannerMission}>
                <div class="banner-feature__shape box m-5">
                  <img src="img/sections/transport.png" alt="img" class="svg" />
                </div>
                <div class="d-flex justify-content-center">
                  <div class="card-body">
                    <h2 class="banner-feature__heading color-white">Gestion Des Missions</h2>
                    <p class="banner-feature__para text-white ">La gestion des Missions du Ministère.</p>
                    <Link to="/tableau-de-bord" class="banner-feature__btn btn color-primary btn-md px-20 bg-white radius-xs fs-15">Consulter</Link>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-xl-6 col-sm-6">
              <div class="card banner-feature banner-feature--3" style={bannerPersonnel}>
                <div class="banner-feature__shape box m-5">
                  <img src="img/sections/personnel.png" alt="img" class="svg" />
                </div>
                <div class="d-flex justify-content-center">
                  <div class="card-body">
                    <h2 class="banner-feature__heading color-white">Gestion Du Peronnel </h2>
                    <p class="banner-feature__para text-white ">La gestion du Peronnel du Ministère.</p>
                    {/* <Link to="#" class="banner-feature__btn btn color-primary btn-md px-20 bg-white radius-xs fs-15">Consulter</Link> */}
                  </div>
                </div>
              </div>
            </div>
            <div class="col-xl-6 col-sm-6">
              <div class="card banner-feature banner-feature--3" style={bannerCarburant}>
                <div class="banner-feature__shape box m-5">
                  <img src="img/sections/carburant.png" alt="img" class="svg" />
                </div>
                <div class="d-flex justify-content-center">
                  <div class="card-body">
                    <h2 class="banner-feature__heading color-white">Gestion Du Carburant </h2>
                    <p class="banner-feature__para text-white">La gestion du Peronnel du Ministère.</p>
                    {/* <Link to="#" class="banner-feature__btn btn color-primary btn-md px-20 bg-white radius-xs fs-15">Consulter</Link> */}
                  </div>
                </div>
              </div>
            </div>
            <div class="col-xl-6 col-sm-6">
              <div class="card banner-feature banner-feature--3" style={bannerRetribution}>
                <div class="banner-feature__shape box m-5">
                  <img src="img/sections/argent.png" alt="img" class="svg" />
                </div>
                <div class="d-flex justify-content-center">
                  <div class="card-body">
                    <h2 class="banner-feature__heading color-white">Retribution </h2>
                    <p class="banner-feature__para text-white">La gestion du Peronnel du Ministère.</p>
                    {/* <Link to="#" class="banner-feature__btn btn color-primary btn-md px-20 bg-white radius-xs fs-15">Consulter</Link> */}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
export default sections;