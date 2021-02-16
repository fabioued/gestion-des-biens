import React from 'react';
import AsideMissions from '../../components/Aside/missions';
import Spinner from '../../components/Spinner';
import EmptyMissions from '../../components/Empty/notice';

class Dashboard extends React.Component {
  constructor() {
    super();
    this.state = {
      missions: [],
      missionsCrees: [],
      missionsSoumises: [],
      loading: true
    }
  }
  async componentWillMount() {
    if (this.props.authUser) {
      const user = this.props.authUser;
      const type_agent = this.props.type_agent;
      //alert(type_agent);
      if (type_agent == 'agent') {
        await this.props.getUserMissions(user.IdUtilisateur).then((missionsCrees) => {
          this.setState({
            missionsCrees
          })
        });
        await this.props.getMissionSoumiseByUser(user.IdUtilisateur).then((missionsSoumises) => {
          this.setState({
            missionsSoumises
          })
        })
      } else if (type_agent == 'dg') {
        await this.props.getMissionCreatedByDG(user.IdUtilisateur).then((missionsCrees) => {
          this.setState({
            missionsCrees
          })
        });
        await this.props.getMissionSoumiseByDG(user.IdUtilisateur).then((missionsSoumises) => {
          this.setState({
            missionsSoumises
          })
        })
      }

      this.setState({
        loading: false
      })
    }
  }
  render() {
    return (
      <div>
        <AsideMissions />
        {
          this.state.loading && <Spinner />
        }
        { !this.state.loading &&
          <div>

            <div className="contents">
              <div className="container-fluid">
                <div className="row">
                  <div className="col-lg-12">
                    <div className="shop-breadcrumb">
                      <div className="breadcrumb-main">
                        <h4 className="text-capitalize breadcrumb-title">Bref Apercu</h4>

                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="container-fluid">
                <div className="row">
                  <div className="col-xl-6 col-lg-6 col-md-6 mb-25">
                    <div className="feature-cards5 d-flex justify-content-between border-0 radius-xl bg-white p-25">
                      <div className="application-task d-flex align-items-center">
                        <div className="application-task-icon wh-60 bg-info content-center">
                          <img className="svg" src="../img/svg/feature-cards12.svg" alt="" />
                        </div>
                        <div className="application-task-content">
                          <h4>{this.state.missionsCrees.length}</h4>
                          <span className="text-light fs-14 mt-1 text-capitalize">En Attente de soumission</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-6 col-lg-6 col-md-6 mb-25">
                    <div className="feature-cards5 d-flex justify-content-between border-0 radius-xl bg-white p-25">
                      <div className="application-task d-flex align-items-center">
                        <div className="application-task-icon wh-60 bg-warning content-center">
                          <img className="svg" src="../img/svg/feature-cards10.svg" alt="" />
                        </div>
                        <div className="application-task-content">
                          <h4>{this.state.missionsSoumises.length}</h4>
                          <span className="text-light fs-14 mt-1 text-capitalize">Soumises:En Cours de Validation</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* <div className="col-xl-6 col-lg-6 col-md-6 mb-25">
                    <div className="feature-cards5 d-flex justify-content-between border-0 radius-xl bg-white p-25">
                      <div className="application-task d-flex align-items-center">
                        <div className="application-task-icon wh-60 bg-success content-center">
                          <img className="svg" src="../img/svg/feature-cards9.svg" alt="" />
                        </div>
                        <div className="application-task-content">
                          <h4>{this.state.missionsCrees.length}</h4>
                          <span className="text-light fs-14 mt-1 text-capitalize">Validées par le DG</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-6 col-lg-6 col-md-6 mb-25">
                    <div className="feature-cards5 d-flex justify-content-between border-0 radius-xl bg-white p-25">
                      <div className="application-task d-flex align-items-center">
                        <div className="application-task-icon wh-60 bg-danger content-center">
                          <img className="svg" src="../img/svg/feature-lock.svg" alt="" />
                        </div>
                        <div className="application-task-content">
                          <h4>{this.state.missionsCrees.length}</h4>
                          <span className="text-light fs-14 mt-1 text-capitalize">Rejetées par le DG</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-6 col-lg-6 col-md-6 mb-25">
                    <div className="feature-cards5 d-flex justify-content-between border-0 radius-xl bg-white p-25">
                      <div className="application-task d-flex align-items-center">
                        <div className="application-task-icon wh-60 bg-success content-center">
                          <img className="svg" src="../img/svg/feature-cards9.svg" alt="" />
                        </div>
                        <div className="application-task-content">
                          <h4>{this.state.missionsCrees.length}</h4>
                          <span className="text-light fs-14 mt-1 text-capitalize">Validées par le SG</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-6 col-lg-6 col-md-6 mb-25">
                    <div className="feature-cards5 d-flex justify-content-between border-0 radius-xl bg-white p-25">
                      <div className="application-task d-flex align-items-center">
                        <div className="application-task-icon wh-60 bg-danger content-center">
                          <img className="svg" src="../img/svg/feature-lock.svg" alt="" />
                        </div>
                        <div className="application-task-content">
                          <h4>{this.state.missionsCrees.length}</h4>
                          <span className="text-light fs-14 mt-1 text-capitalize">Rejetées par le SG</span>
                        </div>
                      </div>
                    </div>
                  </div> */}
                </div>
                <div className="row ">
                  <div className="col-lg-12 row">
                    <div className="col-lg-5">
                      <div className="kanban-board__card box1 mb-50">
                        <section className="lists-container kanban-container ">
                          <div className="list kanban-list draggable bg-info">
                            <div className="kanban-tops list-tops">
                              <div className="d-flex justify-content-between align-items-center py-10">
                                <h3 className="list-title text-white">En Attente De Soumission</h3>
                              </div>
                            </div>
                            <ul className="kanban-items list-items  drag-drop ">
                              {this.state.missionsCrees.length ? this.state.missionsCrees.map(mission =>
                                <li onClick={() => { this.props.setMissionId(mission.IdMission) }} className="d-flex justify-content-between align-items-center ">
                                  <div className="lists-items-title" data-toggle="modal" data-target="#exampleModal" data-whatever="@mdo72">
                                    {mission.RefMission}
                                  </div>
                                </li>) :
                                <li className="d-flex justify-content-between align-items-center ">
                                  <div className="lists-items-title" data-toggle="modal" data-target="#exampleModal" data-whatever="@mdo72">
                                    Aucune Mission
                              </div>
                                </li>
                              }

                            </ul>
                          </div>
                        </section>
                      </div>
                    </div>
                    <div className="col-lg-5">
                      <div className="kanban-board__card box1 mb-50">
                        <section className="lists-container kanban-container ">
                          <div className="list kanban-list draggable bg-warning">
                            <div className="kanban-tops list-tops">
                              <div className="d-flex justify-content-between align-items-center py-10">
                                <h3 className="list-title text-white">En Cours De Validation</h3>
                              </div>
                            </div>
                            <ul className="kanban-items list-items  drag-drop ">
                              {this.state.missionsSoumises.length ? this.state.missionsSoumises.map(mission =>
                                <li onClick={() => { this.props.setMissionId(mission.IdMission) }} className="d-flex justify-content-between align-items-center ">
                                  <div className="lists-items-title" data-toggle="modal" data-target="#exampleModal" data-whatever="@mdo72">
                                    {mission.RefMission}
                                  </div>
                                </li>) :
                                <li className="d-flex justify-content-between align-items-center ">
                                  <div className="lists-items-title" data-toggle="modal" data-target="#exampleModal" data-whatever="@mdo72">
                                    Aucune Mission
                              </div>
                                </li>
                              }

                            </ul>
                          </div>
                        </section>
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

export default Dashboard;