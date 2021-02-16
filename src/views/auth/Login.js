import React from 'react';
import { Fragment } from 'react';

class Login extends React.Component {
  constructor() {
    super();
    this.state = {
      username: '',
      password: '',
      errors: {},
      hidePassword: true,
      type: 'password',
      loading: false,
      loginError: ''
    };
  }

  handleInputChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  login = async (event) => {
    event.preventDefault();
    try {
      this.setState({
        loading: true,
        errors: {}
      });
      const user = await this.props.loginUser(this.state);
      this.setState({
        loading: false,
        loginError: null
      });
      //console.log('user', user);
      this.props.setAuthUser(user);
    } catch (errors) {
      console.log('errors', errors.message);
      this.setState({
        loading: false,
        loginError: null
      });
      if (errors.type === 'axios') {
        this.setState({ loginError: errors.errors });
      } else {
        this.setState({ errors: errors.errors });
      }
    }
  }

  showPassword = () => {
    this.setState({
      hidePassword: false,
      type: 'text'
    })
  }

  hidePassword = () => {
    this.setState({
      hidePassword: true,
      type: 'password'
    })
  }

  render() {
    const login = {
      backgroundColor: "#018c3b"
    };
    return (
      <main className="main-content">
        <div className="signUP-admin" style={login}>
          <div className="container-fluid">
            <div className="row justify-content-center">
              <div className="col-xl-4 col-lg-5 col-md-5 p-0">
                <div className="signUP-admin-left signIn-admin-left position-relative">
                  <div className="signUP-overlay">
                    <img className="svg signupTop" src="img/svg/signupTop.svg" alt="img" />
                    <img className="svg signupBottom" src="img/svg/signupBottom.svg" alt="img" />
                  </div>
                  <div className="signUP-admin-left__content">
                    <h1>Bienvenue sur le Logiciel de Gestion  <span className="color-primary">Des Biens</span></h1>
                  </div>
                  <div className="signUP-admin-left__img">
                    <img className="img-fluid svg" src="https://image.freepik.com/free-vector/sign-page-smartphone-screen_32996-10.jpg" alt="img" />
                  </div>
                </div>
              </div>
              <div className="col-xl-8 col-lg-7 col-md-7 col-sm-8 mt-5">
                <div className="signUp-admin-right   signIn-admin-right p-md-40 p-10" >
                  <div className="row justify-content-center">
                    <div className="col-xl-8 col-lg-8 p-2 col-md-12">
                      <div className="edit-profile mt-md-25 mt-25">
                        <div className="card border-0">
                          <div className="card-header  border-0 pb-md-15 pb-10 pt-md-20 pt-10 ">
                            <div className="edit-profile__title text-center">
                              <h6 className="text-center">Se Connecter</h6>
                            </div>
                          </div>
                          <div className="card-body">
                            <div className="edit-profile__body">
                              {this.state.loginError && <div class=" alert alert-danger " role="alert">
                                <div class="alert-content ">
                                  <p style={{ textAlign: 'center' }}>{this.state.loginError}</p>
                                </div>
                              </div>}
                              <form onSubmit={this.login}>
                                <div className="form-group mb-20">
                                  <label for="username">Nom d'utilisateur</label>
                                  <input name="username" type="text" onChange={this.handleInputChange} className="form-control" required />
                                  {this.state.errors['username'] && <small className="text-danger">{this.state.errors['username']}</small>}
                                </div>
                                <div className="form-group mb-15">
                                  <label for="password-field">Mot de Passe</label>
                                  <div className="position-relative">
                                    <input name="password" onChange={this.handleInputChange} type={this.state.type} className="form-control" placeholder="password" required />
                                    {this.state.hidePassword ? <div className="fa fa-fw fa-eye-slash text-light fs-16 field-icon toggle-password2" onClick={this.showPassword}></div> : <div className="fa fa-fw fa-eye text-light fs-16 field-icon toggle-password2" onClick={this.hidePassword}></div>}
                                    {
                                      this.state.errors['password'] &&
                                      <small className="text-danger">{this.state.errors['password']}</small>
                                    }
                                  </div>
                                </div>
                                <div className="button-group d-flex pt-1 justify-content-md-start justify-content-center">
                                  <button className="btn btn-primary btn-default btn-squared mr-15 text-capitalize lh-normal px-50 py-15 signIn-createBtn ">
                                    {this.state.loading ?
                                      <Fragment>
                                        <i className="fas fa-spinner fa-spin"></i>
                                        Connection en Cours
                                      </Fragment>
                                      : "Se Connecter"}
                                  </button>
                                </div>
                              </form>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main >
    );
  }
}

export default Login;