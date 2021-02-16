import React from 'react';
import { Link } from 'react-router-dom';
import AsideMissions from '../../components/Aside/missions';
import moment from 'moment';
import Spinner from '../../components/Spinner';
import Alert from '../../components/Empty/alert';

class Avis extends React.Component {
  constructor() {
    super();
    this.state = {
      user_id: null,
      mission: [],
      missions: [],
      selectMission: null,
      loading: true,
      error: null,
      MotifRejet: '',
      IdMission: null,
    }
  }
  async componentWillMount() {
    if (this.props.authUser) {
      const user_id = this.props.authUser.IdUtilisateur;
      const type_agent = this.props.type_agent;
      this.setState({
        user_id,
      })
      this.props.getMissionAvis(user_id).then((missions) => {
        console.log('missions', missions);
        this.setState({ loading: false, missions });
        this.props.setMissions(missions);
      });
    }
  }
  selectMission = (event) => {
    console.log('event', event);
    let selectMission = {
      RefMission: [event.RefMission],
      IdMission: [event.IdMission],
      ObjetMission: [event.ObjetMission],
      DateDepartMission: [event.DateDepartMission],
      DateRetourMission: [event.DateRetourMission],
      CodeDirection: [event.direction.CodeDirection],
      MotifRejet: [event.MotifRejet],
      AccorderRejeter: [event.AccorderRejeter],
      status: [event.status],
    }

    this.setState({
      selectMission
    })

  }


  renderStatus(status) {
    if (status == "approuverParDirecteur") {
      return <span className="bg-opacity-success  color-success rounded-pill userDatatable-content-status active">Approuver par le Directeur Général</span>;
    } else if (status == "approuverParSG") {
      return <span className="bg-opacity-info  color-info rounded-pill userDatatable-content-status active">Approuver par le Secrétaire Général</span>;
    } else if (status == "rejetterParDirecteur") {
      return <span className="bg-opacity-warning  color-warning rounded-pill userDatatable-content-status active">Rejetter Par le Directeur Général</span>;
    } else if (status == "rejetterParSG") {
      return <span className="bg-opacity-warning  color-warning rounded-pill userDatatable-content-status active">Rejetter Par le Secrétaire Général </span>;
    }
  }

  getNumberOfDays(depart, retour) {
    var start = moment(depart, "YYYY-MM-DD");
    var end = moment(retour, "YYYY-MM-DD");
    return (moment.duration(end.diff(start)).asDays()) + 1;
  }
  formatDate(date) {
    return moment(date).format("DD/MM/YYYY");
  }
  render() {
    return (
      <div>
        <AsideMissions />
        {
          this.state.loading && <Spinner />
        }

        {
          (!this.state.loading) && <div>

            <div className="contents">
              <div className="atbd-page-content">
                <div className="container-fluid">
                  <div className="mailbox-wrapper">
                    <div className="row">
                      <div className="col-lg-12">
                        <div className="breadcrumb-main">
                          <h4 className="text-capitalize breadcrumb-title">Validation de Mission</h4>
                        </div>
                      </div>
                      <div className="col-lg-4">
                        <div className="">
                          <div className="left-sidebar chat_sidebar">
                            <div id="chat" className="box1 bg-white active">
                              <div className="chat-wrapper py-25">
                                <div className="search-tab">
                                  <ul className="nav ap-tab-main border-bottom text-capitalize" id="ueberTab" role="tablist">
                                    <li className="nav-item mr-0">
                                      <a className="col-md-12 nav-link active" id="first-tab" data-target="#panel_b_first" data-secondary="#panel_a_first" data-toggle="tab" href="#first" role="tab" aria-controls="first-tab" aria-selected="true">
                                        Référence Missions</a>
                                    </li>
                                  </ul>
                                </div>
                                <div className="search-body">
                                  <div className="tab-content" id="ueberTabA">
                                    <div className="tab-pane fade show active" id="panel_a_first" role="tabpanel" aria-labelledby="first-tab">
                                      <ul className="user-list">
                                        {this.state.missions.length ? this.state.missions.map(mission => {
                                          return (
                                            <li onClick={() => this.selectMission(mission)} className="user-list-item">
                                              <div className="user-list-item__wrapper">
                                                <div className="users-list-body">
                                                  <div className="users-list-body-title">
                                                    <h6>{mission.RefMission}</h6>
                                                  </div>
                                                </div>
                                              </div>
                                            </li>
                                          )
                                        }) : <Alert message="Aucune mission a valider" type="info" />}
                                      </ul>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-8 mb-30">
                        <div className="mailbox-container">
                          <div className="mailbox-list">
                            <div className="card box1">
                              <div className="card-body">
                                <div className="col-md-12 chat-body bg-white radius-xl">
                                  <div className="chat-header">
                                    <div className="media chat-name align-items-center">
                                      <div className="media-body align-self-center ">
                                        {!(this.state.selectMission) ?
                                          <div className="#">
                                            <h5 className=" mb-0 fw-500 mb-2">Avis Du Responsable</h5>
                                          </div>
                                          : <div className="#">
                                            <h5 className=" mb-0 fw-500 mb-2">Avis Du Responsable</h5>
                                            <div className="media-body__content d-flex align-items-center">
                                              <small className="d-flex color-light fs-12">
                                                Ref: {this.state.selectMission.RefMission}
                                              </small>
                                            </div>
                                          </div>}
                                      </div>
                                    </div>
                                  </div>

                                  <div className="edit-profile">
                                    <div className="card">
                                      <div className="card-body">
                                        <div className="row justify-content-center">
                                          <div className="col-xl-12">
                                            <div className="edit-profile__body mx-lg-20">
                                              {
                                                this.state.selectMission ?
                                                  <div className="row">
                                                    <div className="user-group radius-xl bg-white media-ui media-ui--onHold pt-30 pb-25">
                                                      <div className="border-bottom px-30">
                                                        <div className="row media user-group-media d-flex justify-content-between">
                                                          <div className="col-md-12 mb-25 media-body d-flex align-items-center flex-wrap text-capitalize my-sm-0 my-n2">
                                                            <a href="#">
                                                              <h6 className="mt-0  fw-500 user-group media-ui__title">Status</h6>
                                                            </a>
                                                            <div class="about-projects">
                                                              <div class="about-projects__details">
                                                                <p class="fs-15 mb-25 mt-25">
                                                                  {this.renderStatus(this.state.selectMission.status)}
                                                                </p>
                                                              </div>
                                                            </div>
                                                          </div>
                                                          <div className="col-md-12 mb-25 media-body d-flex align-items-center flex-wrap text-capitalize my-sm-0 my-n2">
                                                            <a href="#">
                                                              <h6 className="mt-0  fw-500 user-group media-ui__title">Motif</h6>
                                                            </a>
                                                            <div class="about-projects">
                                                              <div class="about-projects__details">
                                                                <p class="fs-15 mb-25 mt-25">
                                                                  {this.state.selectMission.MotifRejet}
                                                                </p>
                                                              </div>
                                                            </div>
                                                          </div>
                                                        </div>
                                                        <div className="user-group-people mt-15 text-capitalize">


                                                          {/* <div className="user-group-project">
                                                            <div className="d-flex align-items-center user-group-progress-top">
                                                              <div className="media-ui__start">
                                                                <span className="color-light fs-12">Date de Depart</span>
                                                                <p className="fs-14 fw-500 color-dark mb-0">{this.formatDate(this.state.selectMission.DateDepartMission)}</p>
                                                              </div>
                                                              <div className="media-ui__end">
                                                                <span className="color-light fs-12">Date de Retour </span>
                                                                <p className="fs-16 fw-500 color-success mb-0">{this.formatDate(this.state.selectMission.DateRetourMission)}</p>
                                                              </div>
                                                              <div className="media-ui__start ml-5">
                                                                <span className="color-light fs-12">Nombre de jours</span>
                                                                <p className="fs-16 fw-500 color-success mb-0 text-danger">{this.getNumberOfDays(this.state.selectMission.DateDepartMission, this.state.selectMission.DateRetourMission)} jours</p>
                                                              </div>
                                                            </div>
                                                          </div> */}
                                                        </div>
                                                      </div>
                                                    </div>
                                                  </div>
                                                  : ''
                                              }
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        }
      </div >
    );
  }
}

export default Avis;