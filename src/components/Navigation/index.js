import React from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';

class NavBar extends React.Component {

  constructor() {
    super();
    this.state = {
      notifs: []
    }
  }

  async componentWillMount() {
    if (this.props.authUser) {
      const notifs = await this.props.getUsernotifs(this.props.authUser.IdUtilisateur);
      this.setState({ notifs });
    }
  }
  render() {
    const avatar = {
      border: '2px solid #ffff'
    };

    const authUser = this.props.authUser;
    const removeAuthUser = this.props.removeAuthUser;

    return (
      <header className="header-top" style={{ backgroundColor: 'green' }}>
        <nav className="navbar navbar-light">
          <div className="navbar-left">
            <Link to="/accueil" className="navbar-brand text-white" >
              Gestion Des Biens
          </Link>
          </div>
          <div className="navbar-right">
            <ul className="navbar-right__menu">
              {
                this.state.notifs.length &&
                <li className="nav-notification">
                  <div className="dropdown-custom">
                    <Link className="nav-item-toggle">
                      <span className="nav-icon">
                        <i className="fas fa-bell"></i>
                      </span>
                    </Link>
                    <div className="dropdown-wrapper">
                      <h2 className="dropdown-wrapper__title">Notifications <span className="badge-circle badge-warning ml-1">{this.state.notifs.length}</span></h2>
                      <ul>
                        {
                          this.state.notifs && this.state.notifs.splice(0, 5).map(notification =>
                            <li className="nav-notification__single nav-notification__single--unread d-flex flex-wrap">
                              <div className="nav-notification__type nav-notification__type--success">
                                <i className="fa fa-exclamation-circle" aria-hidden="true"></i>
                              </div>
                              <div className="nav-notification__details">
                                <Link to="" className="subject stretched-link text-truncate" style={{ maxWidth: '180px' }}>{notification.titre}</Link>
                                <p>
                                  <span>{notification.message}</span>
                                </p>
                                <p>
                                  <span className="time-posted">{moment(notification.created_at).format("D-m-y")}</span>
                                </p>
                              </div>
                            </li>
                          )
                        }
                      </ul>
                      <Link to="/notifications" className="dropdown-wrapper__more">Toutes les Notifications</Link>
                    </div>
                  </div>
                </li>
              }

              <li className="nav-author">
                <div className="dropdown-custom">
                  <Link className="nav-item-toggle">
                    <img src="https://res.cloudinary.com/yanfomaweb/image/upload/v1537299818/afrikeveil/avatar.png" alt="" className="rounded-circle" style={avatar} />
                  </Link>
                  <div className="dropdown-wrapper">
                    <div className="nav-author__info">
                      <div className="author-img">
                        <img src="https://res.cloudinary.com/yanfomaweb/image/upload/v1537299818/afrikeveil/avatar.png" alt="" className="rounded-circle" />
                      </div>
                      <div>
                        <h6>{authUser && authUser.Nom_Utilisateur} </h6>
                      </div>
                    </div>
                    <div className="nav-author__options">
                      <ul>
                        <li>
                          <Link to="#">
                            <span className="nav-icon">
                              <i className="fas fa-user m-1"></i>
                            </span>
                        Mon Compte
                        </Link>
                        </li>
                        <li>
                          <Link to="#">
                            <span className="nav-icon">
                              <i className="fas fa-lock m-1"></i>
                            </span>
                        Changer de Mot de Passe
                        </Link>
                        </li>

                      </ul>
                      <Link onClick={removeAuthUser} className="nav-author__signout">
                        <span className="nav-icon">
                          <i className="fas fa-sign-out-alt m-1"></i>
                        </span>
                       Deconnection
                    </Link>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
            <div className="navbar-right__mobileAction d-md-none">
              <Link to="#" className="btn-search">
                <span data-feather="search"></span>
                <span data-feather="x"></span></Link>
              <Link to="#" className="btn-author-action">
                <span data-feather="more-vertical"></span></Link>
            </div>
          </div>
        </nav>
      </header >
    );
  }
}
export default NavBar;
