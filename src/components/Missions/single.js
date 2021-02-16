import React from 'react';
import { Link } from 'react-router-dom';

const Single = ({ mission }) => {
  return (
    <div className="userDatatable orderDatatable sellerDatatable global-shadow border mb-30 py-30 px-sm-30 px-20 bg-white radius-xl w-100">
      <div className="table-responsive">
        <table className="table mb-0 table-borderless border-0">
          <thead>
            <tr className="userDatatable-header">
              <th scope="col">
                <span className="userDatatable-title">Référence</span>
              </th>
              <th scope="col">
                <span className="userDatatable-title">Départ / Retour</span>
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
            {mission}
          </tbody>
        </table>
      </div>
    </div>
  )
};

export default Single;