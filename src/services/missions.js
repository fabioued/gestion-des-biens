import Axios from 'axios';
import { validateAll } from 'indicative/validator';

import config from '../config';

export default class MissionsService {

  async getUserMissions(user_id) {
    const response = await Axios.get(`${config.apiUrl}/missions/utilisateurs/${user_id}/created`);
    return response.data.data;
  }

  async getUserAllMissions(user_id) {
    const response = await Axios.get(`${config.apiUrl}/missions/utilisateurs/${user_id}/all`);
    return response.data.data;
  }

  async getMissionAvis(user_id) {
    const response = await Axios.get(`${config.apiUrl}/missions/avis/user/${user_id}`);
    return response.data.data;
  }

  async getMissionsNumeroter(user_id) {
    const response = await Axios.get(`${config.apiUrl}/missions/a-numeroter/user/${user_id}`);
    return response.data.data;
  }




  async getMissionSoumiseByUser(user_id) {
    const response = await Axios.get(`${config.apiUrl}/missions/utilisateurs/${user_id}/soumises`);
    return response.data.data;
  }

  // async getMissionValideeByDGForUser(user_id) {
  //   const response = await Axios.get(`${config.apiUrl}/missions/utilisateurs/${user_id}/soumises`);
  //   return response.data.data;
  // }

  // async getMissionValideeBySGForUser(user_id) {
  //   const response = await Axios.get(`${config.apiUrl}/missions/utilisateurs/${user_id}/soumises`);
  //   return response.data.data;
  // }

  // async getMissionRejetteeByDGForUser(user_id) {
  //   const response = await Axios.get(`${config.apiUrl}/missions/utilisateurs/${user_id}/soumises`);
  //   return response.data.data;
  // }

  // async getMissionRejetteeBySGForUser(user_id) {
  //   const response = await Axios.get(`${config.apiUrl}/missions/utilisateurs/${user_id}/soumises`);
  //   return response.data.data;
  // }

  async getMissionCreatedByDG(user_id) {
    const response = await Axios.get(`${config.apiUrl}/missions/dg/${user_id}/created`);
    return response.data.data;
  }

  async getMissionSoumiseByDG(user_id) {
    const response = await Axios.get(`${config.apiUrl}/missions/dg/${user_id}/soumises`);
    return response.data.data;
  }

  async getMissionForDG(user_id) {
    const response = await Axios.get(`${config.apiUrl}/missions/dg/${user_id}/attente`);
    return response.data.data;
  }

  async getMissionForSG() {
    const response = await Axios.get(`${config.apiUrl}/missions/sg/all`);
    return response.data.data;
  }


  async approuverMission(IdMission, type_agent) {
    const response = await Axios.get(`${config.apiUrl}/missions/approuver/${IdMission}/type/${type_agent}`);
    return response.data;
  }

  async rejetterMission(data) {
    try {
      const response = await Axios.post(`${config.apiUrl}/missions/rejetter`,
        data
      );
      return response.data;
    } catch (error) {
      if (error.response) {
        return Promise.reject(error.response.data);
      }
      return Promise.reject(error);
    }
  }


  async numeroterMission(data) {
    try {
      const response = await Axios.post(`${config.apiUrl}/missions/numeroter`,
        data
      );
      return response.data;
    } catch (error) {
      console.log('error', error);
      if (error.response) {
        return Promise.reject(error.response);
      }
      return Promise.reject(error);
    }
  }


  async getMissionById(mission_id) {
    const response = await Axios.get(`${config.apiUrl}/missions/${mission_id}`);
    return response.data.data;
  }

  async getAgentById(user_id) {
    const response = await Axios.get(`${config.apiUrl}/agents/${user_id}`);
    return response.data.data;
  }

  async getAgentsByDirections(direction_id) {
    const response = await Axios.get(`${config.apiUrl}/directions/${direction_id}/agents`);
    return response.data.data;
  }

  async getUserObjects(user_id) {
    const response = await Axios.get(`${config.apiUrl}/objets/user/${user_id}`);
    return response.data.data;
  }

  async getTransports() {
    const response = await Axios.get(`${config.apiUrl}/vehicules/all`);
    return response.data.data;

  }

  async getRegions() {
    const response = await Axios.get(`${config.apiUrl}/regions/all`);
    return response.data.data;
  }

  async getAllAgents() {
    const response = await Axios.get(`${config.apiUrl}/agents/all`);
    return response.data.data;
  }

  async getRubriques() {
    const response = await Axios.get(`${config.apiUrl}/types-imputation/all`);
    return response.data.data;
  }

  async getFinancements() {
    const response = await Axios.get(`${config.apiUrl}/directions/programmes`);
    return response.data.data;
  }


  createMission = async (data) => {
    try {
      const rules = {
        ObjetMission: 'required|string',
        DateDepartMission: 'required',
        DateDepartMission: 'required',
        IdVehicule: 'required',
        lieux: 'required',
        membres: 'required',
        imputationsBudgetaires: 'required',
      };

      const messages = {
        required: 'Ce Champs est requis',
      };

      await validateAll(data, rules, messages);

      const response = await Axios.post(`${config.apiUrl}/missions/create`,
        data
      );
      // const mission = response.data.newMission;
      // console.log('mission', mission);
      // const { membres } = data;
      // console.log('membres', membres);
      // let newMembres = [];
      // membres.map(membre => {
      //   newMembres.push(
      //     {
      //       IdMission: mission.IdMission,
      //       ...membre
      //     }
      //   );
      // });

      // console.log('newMembres', newMembres);
      // const responseMembre = await Axios.post(`${config.apiUrl}/membres-mission/create`,
      //   { data: newMembres }
      // );

      // console.log('responseMembre', responseMembre);

      return response.data;
    } catch (errors) {
      if (errors.response) {
        return Promise.reject(errors.response.data);
      }
      return Promise.reject(errors);
    }
  }


  submitMission = async (IdMission, user_id, type_agent,) => {
    try {
      const response = await Axios.get(`${config.apiUrl}/missions/soummettre/${IdMission}/user/${user_id}/type/${type_agent}`);
      return response.data;

    } catch (error) {
      return Promise.reject(error);
    }
  }


  annulerMission = async (IdMission) => {
    try {
      const response = await Axios.get(`${config.apiUrl}/missions/annuler/${IdMission}`);
      return response.data;

    } catch (error) {
      return Promise.reject(error);
    }
  }




  getUsernotifications = async (user_id) => {
    const response = await Axios.get(`${config.apiUrl}/notifications/user/${user_id}`);
    return response.data.data;
  }

  createRubrique = async (data) => {
    const response = await Axios.post(`${config.apiUrl}/types-imputation/create`,
      {
        LibelleImputation: data
      }
    );
    return response.data;
  }

  // async uploadToCloudinary(image) {
  //   const form = new FormData();
  //   form.append('file', image);
  //   form.append('upload_preset', 'g5ziunzg');

  //   const response = await Axios.post('https://api.cloudinary.com/v1_1/bahdcoder/image/upload', form);

  //   return response.data;
  // }
}