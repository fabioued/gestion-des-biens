import React from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import Swal from 'sweetalert2';

const formatDate = (date) => {
  return moment(date).format("DD/MM/YYYY");
}


let List = ({ missions, numeroter, history }) => {

  const numeroterMission = (event, RefMission) => {
    // console.log('event', event);
    // console.log('RefMission', RefMission);
    const IdMission = event;
    let splitRef = RefMission.split('/');
    let year = splitRef[0];
    // let code = splitRef.slice(2);
    let code = splitRef.slice(2).join('/');
    // console.log('year', year);
    // console.log('code', code);
    Swal.fire({
      title: 'Numéro de la Mission',
      html:
        '<div class="row"><div class="col-md-4 mb-25"><input value="' + year + '" id="swal-input1" class="swal2-input ih-medium ip-gray radius-xs b-light"></div> ' +
        '<div class="form-group col-md-4 mb-25"><input id="numero" placeholder="________________________"  class="swal2-input  ih-medium ip-gray radius-xs b-light"></div>' +
        '<div class="form-group col-md-4 mb-25"><input id="swal-input3"  value="' + code + '" class="swal2-input  ih-medium ip-gray radius-xs b-light"></div></div>',
      width: '50%',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      preConfirm: async () => {
        const numero = Swal.getPopup().querySelector('#numero').value;
        if (!numero) {
          Swal.showValidationMessage(`Veuillez entrer le Numéro`)
        } else {
          let data = {
            IdMission,
            numero
          }
          let reponse = await numeroter(data);
          //console.log('reponse', reponse);
          if (reponse.message === "Success") {

            Swal.fire({
              title: "Numéroté avec Succès",
            });
            window.location.reload(false);
          }
          else {
            Swal.fire({
              icon: 'error',
              title: `${reponse.message}`,
            });
          }
        }
      },
      confirmButtonText: 'Valider',
      confirmButtonColor: 'green',
      cancelButtonText: "Annuler",
      cancelButtonColor: "red",
      showCloseButton: true,
      showLoaderOnConfirm: true,
      allowOutsideClick: () => !Swal.isLoading()
    })
  }

  return (
    <div className="userDatatable orderDatatable sellerDatatable global-shadow border mb-30 py-30 px-sm-30 px-20 bg-white radius-xl w-100">
      <div className="table-responsive">
        <table className="table mb-0 table-borderless border-0 table-striped table-hover">
          <thead className="text-center">
            <tr className="userDatatable-header">
              <th scope="col">
                <span className="userDatatable-title">Unité Administrative</span>
              </th>
              <th scope="col">
                <span className="userDatatable-title">Référence</span>
              </th>
              <th scope="col">
                <span className="userDatatable-title">Départ / Retour</span>
              </th>
              <th scope="col">
                <span className="userDatatable-title">Numeroter</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {missions && missions.map(mission => (
              <tr key={mission.IdMission}>
                <td>
                  <div className="orderDatatable-title">
                    {mission.direction.CodeDirection}
                  </div>
                </td>
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
                    <button onClick={() => { numeroterMission(mission.IdMission, mission.RefMission) }} className="btn btn-primary btn-xs btn-squared ">Numeroter </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div >
  )
};

export default List;