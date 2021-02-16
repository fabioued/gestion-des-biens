import React from 'react';
import { Link } from 'react-router-dom';
import AsideMissions from '../../components/Aside/missions';
import MissionsAll from '../../components/Missions/all';
import Spinner from '../../components/Spinner';
import EmptyMissions from '../../components/Empty/notice';


class Index extends React.Component {
  constructor() {
    super();
    this.state = {
      missions: [],
      loading: true
    }
  }
  componentWillMount() {
    if (this.props.authUser) {
      const user = this.props.authUser;
      const type_agent = this.props.type_agent;

      this.props.getUserAllMissions(user.IdUtilisateur).then((missions) => {
        this.setState({
          loading: false,
          missions
        });
        this.props.setMissions(missions);
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
                        <h4 className="text-capitalize breadcrumb-title">Ordre de Missions</h4>
                        <div className="breadcrumb-action justify-content-center flex-wrap">
                          {/* <div className="dropdown action-btn">
                            <button className="btn btn-sm btn-info text-white">
                              <i className="la la-calendar text-white" /> Calendrier
                            </button>
                          </div> */}
                          <div className="action-btn">
                            <Link to="/nouvelle-mission" className="btn btn-sm btn-primary btn-add">
                              <i className="la la-plus" /> Nouveau
                          </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="container-fluid">
                <div className="row">
                  <div className="col-lg-12">

                    {
                      this.state.missions.length ?
                        <MissionsAll
                          removeMissionId={this.props.removeMissionId}
                          setMissionId={this.props.setMissionId}
                          missions={this.state.missions}
                          authUser={this.props.authUser}
                          editMission={this.props.editMission}
                          submitMission={this.props.submitMission}
                          annulerMission={this.props.annulerMission}
                          getMissionForDG={this.props.getMissionForDG}
                          getMissionSoumiseByDG={this.props.getMissionSoumiseByDG}
                          getMissionCreatedByDG={this.props.getMissionCreatedByDG}
                          getMissionSoumiseByUser={this.props.getMissionSoumiseByUser}
                          history={this.props.history}
                        /> :
                        <div className="col-md-12 offset-md-1 mt-5"><EmptyMissions className="box" type="light" title="Aucune Mission Trouvée !" icon="fas fa-inbox text-white" message="Vous n'avez pas de missions. Veuillez Saisir une mission pour commencer" /> </div>
                    }
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

export default Index;