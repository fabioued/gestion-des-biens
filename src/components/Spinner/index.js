import Loader from 'react-loader-spinner';


const Spinner = () => {
  const styleLoader = { position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)" };
  return <Loader type="TailSpin" color="#018c3b" height="100" width="100" style={styleLoader} />
};

export default Spinner;