import React from 'react';
import AsideMissions from '../../components/Aside/missions';
import moment from 'moment';
import { jsPDF } from "jspdf";
import QRCode from 'qrcode.react';
import html2canvas from 'html2canvas';
import Spinner from '../../components/Spinner';
import EmptyMissions from '../../components/Empty/big';

class EtatMission extends React.Component {
  constructor() {
    super();
    this.state = {
      mission: [],
      loading: true,
      error: null
    }

  }
  componentWillMount() {
    if (this.props.authUser) {
      const mission_id = localStorage.getItem('IdMission');
      const mission = this.props.missions.find(mission => mission.IdMission == mission_id);
      // console.log('mission_id', mission_id);
      // console.log('this.props.missions', this.props.missions);
      // console.log('mission', mission);
      if (mission) {
        //  alert('found !');
        this.setState({
          mission,
          loading: false,
        });
      } else {
        // alert('Not found !');
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

  exportPDF = () => {
    this.setState({
      loading: true,
    });
    const divToDisplay = document.getElementById('pdf');
    html2canvas(divToDisplay).then((canvas) => {
      const divImage = canvas.toDataURL("image/png");
      const pdf = new jsPDF('p', 'pt', 'a4');
      const width = pdf.internal.pageSize.getWidth();
      const height = pdf.internal.pageSize.getHeight();
      pdf.addImage(divImage, 'PNG', 10, 0, width, height);
      pdf.setFont("helvetica");
      pdf.setFontSize(9);
      this.setState({
        loading: false,
      });
      pdf.save("ETAT_OrdreMissionDEMO.pdf");
      this.props.notyService.notif('Etat d\'ordre de mission Téléchargé ', 'success');
    });

  }

  renderStatus(ChefMission, ChauffeurMission) {
    if (ChefMission) {
      return 'Chef de Mission';
    } else if (ChauffeurMission) {
      return 'Chauffeur';
    } else {
      return 'Membre';
    }
  }

  getNumberOfDays(depart, retour) {
    var start = moment(depart, "YYYY-MM-DD");
    var end = moment(retour, "YYYY-MM-DD");
    return moment.duration(end.diff(start)).asDays();
  }
  formatDate(date) {
    return moment(date).format("DD/MM/YYYY");
  }

  render() {
    var date = moment().format('DD/MM/YYYY');
    var numero = this.state.mission.RefMission;

    // const pageA4 = {
    //   backgroundColor: '#f5f5f5',
    //   width: '210mm',
    //   minHeight: '297mm',
    //   marginLeft: 'auto',
    //   marginRight: 'auto'
    // };
    return (
      <div>
        <AsideMissions />
        {
          this.state.loading && <Spinner />
        }
        {
          !this.state.loading && <div>

            <div className="contents text-black">
              {
                !this.state.error ?
                  <div className="container-fluid">
                    <div className="row text-dark">
                      <div className="col-lg-12 card mb-4">
                        <div className="breadcrumb-main application-ui mb-50">
                          <div className="breadcrumb-action d-flex">
                            <div className="d-flex align-items-center user-member__title mr-sm-25 mr-0">
                              <h4 className="text-capitalize fw-500 breadcrumb-title">Etat de la Mission</h4>
                            </div>
                          </div>
                          <div className="d-flex text-capitalize">
                            <button onClick={this.exportPDF} className="breadcrumb-edit border-0  content-center bg-primary fs-12 fw-500 ml-10 radius-md text-white">
                              <i className="fas fa-cloud-download-alt m-1"> </i>Télécharger
                            </button>
                          </div>
                        </div>
                      </div>
                      <div id="pdf" className="row m-0 p-3 pb-5 mb-4 bg-white">
                        <div className="col-lg-12 mt-4 ">
                          <div className="col-lg-6 float-left">
                            <div className="text-center">
                              <h6 className="mb-2">{this.state.mission.direction.SG.LeMinistere ? this.state.mission.direction.SG.LeMinistere.LibelleDirection : ''}</h6>
                              <span className="mb-2">*******************</span>
                              <h6 className="mb-2">{this.state.mission.direction.SG ? this.state.mission.direction.SG.LibelleDirection : ''}</h6>
                              <span className="mb-3">*******************</span>
                              <h6 className="mb-3">{this.state.mission.direction.programme ? this.state.mission.direction.programme.LibelleDirection : ''}</h6>
                              <span className="mb-3">*******************</span>
                              <h6 className="mb-5">{this.state.mission.direction ? this.state.mission.direction.LibelleDirection : ''}</h6>
                            </div>
                            <p>N° : {numero}</p>
                          </div>
                          <div className="col-lg-6 float-right text-center">
                            <h6>BURKINA FASO</h6>
                            <span>*******************</span>
                            <h6>Unité-Progrès-Justice</h6>
                            <br /><br />
                            <div className="mb-2">
                              <QRCode
                                value={"Id° : " + this.state.mission.IdMission + "    Réf : " + this.state.mission.RefMission}
                                size={120}
                                level={"H"}
                                includeMargin={true}
                              />
                            </div>
                            <span> Ouagadougou le  {date}</span>
                          </div>

                        </div>
                        <div className="col-lg-12 text-center  mb-5">
                          <h6 className="mb-3 font-weight-bold"><u>ORDRE DE MISSION TEMPORAIRE</u></h6>
                          <p>Décret n°2016-1056/PRES/PM/MINEFID/MATDSI/MTMUSR du 14/11/2016 portant réglementation générale de l'utilisation des véhicules de l'Etat, de ses démembrements et des autres organismes publics</p>
                        </div>

                        <div className="col-lg-12 mb-4">
                          <div className="col-lg-4 float-left text-left">
                            <p className="font-weight-bold">Je soussigné <span className="float-right">:</span></p>
                          </div>
                          <div className="col-lg-8 float-right text-left">
                            <p>Monsieur <span className="font-weight-bold">{this.state.mission.OMMinistre}</span>, Ministre de l'Agriculture, des Aménagements Hydro agricoles et de la Mécanisation, ordonne la mission qui suit:</p>
                          </div>
                        </div>
                        <div className="col-lg-12 mb-4">
                          <div className="col-lg-4 float-left text-left">
                            <p className="font-weight-bold">Objet <span className="float-right">:</span></p>
                          </div>
                          <div className="col-lg-8 float-right text-left">
                            <p>{this.state.mission.ObjetMission}</p>
                          </div>
                        </div>
                        <div className="col-lg-12 mb-4">
                          <div className="col-lg-4 float-left text-left">
                            <p className="font-weight-bold">Lieu(x) <span className="float-right">:</span></p>
                          </div>
                          <div className="col-lg-8 float-right text-left">
                            <table className="table mb-0 text-dark table-bordered">
                              <thead>
                                <tr className="#">
                                  <th>
                                    <span className="font-weight-bold">REGION(S)</span>
                                  </th>
                                  <th>
                                    <span className="font-weight-bold">PROVINCE</span>
                                  </th>
                                  <th>
                                    <span className="font-weight-bold">COMMUNE</span>
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {this.state.mission.lieux.length ? this.state.mission.lieux.map(lieu => (
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
                                )) : <tr><td>-</td> <td>-</td> <td>-</td></tr>}

                              </tbody>
                            </table>
                          </div>
                        </div>

                        <div className="col-lg-12 mb-4">
                          <div className="col-lg-4 float-left text-left">
                            <p className="font-weight-bold">Participants <span className="float-right">:</span></p>
                          </div>
                          <div className="col-lg-8 float-right text-left">
                            <table className="table mb-0 text-dark table-bordered">
                              <thead>
                                <tr className="#">
                                  <th>
                                    <span className="font-weight-bold">MEMBRES(S)</span>
                                  </th>
                                  <th>
                                    <span className="font-weight-bold">FONCTION(S)</span>
                                  </th>
                                  <th>
                                    <span className="font-weight-bold">STRUCTURE(S)</span>
                                  </th>
                                  <th>
                                    <span className="font-weight-bold">STATUT</span>
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {this.state.mission.membres.length ? this.state.mission.membres.map(membre => (
                                  <tr>
                                    <td>
                                      <div className="d-flex">
                                        <div className="userDatatable-inline-title">
                                          <h6>{membre.agent.NomAgent} {membre.agent.PrenomAgent}</h6>
                                        </div>
                                      </div>
                                    </td>
                                    <td>
                                      <div className="userDatatable-content">
                                        {membre.agent.fonction ? membre.agent.fonction.LibelleFonction : '-'}
                                      </div>
                                    </td>
                                    <td>
                                      <div className="userDatatable-content">
                                        {membre.agent.direction ? membre.agent.direction.CodeDirection : ''}
                                      </div>
                                    </td>
                                    <td>
                                      <div className="userDatatable-content d-inline-block">
                                        {this.renderStatus(membre.ChefMission, membre.ChauffeurMission)}
                                      </div>
                                    </td>
                                  </tr>
                                )) : <tr><td>-</td> <td>-</td> <td>-</td> <td>-</td></tr>}
                              </tbody>
                            </table>
                          </div>
                        </div>

                        <div className="col-lg-12 mb-4">
                          <div className="col-lg-4 float-left text-left">
                            <p className="font-weight-bold">Période <span className="float-right">:</span></p>
                          </div>
                          <div className="col-lg-4 float-left text-left">
                            <p><span className="font-weight-bold mr-1">Date de départ :</span> {this.formatDate(this.state.mission.DateDepartMission)}</p>
                          </div>
                          <div className="col-lg-4 float-right text-left">
                            <p><span className="font-weight-bold mr-1">Date de retour :</span> {this.formatDate(this.state.mission.DateRetourMission)}</p>
                          </div>
                        </div>
                        <div className="col-lg-12 mb-4">
                          <div className="col-lg-4 float-left text-left">
                            <p className="font-weight-bold">Moyen de transport <span className="float-right">:</span></p>
                          </div>
                          <div className="col-lg-8 float-right text-left">
                            <p>{this.state.mission.vehicule ? this.state.mission.vehicule.ImmatriculationVeh : '-'}</p>
                          </div>
                        </div>
                        <div className="col-lg-12 mb-4">
                          <div className="col-lg-4 float-left text-left">
                            <p className="font-weight-bold">Imputation Budgétaire <span className="float-right">:</span></p>
                          </div>
                          <div className="col-lg-8 float-right text-left text-dark">
                            {
                              this.state.mission.financements.length ? this.state.mission.financements.map(imputation => (
                                <span>{imputation.type ? imputation.type.LibelleImputation : '-'} <span className="font-weight-bold">{imputation.direction ? imputation.direction.CodeDirection : ''} </span><br /></span>
                              )) : '-'
                            }
                          </div>
                        </div>
                        <div className="col-lg-12 mt-3 mb-5">
                          <div className="col-lg-5 float-left">
                            <div className="text-center">
                              <p className="mb-3">{this.state.mission.OMProfilSignataire1}</p>
                              <h6 className="font-weight-bold"><u>{this.state.mission.OMAgentSignataire1}</u></h6>
                            </div>
                          </div>
                          <div className="col-lg-1"></div>
                          <div className="col-lg-6 float-right text-center">
                            <p className="mb-3">{this.state.mission.OMProfilSignataire2}</p>
                            <h6 className="font-weight-bold"><u>{this.state.mission.OMAgentSignataire2}</u></h6>
                            <span><i>{this.state.mission.OMDistinctionSignataire2}</i></span>
                          </div>

                        </div>
                      </div>
                    </div>
                  </div>
                  :
                  <div className="container-fluid">
                    <div className="row">
                      <div className="col-md-12">
                        <div className="m-20">
                          <EmptyMissions message={this.state.error} />
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

export default EtatMission;