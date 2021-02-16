import React from 'react';
import Spinner from '../../components/Spinner';
import AsideMissions from '../../components/Aside/missions';
import { Link } from 'react-router-dom';
import Select from "react-select";
import WindowedSelect from "react-windowed-select";
import "react-dates/initialize";
import { DateRangePicker } from "react-dates";
import Responsive from "react-responsive";
import fr from 'moment/locale/fr';
import "react-dates/lib/css/_datepicker.css";
import moment from "moment";
import Swal from 'sweetalert2';

class CreateMission extends React.Component {

  constructor() {
    super();
    this.state = {
      agent: {},
      objects: {},
      allAgents: {},
      mission: {},
      transports: [],
      regions: {},
      rubriques: {},
      financements: {},
      loading: true,
      error: null,
      type_agent: null,
      form: {},
      ObjetMission: '',
      vehicule: 0,
      selectedRegion: {},
      selectedProvince: {},
      selectedCommune: {},
      selectedMembre: {},
      lieuxMissions: [],
      membresMissions: [],
      selectRef: null,
      addLieu: false,
      addMembre: false,
      selectedChauffeur: {},
      startDate: null,
      endDate: null,
      endDateFormatted: null,
      startDateFormatted: null,
      DateDepartMission: null,
      DateRetourMission: null,
      selectedChef: {},
      sourceFinancements: {},
      imputationsBudgetaires: [],
      OMProfilSignataire1: '',
      OMAgentSignataire1: '',
      OMAgentSignataire1Code: '',
      OMAgentSignataire1Agent: '',
      OMDistinctionSignataire1: '',
      OMProfilSignataire2: '',
      OMAgentSignataire2: 'Dr. Lamourdia THIOMBIANO',
      OMDistinctionSignataire2: "Chevalier de l'Ordre de l'Etalon",
      NomInterimSignataire1: null,
      NomInterimSignataire2: null,
      disabledSignatire2: true,
      disabledSignatire1: true,
      InterimSign1: '',
      interim1: false,
      interim2: false,
      parOrdre1: false,
      parOrdre2: false,
      InterimSign2: '',
      ParOrdreSign1: '',
      ParOrdreSign2: '',
      showSuccess: false,
      showError: false,
      showRubriqueForm: false,
      showSourceForm: false,
    }
    this.handleChangeFinance = this.handleChangeFinance.bind(this)
  }

  async componentWillMount() {
    const user_id = this.props.authUser.IdUtilisateur;
    const agent_id = this.props.authUser.IdAgent;
    const type_agent = this.props.type_agent;
    if (type_agent) {
      this.setState({
        type_agent
      });
    }
    // alert(type_agent);
    this.setState({
      IdUtilisateur: user_id
    });
    const agent = await this.props.getAgentById(agent_id);
    if (agent) {
      this.setState({ agent });
      if (agent.direction) {
        this.setState({
          IdDirection: agent.direction.IdDirection,
          CodeDirection: agent.direction.CodeDirection,
        });
        if (agent.direction.programme) {
          this.setState({
            programme: agent.direction.programme.LibelleDirection,
            CodeProgramme: agent.direction.programme.CodeDirection,
            OMProfilSignataire2: agent.direction.SG.profil.ProfilType
          });
        }
      }
    }
    else {
      this.setState({ error: 'Agent Non Trouver !' });
    }

    const objects = await this.props.getUserObjects(user_id);
    this.setState({ objects });

    const transports = await this.props.getTransports();
    this.setState({ transports });

    const regions = await this.props.getRegions();
    this.setState({ regions });

    // const allAgents = await this.props.getAllAgents();
    // this.setState({ allAgents });

    const allAgents = await this.props.getAgentsByDirections(this.state.IdDirection);
    this.setState({ allAgents });



    const rubriques = await this.props.getRubriques();
    this.setState({ rubriques });

    const financements = await this.props.getFinancements();
    this.setState({ financements });
    // console.log('state', this.state);
    this.setState({
      loading: false
    })

  }

  hundleDateChange(startDate, endDate) {
    this.setState(() => ({
      endDate,
      startDate,
    }));
    if (endDate != null && startDate != null) {
      const numberofDays = moment.duration(endDate.diff(startDate)).asDays();
      if (numberofDays < 14) {
        this.setState(() => ({
          startDateFormatted: startDate.format("D-MM-Y"),
          endDateFormatted: endDate.format("D-MM-Y"),
          DateDepartMission: startDate.utc().format("Y-MM-D HH:MM:SS"),
          DateRetourMission: endDate.utc().format("Y-MM-D HH:MM:SS"),
        }));
      } else {
        this.props.notyService.notif('Une Mission dure au Maximum 14 Jours ', 'error');
        this.setState({
          startDate: null,
          endDate: null
        })
      }


    }
  }

  handleChange1 = (selectedRegion) => {
    this.setState({ selectedRegion, addLieu: true });
    // console.log('selectedRegion', selectedRegion);
  };

  handleChange2 = (selectedProvince) => {
    this.setState({ selectedProvince, addLieu: true })
    // console.log('selectedProvince', selectedProvince);
  }

  handleChange3 = (selectedCommune) => {
    this.setState({ selectedCommune, addLieu: true });

  }

  handleChangeMembre = (selectedMembre) => {
    //console.log('selectedMembre', selectedMembre);
    this.setState({ selectedMembre, addMembre: true })
  }

  handleSelectVehicule = (event) => {
    this.setState({
      vehicule: event.value
    });
  }

  handleInputChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  handleChangeFinance = (rubrique, event) => {

    // console.log('event', event);
    // console.log('rubrique', rubrique);

    // const imputationsBudgetaires = [...this.state.imputationsBudgetaires];
    // let finances = imputationsBudgetaires.findIndex(
    //   (imputation, rubrique) => (imputation.Id_TypeImputation === rubrique.Id_TypeImputation, && rubrique.Id_TypeImputation)
    // );
    // console.log('imputation', imputation);
    let imputationsBudgetaires = [...this.state.imputationsBudgetaires];
    let rowIndex = imputationsBudgetaires.findIndex(
      (imputation) => (imputation.Id_TypeImputation === rubrique.Id_TypeImputation && rubrique.Id_TypeImputation));

    // alert(rowIndex);
    if (rowIndex === -1) {
      let imputation = {
        Id_TypeImputation: rubrique.Id_TypeImputation,
        IdDirection: event.IdDirection
      };
      this.setState({
        imputationsBudgetaires: [...this.state.imputationsBudgetaires, imputation]
      });
    } else {
      let newImputation = {
        Id_TypeImputation: rubrique.Id_TypeImputation,
        IdDirection: event.IdDirection
      };
      imputationsBudgetaires[rowIndex] = newImputation;
      this.setState({
        imputationsBudgetaires
      });
    }
    //console.log('this.state.imputationsBudgetaires', this.state.imputationsBudgetaires);
    if (event.RattacheAuProgBudgetaire != "" && event.programme) {
      // alert('yes Programme');
      const codeResponsable = event.programme.LeResponsable;
      const membresMissions = [...this.state.membresMissions];
      if (codeResponsable) {
        let rowIndex = membresMissions.findIndex((membre) => (membre.IdAgent === codeResponsable && codeResponsable));
        if (rowIndex == -1) {
          //1. Avis du directeur, 2. Validation du responsable de programme (Signature), 3. Autorisation du Secrétaire Général (Signature), 4. Numérotation
          if (event.programme) {

            this.setState({
              OMProfilSignataire1: event.programme.profil ? event.programme.profil.ProfilType : '',
              OMAgentSignataire1: event.programme.Responsable ? event.programme.Responsable.NomAgent : '',
              OMAgentSignataire1Code: event.programme.Responsable.utilisateur ? event.programme.Responsable.utilisateur.IdUtilisateur : '',
              OMAgentSignataire1Agent: event.programme.Responsable ? event.programme.Responsable.IdAgent : '',
            });
          }
        } else {
          this.setState({
            OMProfilSignataire1: event.programme.profil ? event.programme.profil.ProfilType : '',
            OMAgentSignataire1: event.programme.Responsable ? event.programme.Responsable.NomAgent : '',
          });
        }
      }

    } else {
      // alert('No Programme');
      //1. Validation du directeur (Signature), 2. Autorisation du Secrétaire Général (Signature),
      if (event.Responsable) {
        //checker si le directeur est membre de la mission
        const codeDirecteur = event.Responsable.IdAgent;
        const membresMissions = [...this.state.membresMissions];

        if (codeDirecteur) {
          let rowIndex = membresMissions.findIndex(
            (membre) => (membre.IdAgent === codeDirecteur && codeDirecteur)
          );
          if (rowIndex == -1) {
            //1. Validation du directeur (Signature), 2. Autorisation du Secrétaire Général (Signature),
            this.setState({
              OMProfilSignataire1: event.profil ? event.profil.ProfilType : '',
              OMAgentSignataire1: event.Responsable.NomAgent
            });
          } else {
            this.setState({
              OMProfilSignataire1: event.profil ? event.profil.ProfilType : '',
              OMAgentSignataire1: event.Responsable.NomAgent
            });
          }
        }

      }

    }
  }

  ajouterLieu = (event) => {
    //  console.log('this.state.lieuxMissions b4', this.state.lieuxMissions);
    if (this.state.addLieu) {
      let lieu = {
        region: this.state.selectedRegion ? this.state.selectedRegion : null,
        province: this.state.selectedProvince ? this.state.selectedProvince : null,
        commune: this.state.selectedCommune ? this.state.selectedCommune : null,
      };
      const lieuxMissions = [...this.state.lieuxMissions];
      let rowIndex = lieuxMissions.findIndex(
        (lieu) => (lieu.commune.value === this.state.selectedCommune.value && this.state.selectedCommune.value)
      );
      //alert(rowIndex);
      if (rowIndex == -1) {
        this.setState({
          lieuxMissions: [...this.state.lieuxMissions, lieu]
        });
      } else {
        this.props.notyService.notif('Localité déja ajoutée ', 'error');
      }
    }
    //  this.state.selectRef.select.clearValue();
    this.setState({
      selectedRegion: {},
      selectedProvince: {},
      selectedCommune: {},
      addLieu: false
    });
  };

  removeLieu = (event) => {
    //alert(event);
    //console.log('this.state.lieuxMissions', this.state.lieuxMissions[event]);
    const lieuxMissions = [...this.state.lieuxMissions]
    lieuxMissions.splice(event, 1)
    this.setState({ lieuxMissions });
  }

  ajouterMembre = (event) => {
    if (this.state.addMembre) {
      let membre = {
        value: this.state.selectedMembre.value,
        label: this.state.selectedMembre.label,
        IdAgent: this.state.selectedMembre.value,
        NomAgent: this.state.selectedMembre.label,
        MatriculeAgent: this.state.selectedMembre.MatriculeAgent,
        CodeDirection: this.state.selectedMembre.CodeDirection,
        ChefMission: this.state.selectedMembre.ChefMission,
        ChauffeurMission: this.state.selectedMembre.ChauffeurMission,
      };
      const membresMissions = [...this.state.membresMissions];
      let rowIndex = membresMissions.findIndex(
        (membre) => (membre.IdAgent === this.state.selectedMembre.value && this.state.selectedMembre.value)
      );
      if (rowIndex == -1) {
        this.setState({
          membresMissions: [...this.state.membresMissions, membre]
        });
      } else {
        this.props.notyService.notif('Membre déja ajoutée ', 'error');
      }
    }
    this.setState({
      selectedMembre: {},
      addMembre: false
    });

  };

  removeMembre = (event) => {
    const membresMissions = [...this.state.membresMissions]
    membresMissions.splice(event, 1);
    this.setState({ membresMissions });
    this.setState({
      selectedChef: [],
    });
  }

  handleSetChef = (event) => {
    let membresMissions = [...this.state.membresMissions];
    let newData = membresMissions.map(membre => {
      return { ...membre, ChefMission: 0 }
    });

    this.setState({
      membresMissions: newData
    })
    let rowIndex = membresMissions.findIndex(
      (membre) => (membre.IdAgent === event.IdAgent && event.IdAgent)
    );

    this.setState(prevState => {
      const newItems = [...prevState.membresMissions];
      newItems[rowIndex].ChefMission = 1;
      return { membresMissions: newItems };
    })
  }

  handleSetChauffeur = (event) => {
    let membresMissions = [...this.state.membresMissions];
    let newData = membresMissions.map(membre => {
      return { ...membre, ChauffeurMission: 0 }
    });

    this.setState({
      membresMissions: newData
    })
    let rowIndex = membresMissions.findIndex(
      (membre) => (membre.IdAgent === event.IdAgent && event.IdAgent)
    );

    this.setState(prevState => {
      const newItems = [...prevState.membresMissions];
      newItems[rowIndex].ChauffeurMission = 1;
      return { membresMissions: newItems };
    })
  }

  handleInterim1 = (event) => {
    this.setState({
      NomInterimSignataire1: null
    });
    if (event.target.checked) {
      this.setState({
        interim1: true,
        interim2: false,
        parOrdre1: false,
        parOrdre2: false,
        disabledSignatire1: false
      });
    } else {
      this.setState({
        interim1: false,
        interim2: false,
        parOrdre1: false,
        parOrdre2: false,
        disabledSignatire1: true
      });
    }
  }
  handleInterim2 = (event) => {
    this.setState({
      NomInterimSignataire2: null
    });
    if (event.target.checked) {
      this.setState({
        interim2: true,
        interim1: false,
        parOrdre1: false,
        parOrdre2: false,
        disabledSignatire2: false
      });
    } else {
      this.setState({
        interim2: false,
        interim2: false,
        parOrdre1: false,
        parOrdre2: false,
        disabledSignatire2: true
      });
    }
  }
  handleParOrdre1 = (event) => {
    this.setState({
      NomInterimSignataire1: null
    });
    if (event.target.checked) {
      this.setState({
        parOrdre1: true,
        interim1: false,
        interim2: false,
        parOrdre2: false,
        disabledSignatire1: false

      });
    } else {
      this.setState({
        parOrdre1: false,
        disabledSignatire1: true
      });
    }
  }

  handleParOrdre2 = (event) => {
    this.setState({
      NomInterimSignataire2: null
    });
    if (event.target.checked) {
      this.setState({
        parOrdre2: true,
        interim1: false,
        interim2: false,
        parOrdre1: false,
        disabledSignatire2: false
      });
    } else {
      this.setState({
        parOrdre2: false,
        disabledSignatire2: true
      });
    }
  }

  removeChef = (event) => {
    let membresMissions = [...this.state.membresMissions];
    let newData = membresMissions.map(membre => {
      return { ...membre, ChefMission: 0 }
    });

    this.setState({
      membresMissions: newData,
      selectedChef: {}
    })

  }

  removeChauffeur = (event) => {
    let membresMissions = [...this.state.membresMissions];
    let newData = membresMissions.map(membre => {
      return { ...membre, ChauffeurMission: 0 }
    });

    this.setState({
      membresMissions: newData,
      selectedChauffeur: {}
    })
  }

  renderStatus(ChefMission, ChauffeurMission) {
    if (ChefMission) {
      return <span className="bg-opacity-success color-success rounded-pill userDatatable-content-status active">Chef de Mission</span>;
    } else if (ChauffeurMission) {
      return <span className="bg-opacity-info color-info rounded-pill userDatatable-content-status active">Chauffeur</span>;
    } else {
      return <span className="bg-opacity-warning color-warning rounded-pill userDatatable-content-status active">Membre</span>;
    }
  }

  creerMission = async (event) => {
    console.log('this.state', this.state);
    event.preventDefault();
    let checked = true;

    let membresMissions = [...this.state.membresMissions];
    let lieuxMissions = [...this.state.lieuxMissions];
    let lieux = [];
    let membres = [];
    let ChauffeurMission = null;
    let chefMission = null;

    if (!this.state.ObjetMission) {
      checked = false;
      this.props.notyService.notif('Veuillez Saisir l\'objet de la Mission ', 'error');
      return;
    }

    if (!this.state.vehicule) {
      checked = false;
      this.props.notyService.notif('Veuillez Choisir le Véhicule  de la Mission ', 'error');
      return;
    }

    if (!this.state.DateDepartMission && !this.state.DateDepartMission) {
      checked = false;
      this.props.notyService.notif('Veuillez Choisir la date de la Mission ', 'error');
      return;
    }

    if (!lieuxMissions.length) {
      checked = false;
      this.props.notyService.notif('Veuillez Choisir au moins une Localite pour cette Mission ', 'error');
      return;
    } else {
      lieuxMissions.map(lieu => {
        lieux.push({
          IdRegion: lieu.region ? lieu.region.value : '',
          IdCommune: lieu.commune ? lieu.commune.value : '',
          IdProvince: lieu.province ? lieu.province.value : ''
        })
      })
    }

    if (!membresMissions.length) {
      checked = false;
      this.props.notyService.notif('Veuillez Choisir au moins un Agent pour cette Mission ', 'error');
      return;
    } else {
      //check if there is a chef de mission
      chefMission = membresMissions.filter(membre => { return membre.ChefMission === 1; });
      ChauffeurMission = membresMissions.filter(membre => { return membre.ChauffeurMission === 1; });

      if (!chefMission.length) {
        checked = false;
        this.props.notyService.notif('Veuillez Choisir Un Chef de Mission ', 'error');
        return;
      } else {
        membresMissions.map(membre => {
          return membres.push({
            ChefMission: membre.ChefMission,
            ChauffeurMission: membre.ChauffeurMission,
            IdAgent: membre.IdAgent,
          });
        });
      }
    }

    if (!this.state.imputationsBudgetaires.length > 0) {
      checked = false;
      this.props.notyService.notif('Veuillez Choisir au moins une Source de Financement ', 'error');
      return;
    }

    if (checked) {
      this.setState({
        loading: true
      })

      let data = {
        codeProgramme: this.state.CodeProgramme,
        codeDirection: this.state.CodeDirection,
        ObjetMission: this.state.ObjetMission,
        startDate: this.state.startDate,
        endDate: this.state.endDate,
        DateDepartMission: this.state.DateDepartMission,
        DateRetourMission: this.state.DateRetourMission,
        IdDirection: this.state.IdDirection,
        IdVehicule: this.state.vehicule,
        InitiateurOrdre: this.state.IdUtilisateur,
        UserValidateurDirecteur: this.state.OMAgentSignataire1Code,
        UserValidateurSG: 40075,
        ChefDeMission: chefMission ? chefMission.value : null,
        ChauffeurMission: ChauffeurMission ? ChauffeurMission.value : null,
        OMMinistre: 'Salifou OUEDRAOGO',
        OMProfilSignataire1: this.state.OMProfilSignataire1,
        OMAgentSignataire1: this.state.OMAgentSignataire1,
        OMProfilSignataire2: this.state.OMProfilSignataire2,
        OMAgentSignataire2: this.state.OMAgentSignataire2,
        OMDistinctionSignataire2: this.state.OMDistinctionSignataire2,
        lieux,
        membres,
        type_agent: this.state.type_agent,
        imputationsBudgetaires: this.state.imputationsBudgetaires,
        InterimSign1: this.state.interim1 ? 1 : 0,
        ProfilSignataire2: 40,
        NomSignataire1: this.state.OMAgentSignataire1Agent,
        NomSignataire2: 76855,
        NomInterimSignataire1: this.state.NomInterimSignataire1,
        NomInterimSignataire2: this.state.NomInterimSignataire2,
        InterimSign2: this.state.interim2 ? 1 : 0,
        ParOrdreSign1: this.state.parOrdre1 ? 1 : 0,
        ParOrdreSign2: this.state.parOrdre2 ? 1 : 0,
      }
      console.log('data', data);
      const respose = await this.props.createMission(data);

      console.log('respose.message', respose.message);
      console.log('respose', respose);
      if (respose.message === "Success") {
        this.setState({
          showSuccess: true
        });
        const user_id = this.props.authUser.IdUtilisateur;
        await this.props.getUsernotis(user_id);
        this.setState({
          loading: false
        });
        this.props.notyService.notif('Votre Mission a été créée avec Succès ', 'success');
        this.props.history.push('/missions');
      } else {
        this.setState({
          loading: false,
          showError: true
        });
        this.props.notyService.notif(`${respose.message}`, 'error');

      }
    }
  }

  goToMissions = async (event) => {
    this.props.history.push('/missions');
  }

  ajouterRubrique = async (event) => {
    Swal.fire({
      title: 'Nom de la Rubrique',
      input: 'text',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,

      inputValidator: (value) => {
        if (!value) {
          return 'Veuillez saisir la rubrique '
        }
      },
      confirmButtonText: 'Ajouter',
      confirmButtonColor: 'green',
      cancelButtonText: "Annuler",
      cancelButtonColor: "red",
      showCloseButton: true,
      showLoaderOnConfirm: true,
      preConfirm: async (rubrique) => {
        const reponse = await this.props.createRubrique(rubrique);
        if (reponse.statusMsg === "Success") {
          const rubriques = await this.props.getRubriques();
          this.setState({ rubriques });
          Swal.fire({
            title: "Ajouté avec Succès",
          });
        }
        else {
          Swal.fire({
            icon: 'error',
            title: `${reponse.statusMsg}`,
          });
        }
      },
      allowOutsideClick: () => !Swal.isLoading()
    })

    // const ipAPI = '//api.ipify.org?format=json';
    // Swal.queue([{
    //   title: 'Your public IP',
    //   confirmButtonText: 'Show my public IP',
    //   text:
    //     'Your public IP will be received ' +
    //     'via AJAX request',
    //   showLoaderOnConfirm: true,
    //   preConfirm: () => {
    //     return fetch(ipAPI)
    //       .then(response => response.json())
    //       .then(data => Swal.insertQueueStep(data.ip))
    //       .catch(() => {
    //         Swal.insertQueueStep({
    //           icon: 'error',
    //           title: 'Unable to get your public IP'
    //         })
    //       })
    //   }
    // }]);

    // Swal.fire({
    //   title: 'Are you sure?',
    //   text: 'User will have Admin Privileges',
    //   icon: 'warning',
    //   showCancelButton: true,
    //   confirmButtonColor: '#3085d6',
    //   cancelButtonColor: '#d33',
    //   confirmButtonText: 'Yes!'
    // }).then((result) => {
    //   if (result.value) {
    //     this.props.submitUser(this.state)
    //   }
    // })
  }

  render() {

    const options = [
      { value: 'chocolate', label: 'Chocolate' },
      { value: 'strawberry', label: 'Strawberry' },
      { value: 'vanilla', label: 'Vanilla' }
    ];

    let lieuxMissions = [];
    let vehicules = [];
    this.state.transports.map(vehicule => (
      vehicules.push({
        value: vehicule.IdVehicule,
        label: vehicule.ImmatriculationVeh,
      })
    ));

    let allAgents = [];
    if (this.state.allAgents.length) {
      this.state.allAgents.map(agent => (
        allAgents.push({
          value: agent.IdAgent,
          label: agent.NomAgent,
          MatriculeAgent: agent.MatriculeAgent,
          CodeDirection: agent.direction ? agent.direction.CodeDirection : '',
          ChefMission: 0,
          ChauffeurMission: 0,
        })
      ));
    }

    let regions = [];
    let provinces = [];
    let communes = [];

    if (this.state.regions.length) {
      this.state.regions.map(region => (
        regions.push(
          { value: region.IdRegion, label: region.Region }
        ),
        region.provinces.map(province => (
          provinces.push(
            { value: province.IdProvince, label: province.Province, region: province.IdRegion }
          ),
          province.communes.map(commune => (
            communes.push(
              { value: commune.IdCommune, label: commune.Commune, province: commune.IdProvince }
            )
          ))
        ))
      ))
    }
    const filteredOptions = provinces.filter((o) => o.region === this.state.selectedRegion.value);
    const filteredOptions2 = communes.filter((o) => o.province === this.state.selectedProvince.value);


    let financements = [];

    if (this.state.financements.length) {
      this.state.financements.map(financement => (
        financements.push(
          {
            IdDirection: financement.IdDirection,
            value: financement.IdDirection,
            label: financement.CodeDirection,
            financement,
            respIdAgent: financement.Responsable ? financement.Responsable.IdAgent : null,
            respNomAgent: financement.Responsable ? financement.Responsable.NomAgent : null,
            profil: financement.profil ? financement.profil : '',
            programme: financement.programme ? financement.programme : '',
            Responsable: financement.Responsable ? financement.Responsable : '',
          }
        )
      ))
    }

    moment.locale('fr', fr);
    return (
      <div>
        <AsideMissions />
        {
          this.state.loading && <Spinner />
        }
        { (!this.state.loading) &&
          <div>
            <div className="contents">
              <div className="container-fluid">
                <div className="row">
                  <div className="col-lg-12">
                    <div className="breadcrumb-main application-ui mb-30">
                      <div className="breadcrumb-action d-flex">
                        <div className="d-flex align-items-center user-member__title mr-sm-25 mr-0">
                          <h4 className="text-capitalize fw-500 breadcrumb-title"> Saisir Une Novelle Mission</h4>
                        </div>
                      </div>
                      <div className="d-flex  text-capitalize">

                        <button type="submit" onClick={this.creerMission} className="breadcrumb-edit border-0  content-center bg-primary fs-12 fw-500 ml-10 radius-md text-white">
                          <i className="fas fa-paper-plane m-1"> </i>
                                Enregistrer
                        </button>
                      </div>
                    </div>
                  </div>
                  <form className="row col-lg-12" action="#">
                    <div className="col-lg-12 card box">
                      <div className="card-horizontal card-default mb-4">
                        <div className="card-header">
                          <h6>Details de la Mission</h6>
                        </div>
                        <div className="card-body">
                          <div className="horizontal-form">
                            <div className="form-group row">
                              <div className="col-sm-3 d-flex aling-items-center">
                                <label className=" col-form-label color-dark fs-14 fw-500 align-center">Structure</label>
                              </div>
                              <div className="col-sm-9">
                                <Select
                                  options={options}
                                  defaultValue="dsi"
                                  placeholder={this.state.CodeDirection}
                                  isDisabled={true}
                                />
                                <input type="text" name="objet" className="form-control  ih-medium ip-gray radius-xs b-light mt-1" value={this.state.programme} disabled />
                              </div>
                            </div>
                            <div className="form-group row">
                              <div className="col-sm-3 d-flex aling-items-center">
                                <label className=" col-form-label color-dark fs-14 fw-500 align-center">Direction Technique</label>
                              </div>
                              <div className="col-sm-9">
                                <Select options={options}
                                  isDisabled={true}
                                />

                              </div>
                            </div>
                            <div className="form-group row">
                              <div className="col-sm-3 d-flex aling-items-center">
                                <label className="col-form-label color-dark fs-14 fw-500 align-center">
                                  Objet
                                  </label>
                              </div>
                              <div className="col-sm-9">
                                <input type="text" name="ObjetMission" className="form-control  ih-medium ip-gray radius-xs b-light" onChange={this.handleInputChange} required />
                              </div>
                            </div>
                            <div className="form-group row mb-3">
                              <div className="col-sm-3">
                                <label className="col-form-label  color-dark fs-14 fw-500 align-center">Depart</label>
                              </div>
                              <div className="col-sm-9">
                                <DateRangePicker
                                  startDate={this.state.startDate}
                                  startDateId="start_date_id"
                                  endDate={this.state.endDate}
                                  endDateId="end_date_id"
                                  required={true}
                                  hideKeyboardShortcutsPanel={true}
                                  locale={fr}
                                  startDatePlaceholderText="Date de Depart"
                                  endDatePlaceholderText="Date de Retour"
                                  onDatesChange={({ startDate, endDate }) => this.hundleDateChange(startDate, endDate)}
                                  focusedInput={this.state.focusedInput}
                                  onFocusChange={(focusedInput) => this.setState({ focusedInput })} />

                              </div>
                            </div>
                            <div className="form-group row">
                              <div className="col-sm-3 d-flex aling-items-center">
                                <label className=" col-form-label color-dark fs-14 fw-500 align-center">Transport</label>
                              </div>
                              <div className="col-sm-9">
                                <Select options={vehicules}
                                  onChange={this.handleSelectVehicule}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-12 card box">
                      <div className="card-horizontal card-default mb-4">
                        <div className="card-header">
                          <h6>Lieu(x) de la Mission</h6>
                        </div>
                        <div className="card-body">
                          <div className="horizontal-form">

                            <div className="row">
                              <div className="col-md-3 mb-25">
                                <Select
                                  key={`my_unique_select_key__${this.state.selectedRegion.value}`}
                                  name="form-field-name"
                                  value={this.state.selectedRegion.value}
                                  onChange={this.handleChange1}
                                  options={regions}
                                  placeholder={this.state.selectedRegion ? this.state.selectedRegion.label : "Region"}
                                />
                              </div>
                              <div className="col-md-3 mb-25">
                                <Select
                                  key={`my_unique_select_key__${this.state.selectedProvince.value}`}
                                  name="form-field-name"
                                  value={this.state.selectedProvince ? this.state.selectedProvince.value : '-' || ''}
                                  onChange={this.handleChange2}
                                  options={filteredOptions}
                                  placeholder={this.state.selectedProvince ? this.state.selectedProvince.label : "Province"}
                                />
                              </div>
                              <div className="col-md-3 mb-25">
                                <Select
                                  key={`my_unique_select_key__${this.state.selectedCommune.value}`}
                                  name="form-field-name"
                                  value={this.state.selectedCommune ? this.state.selectedCommune.value : '-'}
                                  onChange={this.handleChange3}
                                  options={filteredOptions2}
                                  placeholder={this.state.selectedCommune ? this.state.selectedCommune.label : "Commune"}
                                />
                              </div>
                              <div className="col-md-3 mb-25">
                                <button disabled={!this.state.addLieu} onClick={this.ajouterLieu} type="button" className="breadcrumb-edit border-0  content-center bg-primary fs-12 fw-500 ml-10 radius-md text-white">
                                  <i className="fas fa-plus m-1"> </i>Ajouter
                                </button>
                              </div>
                            </div>
                            <div className="userDatatable global-shadow border bg-white radius-xl">
                              <div className="table-responsive">
                                <table className="table mb-0 table-borderless">
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
                                    {
                                      this.state.lieuxMissions.length ? this.state.lieuxMissions.map((lieu, index) => {
                                        //  console.log('this.state.lieuxMissions', this.state.lieuxMissions);
                                        //  console.log('lieu', lieu);
                                        return lieu && (
                                          <tr>
                                            <td>
                                              <div className="userDatatable-content">{lieu.region ? lieu.region.label : '-'}</div>
                                            </td>
                                            <td>
                                              <div className="userDatatable-content">{lieu.province ? lieu.province.label : '-'}</div>
                                            </td>
                                            <td>
                                              <div className="userDatatable-content">{lieu.commune ? lieu.commune.label : '-'}</div>
                                            </td>
                                            <td>
                                              <button onClick={() => { this.removeLieu(index) }} type="button" class="btn btn-icon btn-circle">
                                                <i className="fas fa-trash text-danger"></i>
                                              </button>
                                            </td>
                                          </tr>
                                        )

                                      })
                                        :
                                        <tr>
                                          <td>
                                            <div className="userDatatable-content">-</div>
                                          </td>
                                          <td>
                                            <div className="userDatatable-content">-</div>
                                          </td>
                                          <td>
                                            <div className="userDatatable-content">-</div>
                                          </td>
                                        </tr>
                                    }
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-12 card box">
                      <div className="card-horizontal card-default mb-4">
                        <div className="card-header">
                          <h6>Membres de la Mission</h6>
                        </div>
                        <div className="card-body">
                          <div className="horizontal-form">

                            <div className="row">
                              <div className="col-md-9 mb-25">
                                <WindowedSelect
                                  options={allAgents}
                                  value={this.state.selectedMembre}
                                  isClearable={true}
                                  placeholder={"Membre"}
                                  onChange={this.handleChangeMembre}
                                />
                              </div>
                              <div className="col-md-3 mb-25">
                                <button disabled={!this.state.addMembre} onClick={this.ajouterMembre} type="button" className="breadcrumb-edit border-0  content-center bg-primary fs-12 fw-500 ml-10 radius-md text-white">
                                  <i className="fas fa-plus m-1"> </i>Ajouter
                                </button>
                              </div>
                            </div>
                            <div className="userDatatable global-shadow border bg-white radius-xl">
                              <div className="table-responsive">
                                <table className="table mb-0 table-striped table-hover">
                                  <thead>
                                    <tr className="userDatatable-header">
                                      <th>
                                        <span className="userDatatable-title">Nom et Prenom(s)</span>
                                      </th>
                                      <th>
                                        <span className="userDatatable-title">Matricule</span>
                                      </th>
                                      <th>
                                        <span className="userDatatable-title">Structure Interne</span>
                                      </th>
                                      <th>
                                        <span className="userDatatable-title">Action</span>
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {this.state.membresMissions.length ? this.state.membresMissions.map((membre, index) => {
                                      return membre && (
                                        <tr>
                                          <td>
                                            <div className="userDatatable-content row col-md-12"><div className="col-md-6 mr-2">{membre.NomAgent}</div> <div className="ml-1 col-md-4">{this.renderStatus(membre.ChefMission, membre.ChauffeurMission)}</div> </div>
                                          </td>
                                          <td>
                                            <div className="userDatatable-content">{membre.MatriculeAgent}</div>
                                          </td>
                                          <td>
                                            <div className="userDatatable-content">{membre.CodeDirection}</div>
                                          </td>

                                          <td>
                                            <button onClick={() => { this.removeMembre(index) }} type="button" class="btn btn-icon btn-circle">
                                              <i className="fas fa-trash text-danger"></i>
                                            </button>
                                          </td>
                                        </tr>
                                      )
                                    }) :
                                      <tr>
                                        <td>
                                          <div className="userDatatable-content">-</div>
                                        </td>
                                        <td>
                                          <div className="userDatatable-content">-</div>
                                        </td>
                                        <td>
                                          <div className="userDatatable-content">-</div>
                                        </td>
                                        <td>
                                          <div className="userDatatable-content">-</div>
                                        </td>
                                      </tr>
                                    }
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                          <div className="row mt-4 col-md-12">
                            <div className="col-md-6">
                              <div className="horizontal-form">
                                <div className="form-group row">
                                  <div className="col-sm-3">
                                    <label className=" col-form-label color-dark fs-14 align-left">Chef de Mission</label>
                                  </div>
                                  <div className="col-sm-7">
                                    <Select
                                      styles={{
                                        menu: provided => ({ ...provided, zIndex: 9999 })
                                      }}
                                      name="form-field-name"
                                      value={this.state.selectedChef.value}
                                      onChange={this.handleSetChef}
                                      options={this.state.membresMissions}
                                    />
                                  </div>
                                  <div className="col-sm-1 float-left mb-2">
                                    <button onClick={this.removeChef} type="button" class="btn btn-icon btn-circle">
                                      <i className="fas fa-trash text-danger"></i>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="horizontal-form">
                                <div className="form-group row">
                                  <div className="col-sm-3">
                                    <label className=" col-form-label color-dark fs-14 align-left">Chauffeur</label>
                                  </div>
                                  <div className="col-sm-7">
                                    <Select
                                      styles={{

                                        menu: provided => ({ ...provided, zIndex: 9999 })
                                      }}
                                      name="form-field-name"

                                      value={this.state.selectedChauffeur.value}
                                      onChange={this.handleSetChauffeur}
                                      options={this.state.membresMissions}
                                    />
                                  </div>
                                  <div className="col-sm-1 float-left mb-2">
                                    <button onClick={this.removeChauffeur} type="button" class="btn btn-icon btn-circle">
                                      <i className="fas fa-trash text-danger"></i>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-12 card box mb-25">
                      {/* <div className="col-lg-5 box">
                        <div className="card card-horizontal card-default">
                          <div className="card-header">
                            <h6>Pieces Justificatives</h6>
                          </div>
                          <div className="card-body">
                            <div className>
                              <div className="atbd-upload">
                                <div className="atbd-upload-avatar media-import">
                                  <span data-feather="upload" />
                                  <p className="color-dark fs-20">Drop File or <a href="#">Browse</a></p>
                                </div>
                                <div className="avatar-up">
                                  <input type="file" name="upload-avatar-input" className="upload-avatar-input" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div> */}
                      <div className="col-lg-12">
                        <div className="card card-horizontal card-default mb-4">
                          <div className="card-header">
                            <h6>Source de Financement</h6>
                          </div>
                          <div className="card-body">
                            <div className="horizontal-form">

                              <div className="row">
                                <div className="col-md-6 mb-2">
                                  <button class="btn btn-info btn-default btn-squared btn-transparent-info " onClick={this.ajouterRubrique}> Ajouter Rubrique </button>
                                </div>
                                <div className="col-md-6 mb-2">
                                  <a href="#"> Ajouter Source </a>
                                </div>
                              </div>
                              {this.state.showRubriqueForm && <div className="col-lg-6 text-center">
                                <div className="card card-horizontal box card-default card-md mb-4">
                                  <div className="card-header text-center">
                                    <h6>Ajouter une Rubrique</h6>
                                  </div>
                                  <div className="card-body">
                                    <div className="horizontal-form">
                                      <form action="#">
                                        <div className="form-group row">
                                          <div className="col-sm-12">
                                            <input type="text" className="form-control ih-medium ip-gray radius-xs b-light" id="inputName" placeholder="Nom de la Rubrique" />
                                          </div>
                                          <div className="col-sm-12 m-30">
                                            <div class="layout-button col text-center">
                                              <button type="button" className="btn btn-sm btn-danger  bg-danger">Annuler</button>
                                              <button className="btn btn-default btn-primary">Ajouter</button>
                                            </div>
                                          </div>
                                        </div>

                                      </form>
                                    </div>
                                  </div>
                                </div>
                              </div>}


                              <div className="userDatatable global-shadow border bg-white radius-xl">
                                <div className="table-responsive#">
                                  <table className="table mb-0 table-borderless">
                                    <thead>
                                      <tr className="userDatatable-header">
                                        <th>
                                          <span className="userDatatable-title">Rubrique Financement</span>
                                        </th>
                                        <th>
                                          <span className="userDatatable-title">Source Financement</span>
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {this.state.rubriques.length && this.state.rubriques.map((rubrique, index) => (
                                        <tr>
                                          <td>
                                            <div className="userDatatable-content">{rubrique.LibelleImputation}</div>
                                          </td>
                                          <td>
                                            <div className="userDatatable-content">
                                              <Select
                                                name={'form-field-name' + index}
                                                id={index}
                                                key={`my_unique_select_key__${index}`}
                                                value={this.state.selectedChauffeur.value}
                                                onChange={this.handleChangeFinance.bind(this, rubrique)}
                                                options={financements}
                                              />
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
                      </div>
                    </div>
                    <div className="col-lg-12 card box">
                      <div className="card-horizontal card-default mb-4">
                        <div className="card-header">
                          <h6>Signataire 1</h6>
                        </div>
                        <div className="card-body">
                          <div className="horizontal-form">

                            <div className="form-group row">
                              <div className="col-sm-2 d-flex aling-items-center">
                                <label className="col-form-label color-dark fs-14 fw-500 align-center">
                                  Profil
                                </label>
                              </div>
                              <div className="col-sm-10">
                                <input type="text" name="OMProfilSignataire1" value={this.state.OMProfilSignataire1} className="form-control  ih-medium ip-gray radius-xs b-light" required />
                              </div>
                            </div>
                            <div className="form-group row">
                              <div className="col-sm-2 d-flex aling-items-center">
                                <label className="col-form-label color-dark fs-14 fw-500 align-center">
                                  Signataire
                                </label>
                              </div>
                              <div className="col-sm-10">
                                <input type="text" name="OMAgentSignataire1" value={this.state.OMAgentSignataire1} className="form-control  ih-medium ip-gray radius-xs b-light" required />
                              </div>
                            </div>
                            <div className="form-group row">
                              <div className="col-sm-3 offset-md-3 d-flex aling-items-center">
                                <div className="checkbox-theme-default custom-checkbox checkbox-group__single float-right">
                                  <input name="interim1" checked={this.state.interim1} value={this.state.interim1} onChange={this.handleInterim1} className="checkbox" type="checkbox" id="interim1" />
                                  <label htmlFor="interim1">
                                    <span className="checkbox-text">Interim</span>
                                  </label>
                                </div>
                              </div>
                              <div className="col-sm-3">
                                <div className="checkbox-theme-default custom-checkbox checkbox-group__single float-left">
                                  <input id="parOrdre1" checked={this.state.parOrdre1} name="parOrdre1" onChange={this.handleParOrdre1} value={this.state.parOrdre1} className="checkbox" type="checkbox" />
                                  <label htmlFor="parOrdre1">
                                    <span className="checkbox-text">Par Ordre</span>
                                  </label>
                                </div>
                              </div>
                            </div>
                            <div className="form-group row">
                              <div className="col-sm-2 d-flex aling-items-center">
                                <label className="col-form-label color-dark fs-14 fw-500 align-center">
                                  Signataire
                                </label>
                              </div>
                              <div className="col-sm-10">
                                <input type="text" name="NomInterimSignataire1" value={this.NomInterimSignataire1} disabled={this.state.disabledSignatire1} className="form-control  ih-medium ip-gray radius-xs b-light" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-12 card box">
                      <div className="card-horizontal card-default mb-4">
                        <div className="card-header">
                          <h6>Signataire 2</h6>
                        </div>
                        <div className="card-body">
                          <div className="horizontal-form">

                            <div className="form-group row">
                              <div className="col-sm-2 d-flex aling-items-center">
                                <label className="col-form-label color-dark fs-14 fw-500 align-center">
                                  Profil
                                  </label>
                              </div>
                              <div className="col-sm-10">
                                <input type="text" name="profilSignatire2" value={this.state.OMProfilSignataire2} className="form-control  ih-medium ip-gray radius-xs b-light" required />
                              </div>
                            </div>
                            <div className="form-group row">
                              <div className="col-sm-2 d-flex aling-items-center">
                                <label className="col-form-label color-dark fs-14 fw-500 align-center">
                                  Signataire
                                </label>
                              </div>
                              <div className="col-sm-10">
                                <input type="text" name="OMAgentSignataire2" value={this.state.OMAgentSignataire2} className="form-control  ih-medium ip-gray radius-xs b-light" required />
                              </div>
                            </div>
                            <div className="form-group row">
                              <div className="col-sm-3 offset-md-3 d-flex aling-items-center">
                                <div className="checkbox-theme-default custom-checkbox checkbox-group__single float-right">
                                  <input id="interim2" checked={this.state.interim2} name="interim2" value={this.state.interim2} onChange={this.handleInterim2} className="checkbox" type="checkbox" />
                                  <label htmlFor="interim2">
                                    <span className="checkbox-text">Interim</span>
                                  </label>
                                </div>
                              </div>
                              <div className="col-sm-3">
                                <div className="checkbox-theme-default custom-checkbox checkbox-group__single float-left">
                                  <input id="parOrdre2" checked={this.state.parOrdre2} name="parOrdre2" value={this.state.parOrdre2} onChange={this.handleParOrdre2} className="checkbox" type="checkbox" />
                                  <label htmlFor="parOrdre2">
                                    <span className="checkbox-text">Par Ordre</span>
                                  </label>
                                </div>
                              </div>
                            </div>
                            <div className="form-group row">
                              <div className="col-sm-2 d-flex aling-items-center">
                                <label className="col-form-label color-dark fs-14 fw-500 align-center">
                                  Signataire
                                </label>
                              </div>
                              <div className="col-sm-10">
                                <input type="text" name="NomInterimSignataire2" value={this.NomInterimSignataire2} disabled={this.state.disabledSignatire2} className="form-control  ih-medium ip-gray radius-xs b-light" />
                              </div>
                            </div>
                            <div class="form-group row">
                              <div class="col-sm-12">
                                <div class="layout-button mt-25">
                                  <button type="submit" onClick={this.creerMission} className="btn btn-lg btn-primary btn-submit">
                                    <i className="fas fa-paper-plane m-1"> </i>
                                    Enregistrer
                                  </button>
                                  <button type="button" onClick={this.goToMissions} class="btn btn-default btn-squared border-normal bg-danger px-20 text-white ">Annuler</button>

                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div >
        }
      </div>
    );
  }

}

export default CreateMission;