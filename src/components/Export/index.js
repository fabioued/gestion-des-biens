import React from 'react';
import jsPDF from 'jspdf'

class Export extends React.Component {

  constructor(props) {
    super(props)
    this.state = {}
  };

  generatePDF = () => {
    var doc = new jsPDF('p', 'pt');

    doc.text(20, 20, 'This is the first title.')

    //doc.setFont('helvetica')
    //doc.setFontType('normal')
    doc.text(20, 60, 'This is the second title.')

    // doc.setFont('helvetica')
    // doc.setFontType('normal')
    doc.text(20, 100, 'This is the thrid title.')


    doc.save('ETAT_OrdreMissionDEMO.pdf')
  }

  render() {
    return (
      <div>
        <button onClick={this.generatePDF} type="primary">Download PDF {this.props.type}</button>
      </div>
    );
  }
}

export default Export;