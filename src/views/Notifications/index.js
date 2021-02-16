import React from 'react';
import Spinner from '../../components/Spinner';
import EmptyMissions from '../../components/Empty/big';
import AsideMissions from '../../components/Aside/missions';
import moment from 'moment';

class Notifications extends React.Component {
  constructor() {
    super();
    this.state = {
      notifs: [],
      loading: true,
      error: null,
    }
  }

  async componentWillMount() {
    moment().locale('fr');
    // console.log('this.props.', this.props);
    if (this.props.authUser) {
      const notifs = await this.props.getUsernotifs(this.props.authUser.IdUtilisateur);
      console.log('notifs', notifs);
      this.setState({ notifs, loading: false });
    }
  }


  render() {
    return (
      <div>
        <AsideMissions />
        {
          this.state.loading && <Spinner />
        }
        {
          !this.state.loading &&
          (<div>

            <div className="contents text-black">
              <div className="container-fluid">
                <div className="row">
                  <div className="col-lg-12 card mb-4">
                    <div className="col-lg-12">
                      <div className="card card-default card-md mb-4">
                        <div className="card-header  py-20">
                          <h6> Notifications</h6>
                        </div>
                        <div className="card-body py-20 pl-sm-35 pl-30 pr-sm-50 pr-30">
                          <div className="timeline-box--3 timeline-vertical left-middle basic-timeline">
                            <ul className="timeline">
                              {this.state.notifs.length && this.state.notifs.map(notification => (
                                <li className="timeline-inverted">
                                  <div className="timeline-single__buble">
                                    <div className="timeline-single__buble--svg  bg-info">
                                      <i class="fas fa-bell"></i>
                                    </div>
                                  </div>
                                  <div className="timeline-single">
                                    <div className="timeline-single__days">
                                      <span>{notification.titre}</span>
                                    </div>
                                    <div className="timeline-single__content">
                                      <p>{notification.message}
                                      </p>
                                      <span>{moment(notification.created_at).format('DD MMMM YYYY hh:mm:ss')}</span>
                                    </div>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>


                  </div>
                </div>
              </div>
            </div>
          </div>)
        }
      </div>
    );
  }
}

export default Notifications;