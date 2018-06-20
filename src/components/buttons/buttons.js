import React, {Component} from 'react';
import PropTypes from 'prop-types';

class Buttons extends Component {
    constructor(props) {
        super(props); 
        this.state = {
            href: this.props.href
        }
    }

    render(){
        if (this.props.href != this.state.href){
            this.setState({href : this.props.href}) //update data from parent if they are different
        } 
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