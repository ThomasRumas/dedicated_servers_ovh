import React from 'react'; 
import PropTypes from 'prop-types';

import Price from '../prices/prices'; 

const Dropdown = ({ item }) => (
    <option data-code={item.code} data-price={item.price.value} value={item.code} data-disk={item.options}>
      {item.name} <Price price={item.price.value} billing="month" value={true} currency={item.price.currencyCode}/>  
    </option>
)

Dropdown.propTypes = {
    item: PropTypes.object.isRequired
}

export default Dropdown; 