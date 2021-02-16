import React from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';


class Aside extends React.Component {
  constructor() {
    super();
    this.state = {
      authUser: null,
      type_agent: null,
      droits: null,
    };
  }
  componentWillMount() {
    const authUser = JSON.parse(localStorage.getItem('user'));
    const droits = authUser.droit;
    //console.log('authUser', authUser);
    let type_agent = '';
    if (droits.DroitTableSignature) {
      type_agent = "dg"
    } else {
      type_agent = "agent"
    }
    this.setState({
      authUser,
      type_agent,
      droits
    });
  }

  render() {

    const active = (link) => {
      // const location = useLocation;
      const pathname = window.location.pathname;

      //console.log('pathname', pathname);
      if (pathname === link) {
        return 'active';
      }
    }
    return (
      <aside className="sidebar" >
        <div className="sidebar__menu-group">
          <ul className="sidebar_nav">
            <li className="menu-title">
              <span>Menu / Gestion Des Missions</span>
            </li>
            <li>
              <Link to="/accueil">
                <span className="nav-icon">
                  <i className="fas fa-home"></i>
                </span>
                <span className="menu-text">Accueil</span>
              </Link>
            </li>
            <li className={active('/tableau-de-bord')}>
              <Link to="/tableau-de-bord">
                <span className="nav-icon">
                  <i className="fas fa-tachometer-alt"></i>
                </span>
                <span className="menu-text">Tableau de Bord</span>
              </Link>
            </li>
            <li className={active('/toutes-mes-missions')}>
              <Link to="/toutes-mes-missions">
                <span className="nav-icon">
                  <i class="fas fa-border-all"></i>
                </span>
                <span className="menu-text">Toutes Mes Mission</span>
              </Link>
            </li>
            <li className={active('/missions')}>
              <Link to="/missions">
                <span className="nav-icon">
                  <i class="fas fa-file-alt"></i>
                </span>
                <span className="menu-text">Ordre De Mission</span>
              </Link>
            </li>

            <li className={active('/nouvelle-mission')}>
              <Link to="/nouvelle-mission">
                <span className="nav-icon">
                  <i className="fas fa-plus-square"></i>
                </span>
                <span className="menu-text">Nouvelle Mission</span>
              </Link>
            </li>
            {(this.state.type_agent === 'dg' || this.state.type_agent === 'sg') && (
              <span>
                <li className={active('/valider-missions')}>
                  <Link to="/valider-missions">
                    <span className="nav-icon">
                      <i class="fas fa-check-circle"></i>
                    </span>
                    <span className="menu-text">Signature et Validation</span>
                  </Link>
                </li>
              </span>
            )}
            {(this.state.type_agent === 'dg') && (
              <span>

                <li className={active('#')}>
                  <Link to="#">
                    <span className="nav-icon">
                      <i class="fas fa-comment-dots"></i>
                    </span>
                    <span className="menu-text">Avis Du Secrétaire Général</span>
                  </Link>
                </li>
              </span>
            )}
            {(this.state.type_agent === 'agent') && (
              <li className={active('/avis-responsable')}>
                <Link to="/avis-responsable">
                  <span className="nav-icon">
                    <i className="fas fa-comment-dots"></i>
                  </span>
                  <span className="menu-text">Avis Du Responsable</span>
                </Link>
              </li>
            )}

            <li className={active('/numerotation')}>
              <Link to="/numerotation">
                <span className="nav-icon">
                  <i className="fas fa-list-ol"></i>
                </span>
                <span className="menu-text">Numerotation</span>
              </Link>
            </li>

            {(this.state.type_agent === 'sg') && (
              <li className="#">
                <Link to="/numerotation">
                  <span className="nav-icon">
                    <i className="fas fa-list-ol"></i>
                  </span>
                  <span className="menu-text">Numerotation</span>
                </Link>
              </li>
            )}
            <li className="#">
              <Link to="#">
                <span className="nav-icon">
                  <i className="fas fa-dollar-sign"></i>
                </span>
                <span className="menu-text">Accord pour Paiement</span>
              </Link>
            </li>
            <li className="#">
              <Link to="#">
                <span className="nav-icon">
                  <i className="fas fa-dollar-sign"></i>
                </span>
                <span className="menu-text">Etats de Paiement</span>
              </Link>
            </li>
            <li className="#">
              <Link to="#">
                <span className="nav-icon">
                  <i className="fas fa-tag"></i>
                </span>
                <span className="menu-text">Visa des Pieces</span>
              </Link>
            </li>
          </ul>
        </div>
      </aside >
    );
  }


}
export default Aside;
