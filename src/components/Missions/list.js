import React from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import Swal from 'sweetalert2';

const formatDate = (date) => {
  return moment(date).format("DD/MM/YYYY");
}

const getStatus = (status) => {
  if (status === 'initieeparAgent' || status === 'initieeparDirecteur') {
    return <span className="atbd-tag tag-light tag-transparented">A Soumettre</span>
  }
  else if (status === 'soumisParAgent' || status === 'soumisParDirecteur') {
    return <span className="atbd-tag tag-warning tag-transparented ">Approveé Par DG</span>
  }
  else if (status === 'approuverParDirecteur') {
    return <span className="atbd-tag tag-success tag-transparented ">Approveé Par DG</span>
  }
  else if (status === 'approuverParSG') {
    return <span className="atbd-tag tag-success tag-transparented ">Approveé Par SG</span>
  }
  else if (status === 'rejetterParDG') {
    return <span className="atbd-tag tag-danger tag-transparented ">Rejetteé Par DG</span>
  }
  else if (status === 'rejetterParSG') {
    return <span className="atbd-tag tag-danger tag-transparented ">Rejetteé Par SG</span>
  }
}

const getNumberOfDays = (depart, retour) => {
  var start = moment(depart, "YYYY-MM-DD");
  var end = moment(retour, "YYYY-MM-DD");
  return moment.duration(end.diff(start)).asDays();
}

let List = ({ missions, setMissionId, removeMissionId, editMission, authUser, submitMission, annulerMission, history }) => {
  const soumettreMission = (event) => {
    let type_agent = '';
    const user_id = authUser.IdUtilisateur;
    const droits = authUser.droit;
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
          const reponse = await submitMission(event, user_id, type_agent);
          // console.log('reponse', reponse);
          if (reponse.message === "Success") {
            missions = missions;
            Swal.fire({
              icon: 'success',
              title: "Soumis avec Succès",
            });
            window.location.reload(false);
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

  const cancelMission = (event) => {
    //console.log('submitMission', this.props);
    let type_agent = '';
    const user_id = authUser.IdUtilisateur;
    const droits = authUser.droit;
    if (droits.DroitAnnulation) {
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
          const reponse = await annulerMission(event);
          if (reponse.message === "Success") {
            Swal.fire({
              icon: 'success',
              title: "Annulé avec Succès",
            });
            window.location.reload(false);
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
  return (
    <div className="userDatatable orderDatatable sellerDatatable global-shadow border mb-30 py-30 px-sm-30 px-20 bg-white radius-xl w-100">
      <div className="table-responsive">
        <table className="table mb-0 table-borderless border-0 table-striped table-hover">
          <thead className="text-center">
            <tr className="userDatatable-header">
              <th scope="col">
                <span className="userDatatable-title">Référence</span>
              </th>
              <th scope="col">
                <span className="userDatatable-title">Départ / Retour</span>
              </th>
              <th scope="col">
                <span className="userDatatable-title">Nombre de Jours</span>
              </th>
              <th scope="col">
                <span className="userDatatable-title">Status</span>
              </th>
              <th scope="col">
                <span className="userDatatable-title">Actions</span>
              </th>

            </tr>
          </thead>
          <tbody>
            {missions && missions.map(mission => (
              <tr key={mission.IdMission}>
                <td>
                  <div className="d-flex align-items-center">
                    <div className="orderDatatable-title">
                      <p className="d-block mb-0">
                        {mission.RefMission}
                      </p>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="orderDatatable-title">
                    {`${formatDate(mission.DateDepartMission)}  -  ${formatDate(mission.DateRetourMission)}`}
                  </div>
                </td>

                <td>
                  <div className="orderDatatable-title">
                    <span className="atbd-tag tag-info tag-transparented ">{`${getNumberOfDays(mission.DateDepartMission, mission.DateRetourMission)}`} Jour(s)</span>
                  </div>
                </td>

                <td>
                  <div className="orderDatatable-title">
                    {getStatus(mission.status)}
                  </div>
                </td>

                <td>
                  <ul class="orderDatatable_actions mb-0 d-flex flex-wrap float-right">
                    <li>
                      <a href="#" onClick={() => { setMissionId(mission.IdMission) }} className="view">
                        <span className="nav-icon">
                          <i className="fas fa-eye text-success"></i>
                        </span>
                      </a>
                    </li>
                    <li>
                      <a href="#" onClick={() => { soumettreMission(mission.IdMission) }} className="view">
                        <span className="nav-icon">
                          <i className="fas fa-paper-plane text-success"></i>
                        </span>
                      </a>
                    </li>
                    <li>
                      <a href="#" onClick={() => { editMission(mission.IdMission) }} className="edit">
                        <span className="nav-icon">
                          <i className="fas fa-edit text-warning"></i>
                        </span>
                      </a>
                    </li>
                    <li>
                      <a href="#" onClick={() => { cancelMission(mission.IdMission) }}>
                        <i className="fas fa-trash text-danger"></i>
                      </a>
                    </li>
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
};

export default List;