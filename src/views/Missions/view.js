import React from 'react';
import { Link } from 'react-router-dom';
import AsideMissions from '../../components/Aside/missions';
import { trackPromise } from 'react-promise-tracker';
import Alert from '../../components/Empty/alert';
import moment from 'moment';
import Spinner from '../../components/Spinner';
import EmptyMissions from '../../components/Empty/notice';
import Swal from 'sweetalert2';

class ViewMission extends React.Component {
  constructor() {
    super();
    this.state = {
      mission: [],
      loading: true,
      error: null
    }
  }
  async componentWillMount() {
    if (this.props.authUser) {
      const mission_id = localStorage.getItem('IdMission');
      const mission = this.props.missions.find(mission => mission.IdMission === mission_id);
      // console.log('this.props.missions', this.props.missions);
      // console.log('mission', mission);
      if (mission) {
        // alert('found !')
        this.setState({
          mission,
          loading: false,
        });
      } else {
        this.props.getMissionById(mission_id).then((mission) => {
          this.setState({
            mission,
            loading: false,
          });
        }).catch(error => {
          this.setState({
            mission: [],
            loading: false,
            error: error.response.data.message
          });
        })
      }
    }
  }

  renderStatus(ChefMission, ChauffeurMission) {
    if (ChefMission) {
      return <span className="bg-opacity-success  color-success rounded-pill userDatatable-content-status active">Chef de Mission</span>;
    } else if (ChauffeurMission) {
      return <span className="bg-opacity-info  color-info rounded-pill userDatatable-content-status active">Chauffeur</span>;
    } else {
      return <span className="bg-opacity-warning  color-warning rounded-pill userDatatable-content-status active">Membre</span>;
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

  soumettreMission = (event) => {
    // console.log('submitMission', this.props);
    let type_agent = '';
    const user_id = this.props.authUser.IdUtilisateur;
    const droits = this.props.authUser.droit;
    if (droits.DroitTableSignature) {
      type_agent = "dg"
    } else {
      type_agent = "agent"
    }

    if (droits.DroitSoummetreMission) {
      Swal.fire({
        title: 'Confirmation',
        text: "Vous êtes sur le point de vouloir soumettre votre mission. Etes-vous sûr de vouloir continuer? ",
        icon: 'warning',
        width: "50%",
        showCancelButton: true,
        confirmButtonColor: '#018c3b',
        cancelButtonColor: 'red',
        confirmButtonText: 'Oui, Soummettre',
        cancelButtonText: 'Annuler',
        showLoaderOnConfirm: true,
        preConfirm: async () => {
          const reponse = await this.props.submitMission(event, user_id, type_agent);
          if (reponse.message === "Success") {
            Swal.fire({
              icon: 'success',
              title: "Soumis avec Succès",
            });
          }
          else {
            Swal.fire({
              icon: 'error',
              title: 'Oops Désolé...',
              text: `${reponse.statusMsg}`,
            });
          }
        },
        allowOutsideClick: () => !Swal.isLoading()
      })
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Oops Désolé...',
        text: 'Vous n\'avez pas le droit de Soummetre une Mission ',
        footer: 'Veuillez contacter l\'administrateur'
      })
    }
  }

  annulerMission = (event) => {
    // console.log('submitMission', this.props);
    let type_agent = '';
    const user_id = this.props.authUser.IdUtilisateur;
    const droits = this.props.authUser.droit;
    if (droits.DroitAnnulation) {
      Swal.fire({
        title: 'Confirmation',
        text: "Vous êtes sur le point de vouloir annuler votre mission. Etes-vous sûr de vouloir continuer? ",
        icon: 'warning',
        width: "50%",
        showCancelButton: true,
        confirmButtonColor: '#018c3b',
        cancelButtonColor: 'red',
        confirmButtonText: 'Oui, je confirme',
        cancelButtonText: 'Annuler',
        showLoaderOnConfirm: true,
        preConfirm: async () => {
          const reponse = await this.props.annulerMission(event);
          if (reponse.message === "Success") {
            Swal.fire({
              icon: 'success',
              title: "Annulé avec Succès",
            });
            this.props.history.push('/missions');
          }
          else {
            Swal.fire({
              icon: 'error',
              title: 'Oops Désolé...',
              text: `${reponse.statusMsg}`,
            });
          }
        },
        allowOutsideClick: () => !Swal.isLoading()
      })
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Oops Désolé...',
        text: 'Vous n\'avez pas le droit d\'annulation de Mission ',
        footer: 'Veuillez contacter l\'administrateur'
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

        {
          (!this.state.loading) && <div>
            <div className="contents">
              {
                !this.state.error ?
                  <div className="container-fluid">
                    <div className="row">
                      <div className="col-lg-12 box1">
                        <div className="breadcrumb-main application-ui mb-30">
                          <div className="breadcrumb-action d-flex">
                            <div className="d-flex align-items-center user-member__title mr-sm-25 mr-0">
                              <h4 className="text-capitalize fw-500 breadcrumb-title">Détails de la Mission</h4>
                            </div>
                          </div>
                          <div className="d-flex  text-capitalize">
                            <Link to="/etat-de-mission" className="breadcrumb-edit border-0  content-center bg-info fs-12 fw-500 ml-10 radius-md text-white"  >
                              <i className="fas fa-eye m-1"> </i> Etat de Mission
                            </Link>
                            <button type="button" onClick={() => { this.soumettreMission(this.state.mission.IdMission) }} className="breadcrumb-edit border-0  content-center bg-primary fs-12 fw-500 ml-10 radius-md text-white">
                              <i className="fas fa-paper-plane m-1"> </i>
                                Soumettre
                            </button>
                            <button type="button" className="breadcrumb-edit border-0  content-center bg-warning fs-12 fw-500 ml-10 radius-md text-white">
                              <i className="fas fa-edit m-1"> </i>
                              Modifier
                            </button>
                            <button type="button" onClick={() => { this.annulerMission(this.state.mission.IdMission) }} className="breadcrumb-remove border-0  content-center bg-danger fs-12 fw-500 ml-10 radius-md text-white">
                              <i className="fas fa-trash m-1"> </i>
                              Annuler
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="projects-tab-content mb-30">
                      <div className="row">
                        <div className="col-xl-4 col-lg-4 mb-25">
                          <div className="progress-box px-25 pt-25 pb-10 bg-primary radius-xl">
                            <div className="d-flex justify-content-between mb-3">
                              <h6 className="text-white fw-500 fs-16 text-capitalize">Mission: {this.state.mission.RefMission}</h6>
                              <span className="progress-percentage text-white fw-500 fs-16 text-capitalize"></span>
                            </div>
                            <div className="progress-wrap d-flex align-items-center mb-15">
                              <div className="progress progress-height">
                                <div className="progress-bar bg-white" role="progressbar" style={{ width: '100%' }} aria-valuenow={64} aria-valuemin={0} aria-valuemax={100} />
                              </div>
                            </div>
                          </div>
                          <div className="card mt-20">
                            <div className="card-body">
                              <div className="application-task d-flex align-items-center mb-1">
                                <div class="row">
                                  <div className="application-task-content col-md-12">
                                    <h4>Vehicule</h4>
                                    <span className="text-light fs-14 mt-1 text-capitalize">{this.state.mission.vehicule ? this.state.mission.vehicule.ImmatriculationVeh : ''}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-xl-8 col-lg-8 mb-25">
                          <div className="card">
                            <div className="card-header py-sm-20 py-3  px-sm-25 px-3 ">
                              <h6>Objet de la Mission</h6>
                            </div>
                            <div className="card-body">
                              <div className="about-projects">
                                <div className="about-projects__details">
                                  <p className="fs-15 mb-25">{this.state.mission.ObjetMission}</p>
                                </div>
                                <ul className="d-flex text-capitalize">
                                  <li>
                                    <span className="color-light fs-13">Date de Depart</span>
                                    <p className="color-dark fs-14 mt-1 mb-0 fw-500">{this.formatDate(this.state.mission.DateDepartMission)}</p>
                                  </li>
                                  <li>
                                    <span className="color-light fs-13">Date de Retour</span>
                                    <p className="color-dark fs-14 mt-1 mb-0 fw-500">{this.formatDate(this.state.mission.DateRetourMission)}</p>
                                  </li>
                                  <li>
                                    <span className="color-light fs-13">Nombre de Jours</span>
                                    <p className="color-danger fs-14 mt-1 mb-0 fw-500">{this.getNumberOfDays(this.state.mission.DateDepartMission, this.state.mission.DateRetourMission)} jours</p>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-xl-12 col-lg-12 mb-25">
                          <div className="card">
                            <div className="card-header py-sm-20 py-3  px-sm-25 px-3 ">
                              <h6>Structure</h6>
                            </div>
                            <div className="card-body">
                              <div className="about-projects">
                                <div className="about-projects__details">
                                  <p className="fs-15 mb-25">{this.state.mission.direction ? `${this.state.mission.direction.LibelleDirection} (${this.state.mission.direction.CodeDirection})` : ''}</p>
                                </div>
                                <ul className="d-flex text-capitalize">
                                  <li>
                                    <span className="color-light fs-18">Direction Technique</span>
                                    <p className="color-dark fs-18 mt-1 mb-0 fw-500">-</p>
                                  </li>
                                  {
                                    this.state.mission.financements && this.state.mission.financements.map(imputation => (
                                      <li>
                                        <span className="color-light fs-13">{imputation.type ? imputation.type.LibelleImputation : ''} </span>
                                        <p className="color-dark fs-14 mt-1 mb-0 fw-500">{imputation.direction ? imputation.direction.CodeDirection : ''}</p>
                                      </li>
                                    ))
                                  }
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-xl-12 mb-25 col-lg-12">
                          <div className="card">
                            <div className="card-header">
                              <h6>Lieu(x) de la Mission</h6>
                            </div>
                            <div className="card-body">
                              <div className="userDatatable global-shadow border bg-white radius-xl">
                                <div className="table-responsive">
                                  <table className="table mb-0 table-borderless table-striped table-hover">
                                    <thead>
                                      <tr className="userDatatable-header">
                                        <th>
                                          <span className="userDatatable-title">Region</span>
                                        </th>
                                        <th>
                                          <span className="userDatatable-title">Province</span>
                                        </th>
                                        <th>
                                          <span className="userDatatable-title">Commune</span>
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {this.state.mission.lieux && this.state.mission.lieux.map(lieu => (
                                        <tr>
                                          <td>
                                            <div className="userDatatable-content">
                                              {lieu.region ? lieu.region.Region : '-'}
                                            </div>
                                          </td>
                                          <td>
                                            <div className="userDatatable-content">
                                              {lieu.province ? lieu.province.Province : '-'}
                                            </div>
                                          </td>
                                          <td>
                                            <div className="userDatatable-content">
                                              {lieu.commune ? lieu.commune.Commune : '-'}
                                            </div>
                                          </td>
                                        </tr>
                                      ))}

                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="col-xl-12 mb-25 col-lg-12">
                          <div className="card">
                            <div className="card-header">
                              <h6>Membres de la Mission</h6>
                            </div>
                            <div className="card-body">
                              <div className="userDatatable global-shadow border bg-white radius-xl">
                                <div className="table-responsive">
                                  <table className="table mb-0 table-borderless table-striped table-hover">
                                    <thead>
                                      <tr className="userDatatable-header">
                                        <th>
                                          <span className="userDatatable-title">Nom et Prenom(s)</span>
                                        </th>
                                        <th>
                                          <span className="userDatatable-title">Matricule</span>
                                        </th>
                                        <th>
                                          <span className="userDatatable-title">Fonction</span>
                                        </th>
                                        <th>
                                          <span className="userDatatable-title">Structure</span>
                                        </th>
                                        <th>
                                          <span className="userDatatable-title">Status</span>
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {this.state.mission.membres && this.state.mission.membres.map(membre => (
                                        <tr>
                                          <td>
                                            <div className="d-flex">
                                              <div className="userDatatable__imgWrapper d-flex align-items-center">
                                                <span class="avatar avatar-info avatar-sm avatar-circle   avatar-transparent ">
                                                  <span class="avatar-letter p-2">{membre.agent.NomAgent.substring(0, 2)}</span>
                                                </span>
                                              </div>
                                              <div className="userDatatable-inline-title">
                                                <h6>{membre.agent.NomAgent} {membre.agent.PrenomAgent}</h6>
                                              </div>
                                            </div>
                                          </td>
                                          <td>
                                            <div className="userDatatable-content">
                                              {membre.agent.MatriculeAgent}
                                            </div>
                                          </td>
                                          <td>
                                            <div className="userDatatable-content">
                                              {membre.agent.fonction ? membre.agent.fonction.LibelleFonction : '-'}
                                            </div>
                                          </td>
                                          <td>
                                            <div className="userDatatable-content">
                                              {membre.agent.direction ? membre.agent.direction.CodeDirection : '-'}
                                            </div>
                                          </td>
                                          <td>
                                            <div className="userDatatable-content d-inline-block">
                                              {this.renderStatus(membre.ChefMission, membre.ChauffeurMission)}
                                            </div>
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-xl-12 mb-25 col-lg-12">
                          <div className="card">
                            <div className="card-header">
                              <h6>Signataires</h6>
                            </div>
                            <div className="card-body">
                              <div className="userDatatable global-shadow border bg-white radius-xl">
                                <div className="table-responsive">
                                  <table className="table mb-0 table-borderless signatairesTable table-striped table-hover">
                                    <thead>
                                      <tr className="userDatatable-header">
                                        <th>
                                          <span className="userDatatable-title">#</span>
                                        </th>
                                        <th>
                                          <span className="userDatatable-title">Profil</span>
                                        </th>
                                        <th>
                                          <span className="userDatatable-title">Signataire</span>
                                        </th>
                                        {/* <th>
                                          <span className="userDatatable-title">Par Interim </span>
                                        </th>
                                        <th>
                                          <span className="userDatatable-title">Par Ordre</span>
                                        </th> */}
                                      </tr>
                                    </thead>
                                    <tbody>
                                      <tr>
                                        <td>
                                          <div className="d-flex">
                                            <div className="userDatatable-inline-title">
                                              <h6>Signataire 1</h6>
                                            </div>
                                          </div>
                                        </td>
                                        <td>
                                          <div className="userDatatable-content">
                                            {this.state.mission.OMProfilSignataire1 ? this.state.mission.OMProfilSignataire1 : '-'}
                                          </div>
                                        </td>
                                        <td>
                                          <div className="userDatatable-content">
                                            {this.state.mission.OMAgentSignataire1 ? this.state.mission.OMAgentSignataire1 : '-'}
                                          </div>
                                        </td>
                                        {/* <td>
                                          <div className="userDatatable-content">
                                            kjnfnkfnjdffd
                                          </div>
                                        </td>
                                        <td>
                                          <div className="userDatatable-content d-inline-block">
                                            dffdff
                                          </div>
                                        </td> */}
                                      </tr>
                                      <tr>
                                        <td>
                                          <div className="d-flex">
                                            <div className="userDatatable-inline-title">
                                              <h6>Signataire 2</h6>
                                            </div>
                                          </div>
                                        </td>
                                        <td>
                                          <div className="userDatatable-content" >
                                            {this.state.mission.OMProfilSignataire2 ? this.state.mission.OMProfilSignataire2 : '-'}
                                          </div>
                                        </td>
                                        <td>
                                          <div className="userDatatable-content">
                                            {this.state.mission.OMAgentSignataire2 ? this.state.mission.OMAgentSignataire2 : '-'}
                                          </div>
                                        </td>
                                        {/* <td>
                                          <div className="userDatatable-content">
                                            kjnfnkfnjdffd
                                          </div>
                                        </td>
                                        <td>
                                          <div className="userDatatable-content d-inline-block">
                                            dffdff
                                          </div>
                                        </td> */}
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-xl-12 col-lg-12">
                          <div className="card h-100">
                            <div className="card-header py-20  px-sm-25 px-3 ">
                              <h6>Pieces Justificatives</h6>
                            </div>
                            <div className="card-body">
                              <div className="row">
                                {
                                  this.state.mission.pieces && this.state.mission.pieces.length ?
                                    this.state.mission.pieces.map(piece => (
                                      <div className="col-xl-3 col-lg-4 col-sm-6">
                                        <div className="fileM-single mb-25">
                                          <div className="fileM-card ">
                                            < div className="card border-0">
                                              <div className="card-body pb-40 pt-45">
                                                <div className="fileM-img">
                                                  <img className="wh-50" src="../img/pdf.png" alt="" />
                                                </div>
                                                <p className="fileM-excerpt">{piece.type ? piece.type.TypePieceJust : '-'} </p>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    ))
                                    : <div className="col-md-12">
                                      <div className="col-md-12">
                                        <Alert type="warning" message="Aucune pièce pour cette mission  " />
                                      </div>
                                    </div>
                                }
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div> :
                  <div className="container-fluid">
                    <div className="row">
                      <div className="col-md-12 pt-5">
                        <div className="mt-5">
                          <div className="col-md-12 offset-md-2 "><EmptyMissions type="danger" title={this.state.error} icon="fas fa-times text-white" message="Aucune Mission n'a été trouvée. Veuillez bien vérifier et recommencer" /> </div>
                        </div>
                      </div>
                    </div>
                  </div>
              }
            </div>
          </div>
        }
      </div >
    );
  }
}

export default ViewMission;