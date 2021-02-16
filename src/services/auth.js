
import { validateAll } from 'indicative/validator'
import Axios from 'axios';
import config from '../config';

export default class AuthService {

  async login(data) {
    const rules = {
      username: 'required|string',
      password: 'required|string|min:4'
    }

    const messages = {
      'required': 'Ce Champs est requis',
      'username.alpha': 'Username contains invalid characters',
      'password.min': 'Le Mot de passe est trop court',
    }

    try {
      await validateAll(data, rules, messages);
      const response = await Axios.post(`${config.apiUrl}/connexions/login`, {
        Nom_Utilisateur: data.username,
        MotDePasse_Utilisateur: data.password
      });
      return response.data.user;
    } catch (errors) {
      let formattedErrors = {};
      if ((errors.response && errors.response.status === 401) || errors.response && errors.response.status === 500) {
        return Promise.reject({
          type: 'axios',
          errors: errors.message
        });
      }
      errors.forEach((error) => {
        formattedErrors[error.field] = error.message;
      });
      return Promise.reject({
        type: 'validator',
        errors: formattedErrors
      }
      );
    }
  }

  async logout(data) {
    try {
      const response = await Axios.post(`${config.apiUrl}/connexions/logout`, {
        IdUtilisateur: data.IdUtilisateur
      });
      return response.data.message;
    } catch (errors) {
      if (errors.response && errors.response.status === 401) {
        return Promise.reject({
          type: 'axios',
          errors: errors.response.data.message
        });
      }
    }
  }
}