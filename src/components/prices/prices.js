import React, {Component} from 'react'; 
import PropTypes from 'prop-types';

class Price extends Component {

    constructor(props) {
        super(props);
        this.state = {
            price: this.props.price
        }; 
    }

    generateCurrency(prmCurrency) {
        var currency; 
        switch (prmCurrency) {
            case 'EUR':
                currency = '€'
                break; 
            default: 
                currency = prmCurrency; 
                break;                 
        }
        return currency; 
    }

    render() {
        const billing = this.props.billing == 'week' ? 'week' : 'month'; 
        if (this.props.price != this.state.price){
            this.setState({price : this.props.price}) //update data from parent if they are different
        } 
        if(this.props.value) {
            return this.state.price; 
        } else {
            return(
                <div>
                    <span className="valuePrice">{this.state.price}</span>
                    <span> {this.generateCurrency(this.props.currency)}/{billing}</span>
                </div>
            )
        }
    }
}

Price.propTypes = {
    price: PropTypes.number.isRequired, 
    billing: PropTypes.string.isRequired, 
    value: PropTypes.bool.isRequired, 
    currency: PropTypes.string.isRequired
}

export default Price; 