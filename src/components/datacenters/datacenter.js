import React from 'react'; 
import PropTypes from 'prop-types';

const Datacenter = ({ datacenter }) => (
    <li>{generateDatacenter(datacenter)}</li>
)

function generateDatacenter(prmDatacenter) {
    var datacenter = ""; 
    switch (prmDatacenter) {
        case 'bhs' : 
            datacenter = "Beauharnois"; 
            break; 
        case 'rbx' : 
            datacenter = "Roubaix"; 
            break; 
        default : 
            datacenter = prmDatacenter; 
            break; 
    }
    return datacenter;
}

Datacenter.propTypes = {
  datacenter: PropTypes.string.isRequired
}

export default Datacenter;