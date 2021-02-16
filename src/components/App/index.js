import React from 'react';
import { Route, Redirect, Switch, useLocation } from 'react-router-dom';

//Components
import Auth from '../Auth';
import NavBar from '../Navigation';
import Footer from '../Footer';
import RedirectIfAuth from '../RedirectIfAuth';

//Views
import LoginPage from '../../views/auth/Login';
import SectionsPage from '../../views/Sections';
import MissionIndexPage from '../../views/Missions/index';
import MissionCreatePage from '../../views/Missions/create';
import MissionUserAll from '../../views/Missions/all';
import Dashboard from '../../views/Missions/dashboard';
import ViewMission from '../../views/Missions/view';
import EtatMission from '../../views/Missions/etat';
import ValiderMission from '../../views/Missions/valider';
import NumeroterMission from '../../views/Missions/numeroter';
import Notifications from '../../views/Notifications/index';
import Avis from '../../views/Missions/avis';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      authUser: null,
      IdMission: null,
      type_agent: null,
      missions: [],
      userNotifs: [],
    };
  }


  componentWillMount() {
    const user = localStorage.getItem('user');
    const type_agent = localStorage.getItem('type_agent');
    if (user) {
      this.setState({
        authUser: JSON.parse(user),
      });
    }
    if (type_agent) {
      this.setState({
        type_agent: JSON.parse(type_agent),
      });
    }
  }

  setAuthUser = (authUser) => {
    let type_agent = '';
    const droits = authUser.droit;
    if (droits.DroitTableSignature) {
      type_agent = "dg"
    } else {
      type_agent = "agent"
    }
    this.setState({
      authUser,
      type_agent
    }, () => {
      localStorage.setItem('user', JSON.stringify(authUser));
      localStorage.setItem('type_agent', JSON.stringify(type_agent));
      this.props.history.push('/sections');
    });
  }

  setMissionId = (IdMission) => {
    this.setState({
      IdMission,
    }, () => {
      localStorage.setItem('IdMission', JSON.stringify(IdMission));
      this.props.history.push('/details-de-la-mission');
    });
  }

  editMission = (IdMission) => {
    this.setState({
      IdMission,
    }, () => {
      localStorage.setItem('IdMission', JSON.stringify(IdMission));
      this.props.history.push('/modifier-la-mission');
    });
  }

  setMissions = (missions) => {
    this.setState({
      missions
    });
  }

  setUserNotifs = (userNotifs) => {
    this.setState({
      userNotifs
    });
  }

  removeMissionId = () => {
    localStorage.removeItem('IdMission');
    this.setState({ IdMission: null });
  }

  removeAuthUser = async () => {
    const response = await this.props.authService.logout({
      IdUtilisateur: this.state.authUser
    });
    if (response === 'Success') {

      localStorage.removeItem('user');
      this.setState({ authUser: null });
      this.props.history.push('/se-connecter');

    }
    // localStorage.removeItem('user');
    // this.setState({ authUser: null });
    // this.props.history.push('/se-connecter');
  }

  render() {
    const { location } = this.props;
    return (
      <Switch>
        <div className="layout-light side-menu">
          {
            location.pathname !== '/se-connecter' &&
            <NavBar
              authUser={this.state.authUser}
              removeAuthUser={this.removeAuthUser}
              type_agent={this.state.type_agent}
              getUsernotifs={this.props.missionsService.getUsernotifications}
            />
          }

          <Auth
            path="/accueil"
            component={SectionsPage}
            props={{
              token: this.state.authUser ? this.state.authUser.token : null,
            }}
            isAuthenticated={this.state.authUser !== null}
          />

          <RedirectIfAuth
            path="/se-connecter"
            component={LoginPage}
            props={{
              setAuthUser: this.setAuthUser,
              loginUser: this.props.authService.login,
            }}
            isAuthenticated={this.state.authUser !== null}
          />
          <Auth
            path="/sections"
            component={SectionsPage}
            props={{
              authUser: this.state.authUser,
              token: this.state.authUser ? this.state.authUser.token : null,
            }}
            isAuthenticated={this.state.authUser !== null}
          />

          <Auth
            path="/tableau-de-bord"
            component={Dashboard}
            props={{
              authUser: this.state.authUser,
              type_agent: this.state.type_agent,
              setMissions: this.setMissions,
              setMissionId: this.setMissionId,
              getUserMissions: this.props.missionsService.getUserMissions,
              token: this.state.authUser ? this.state.authUser.token : null,
              getMissionSoumiseByDG: this.props.missionsService.getMissionSoumiseByDG,
              getMissionCreatedByDG: this.props.missionsService.getMissionCreatedByDG,
              getMissionSoumiseByUser: this.props.missionsService.getMissionSoumiseByUser,
              getUsernotifs: this.props.missionsService.getUsernotifications,
            }}
            isAuthenticated={this.state.authUser !== null}
          />

          <Auth
            path="/notifications"
            component={Notifications}
            props={{
              authUser: this.state.authUser,
              type_agent: this.state.type_agent,
              getUsernotifs: this.props.missionsService.getUsernotifications,
            }}
            isAuthenticated={this.state.authUser !== null}
          />

          <Auth
            path="/nouvelle-mission"
            component={MissionCreatePage}
            props={{
              token: this.state.authUser ? this.state.authUser.token : null,
              authUser: this.state.authUser,
              getAgentById: this.props.missionsService.getAgentById,
              getUserObjects: this.props.missionsService.getUserObjects,
              getTransports: this.props.missionsService.getTransports,
              getRegions: this.props.missionsService.getRegions,
              getAllAgents: this.props.missionsService.getAllAgents,
              getRubriques: this.props.missionsService.getRubriques,
              notyService: this.props.notyService,
              getFinancements: this.props.missionsService.getFinancements,
              createMission: this.props.missionsService.createMission,
              getUsernotis: this.props.missionsService.getUsernotifications,
              createRubrique: this.props.missionsService.createRubrique,
              getAgentsByDirections: this.props.missionsService.getAgentsByDirections,
              type_agent: this.state.type_agent,
            }}
            isAuthenticated={this.state.authUser !== null}
          />

          <Auth
            path="/avis-responsable"
            component={Avis}
            props={{
              token: this.state.authUser ? this.state.authUser.token : null,
              getMissionById: this.props.missionsService.getMissionById,
              authUser: this.state.authUser,
              IdMission: this.state.IdMission,
              missions: this.state.missions,
              getMissionAvis: this.props.missionsService.getMissionAvis,
              editMission: this.editMission,
              annulerMission: this.props.missionsService.annulerMission,
              submitMission: this.props.missionsService.submitMission,
              type_agent: this.state.type_agent,
              notyService: this.props.notyService,
              setMissions: this.setMissions,
              rejetterMission: this.props.missionsService.rejetterMission,
              approuverMission: this.props.missionsService.approuverMission,
              getMissionForSG: this.props.missionsService.getMissionForSG,
            }}
            isAuthenticated={this.state.authUser !== null}
          />

          <Auth
            path="/details-de-la-mission"
            component={ViewMission}
            props={{
              token: this.state.authUser ? this.state.authUser.token : null,
              getMissionById: this.props.missionsService.getMissionById,
              authUser: this.state.authUser,
              IdMission: this.state.IdMission,
              missions: this.state.missions,
              editMission: this.editMission,
              annulerMission: this.props.missionsService.annulerMission,
              submitMission: this.props.missionsService.submitMission,
              type_agent: this.state.type_agent,
            }}
            isAuthenticated={this.state.authUser !== null}
          />

          <Auth
            path="/etat-de-mission"
            component={EtatMission}
            props={{
              token: this.state.authUser ? this.state.authUser.token : null,
              getMissionById: this.props.missionsService.getMissionById,
              authUser: this.state.authUser,
              notyService: this.props.notyService,
              IdMission: this.state.IdMission,
              missions: this.state.missions,
              setMissionId: this.setMissionId,
              removeMissionId: this.removeMissionId,
              setMissions: this.setMissions,
            }}
            isAuthenticated={this.state.authUser !== null}
          />

          <Auth
            path="/valider-missions"
            component={ValiderMission}
            props={{
              token: this.state.authUser ? this.state.authUser.token : null,
              getMissionById: this.props.missionsService.getMissionById,
              authUser: this.state.authUser,
              notyService: this.props.notyService,
              IdMission: this.state.IdMission,
              setMissions: this.setMissions,
              missions: this.state.missions,
              rejetterMission: this.props.missionsService.rejetterMission,
              approuverMission: this.props.missionsService.approuverMission,
              type_agent: this.state.type_agent,
              getMissionForSG: this.props.missionsService.getMissionForSG,
              getMissionForDG: this.props.missionsService.getMissionForDG,
            }}
            isAuthenticated={this.state.authUser !== null}
          />

          <Auth
            path="/toutes-mes-missions"
            component={MissionUserAll}
            props={{
              token: this.state.authUser ? this.state.authUser.token : null,
              getUserMissions: this.props.missionsService.getUserMissions,
              authUser: this.state.authUser,
              setMissionId: this.setMissionId,
              removeMissionId: this.removeMissionId,
              setMissions: this.setMissions,
              editMission: this.editMission,
              annulerMission: this.props.missionsService.annulerMission,
              submitMission: this.props.missionsService.submitMission,
              type_agent: this.state.type_agent,
              rejetterMission: this.props.missionsService.rejetterMission,
              approuverMission: this.props.missionsService.approuverMission,
              getMissionForSG: this.props.missionsService.getMissionForSG,
              getMissionForDG: this.props.missionsService.getMissionForDG,
              getMissionSoumiseByDG: this.props.missionsService.getMissionSoumiseByDG,
              getMissionCreatedByDG: this.props.missionsService.getMissionCreatedByDG,
              getMissionSoumiseByUser: this.props.missionsService.getMissionSoumiseByUser,
              getUserAllMissions: this.props.missionsService.getUserAllMissions,
            }}
            isAuthenticated={this.state.authUser !== null}
          />


          <Auth
            path="/numerotation"
            component={NumeroterMission}
            props={{
              token: this.state.authUser ? this.state.authUser.token : null,
              getUserMissions: this.props.missionsService.getUserMissions,
              numeroter: this.props.missionsService.numeroterMission,
              getMissionsNumeroter: this.props.missionsService.getMissionsNumeroter,
              authUser: this.state.authUser,
              type_agent: this.state.type_agent,
              setMissions: this.setMissions,
            }}
            isAuthenticated={this.state.authUser !== null}
          />


          <Auth
            path="/missions"
            component={MissionIndexPage}
            props={{
              token: this.state.authUser ? this.state.authUser.token : null,
              getUserMissions: this.props.missionsService.getUserMissions,
              authUser: this.state.authUser,
              setMissionId: this.setMissionId,
              removeMissionId: this.removeMissionId,
              setMissions: this.setMissions,
              editMission: this.editMission,
              annulerMission: this.props.missionsService.annulerMission,
              submitMission: this.props.missionsService.submitMission,
              type_agent: this.state.type_agent,
              rejetterMission: this.props.missionsService.rejetterMission,
              approuverMission: this.props.missionsService.approuverMission,
              getMissionForSG: this.props.missionsService.getMissionForSG,
              getMissionForDG: this.props.missionsService.getMissionForDG,
              getMissionSoumiseByDG: this.props.missionsService.getMissionSoumiseByDG,
              getMissionCreatedByDG: this.props.missionsService.getMissionCreatedByDG,
              getMissionSoumiseByUser: this.props.missionsService.getMissionSoumiseByUser,

            }}
            isAuthenticated={this.state.authUser !== null}
          />

          {
            location.pathname !== '/se-connecter' &&
            <Footer />
          }
        </div>
      </Switch>
    );
  }
}

export default App;