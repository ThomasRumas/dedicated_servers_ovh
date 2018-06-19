import React, {Component} from 'react';
import PropTypes from 'prop-types';

class Buttons extends Component {
    constructor(props) {
        super(props); 
    }

    render(){
        return (
            <a className="btn btn-primary" href={this.props.href}>{this.props.text}</a>
        );
    }
}

Buttons.propTypes = {
    href: PropTypes.string.isRequired, 
    text: PropTypes.string.isRequired
}

export default Buttons; 