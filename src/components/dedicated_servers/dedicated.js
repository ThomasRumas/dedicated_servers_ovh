import React, { Component } from 'react';
import _ from 'lodash'; 
import $ from 'jquery'; 
import JSURL from 'jsurl'; 
//import PropTypes from 'prop-types';

import Datacenter from '../datacenters/datacenter'; 
import Dropdown from '../dropdown/dropdown'; 
import Price from '../prices/prices'; 
import Buttons from '../buttons/buttons'; 

//import './dedicated.css'; 

class Dedicateds extends Component {
    state = {
        error: null, 
        isLoaded: false, 
        items: []
    };

    constructor(props) {
        super(props);
    }

    //See the React doc about this function but it's needed if you want to make AJAX request or prepare your component before it's rendering
    componentDidMount() {
        fetch("https://www.ovh.com/engine/api/order/catalog/formatted/dedicated?ovhSubsidiary=FR")
          .then(res => res.json())
          .then(
            (result) => {
              this.setState({
                isLoaded: true,
                items: result
              });
            },
            // Note: it's important to handle errors here
            // instead of a catch() block so that we don't swallow
            // exceptions from actual bugs in components.
            (error) => {
              this.setState({
                isLoaded: true,
                error
              });
            }
          )
    }
    
    render() {
        const { error, isLoaded, items } = this.state;
        if (error) {
            return <div>Error: {error.message}</div>;
        //When Ajax request isn't finished, show a loading message
        } else if (!isLoaded) {   
            return <div>Loading...</div>;
        } else {    
            return (
            <div className="container">
                <div className="row">
                    {items.products.map((item, index) =>  
                    <React.Fragment key={item.code}>
                        <div className="border col-12 col-sm-12 col-md-6 col-lg-3 center mb-4">
                            {(!_.isEmpty(item.specifications.cpu) && item.family != "hardzone" && !_.isEmpty(item.specifications.disks[0])) && <Dedicated item={item} key={item.code}/>} 
                        </div>
                        {(index + 1) % 4 == 0 && <div className="w-100"></div>}                        
                    </React.Fragment>
                    )}
                </div>
            </div>
            );
        }
    }
}

export default Dedicateds;

class Dedicated extends Component {

    state = {
        price: 0, 
        orderUrl: null
    }

    constructor(props) {
        super(props); 
        this.state.price = this.props.item.prices.default.renew.value; 
        this.state.orderUrl = this.generateOrderUrl(this.props.item.code); 

        //To bind this selector to function and have access to state from the class 
        this.handleDiskSelector = this.handleDiskSelector.bind(this); 
        this.handleBandwithSelector = this.handleBandwithSelector.bind(this);
        this.handleVrackSelector = this.handleBandwithSelector.bind(this);
    }

    handleVrackSelector(e) {
        //Get dedicatedInformation
        let dedicatedInformation = JSON.parse($(e.target).parents('div.dedicatedServerPad').attr('data-information')); 
        
        let selectedOption = e.target.children[_.findIndex(e.target.children, (option) => option.dataset.code == e.target.value)]; 

        //Set dedicatedInformation
        dedicatedInformation.price.vRackPrice = parseFloat(selectedOption.dataset.price); 
        dedicatedInformation.option.vRack = selectedOption.dataset.code; 

        //Update information on DOM
        $(e.target).parents('div.dedicatedServerPad').attr('data-information', JSON.stringify(dedicatedInformation));       

        //Update the price and send only the value of obj dedicatedInformation.price 
        this.setState({price : this.generatePrice(Object.values(dedicatedInformation.price))}); 
        this.setState({orderUrl: this.generateOrderUrl(dedicatedInformation.code, dedicatedInformation.option)});
    }

    handleBandwithSelector(e) {
        //Get dedicatedInformation
        let dedicatedInformation = JSON.parse($(e.target).parents('div.dedicatedServerPad').attr('data-information')); 
        
        let selectedOption = e.target.children[_.findIndex(e.target.children, (option) => option.dataset.code == e.target.value)]; 

        //Set dedicatedInformation
        dedicatedInformation.price.bandwithPrice = parseFloat(selectedOption.dataset.price); 
        dedicatedInformation.option.bandwidth = selectedOption.dataset.code; 

        //Update information on DOM
        $(e.target).parents('div.dedicatedServerPad').attr('data-information', JSON.stringify(dedicatedInformation));       

        //Update the price and send only the value of obj dedicatedInformation.price 
        this.setState({price : this.generatePrice(Object.values(dedicatedInformation.price))}); 
        this.setState({orderUrl: this.generateOrderUrl(dedicatedInformation.code, dedicatedInformation.option)});
    }

    handleDiskSelector(e) { 
        //Get dedicatedInformation
        let dedicatedInformation = JSON.parse($(e.target).parents('div.dedicatedServerPad').attr('data-information')); 
        
        let selectedOption = e.target.children[_.findIndex(e.target.children, (option) => option.dataset.code == e.target.value)]; 

        //Set dedicatedInformation
        dedicatedInformation.code = selectedOption.dataset.code; 
        dedicatedInformation.price.diskPrice = parseFloat(selectedOption.dataset.price); 
        dedicatedInformation.option.disk = typeof selectedOption.dataset.disk !== 'undefined' ? selectedOption.dataset.disk : ''; 

        //Update information on DOM
        $(e.target).parents('div.dedicatedServerPad').attr('data-information', JSON.stringify(dedicatedInformation));       

        //Update the price and send only the value of obj dedicatedInformation.price 
        this.setState({price : this.generatePrice(Object.values(dedicatedInformation.price))}); 
        this.setState({orderUrl: this.generateOrderUrl(dedicatedInformation.code, dedicatedInformation.option)}); 

    }

    generateOrderUrl(prmRef, prmObjOptions = null) {
        var link = {
          planCode: prmRef,
          option: [],
          configuration: []
        };

        if(prmObjOptions !== null) {
            if (prmObjOptions.disk != '') {
                var diskObject = {
                  planCode: prmObjOptions.disk,
                  family: 'storage'
                };
                link.option.push(diskObject);
            };
    
            if (prmObjOptions.vRack != '') {
                var vRackObject = {
                  planCode: prmObjOptions.vRack,
                  family: 'vrack'
                };
                link.option.push(vRackObject);
            };
    
            if (prmObjOptions.bandwidth != '') {
                var bandwithObject = {
                  planCode: prmObjOptions.bandwidth,
                  family: 'network'
                };
                link.option.push(bandwithObject);
            };
        }

        return link = "https://www.ovh.com/fr/order/dedicated/#/legacy/dedicated?product=" + JSURL.stringify(link);

      }

    generatePrice(arrayPrice) {
        var totalPrice = 0; 
        arrayPrice.forEach(price => {
            totalPrice += parseFloat(price);            
        });
        return totalPrice; 
    }

    generateCpu(prmCores, prmThreads, prmBrand, prmModel, prmFrequency, prmBoost) {
        return `${prmBrand} ${prmModel} - ${prmCores}c/${prmThreads}t - ${prmFrequency}GHz/${prmBoost}GHz`; 
    }

    generateDisk(prmRaid, prmNumber, prmType, prmSize) {
        const raid = (prmRaid == "mb") ? "SoftRaid" : "HardRaid"; 
        const size = (prmSize / 1000 >= 1) ? prmSize / 1000 + "TB" : prmSize + "GB"; 
        return `${raid} ${prmNumber}x${size} ${prmType}`; 
    }

    generateNetwork(prmValue) {
        const value = prmValue / 1000000 >= 1 ? prmValue / 1000000 + "Gbps" : prmValue / 1000 + "Mbps"; 
        return value; 
    }

    render() {
        /* Test if we have the specifications from the item to generate dedicated server pad */
        //if(!_.isEmpty(item.specifications.cpu) && item.family != "hardzone" && !_.isEmpty(item.specifications.disks[0])) { 
            var objDedicatedInformation = {
                code: this.props.item.code, 
                cpuBenchmark: this.props.item.specifications.cpu.cores, 
                ramCapacity: this.props.item.specifications.memory.size, 
                price: {
                    basePrice: this.props.item.prices.default.renew.value, 
                    diskPrice: 0, 
                    vRackPrice: 0, 
                    bandwidthPrice: 0
                }, 
                option: {
                    disk: '',
                    vRack: '', 
                    bandwidth: ''
                },
                vRack: this.props.item.specifications.network.privateBandwidth > 0 ? true : false 
            }
            return(
                <div className="dedicatedServerPad" data-information={JSON.stringify(objDedicatedInformation)}>
                    <h2 className="text-center py-4">{this.props.item.invoiceName}</h2>
                    <div className="py-2  text-center">
                        {this.generateCpu(this.props.item.specifications.cpu.cores, this.props.item.specifications.cpu.threads, this.props.item.specifications.cpu.brand, this.props.item.specifications.cpu.model, 
                        this.props.item.specifications.cpu.frequency, this.props.item.specifications.cpu.boost)}
                    </div>
                    <div className="py-2 text-center">{this.props.item.specifications.memory.type}</div>
                    <div className="py-4">
                        <h5 className="text-center">Disks : </h5>
                        <select onChange={this.handleDiskSelector} className="diskSelector">
                            <option data-code={this.props.item.code} data-price={0} value={this.props.item.code}>
                                {this.generateDisk(this.props.item.specifications.disks[0].raid, this.props.item.specifications.disks[0].number, this.props.item.specifications.disks[0].type
                                    ,this.props.item.specifications.disks[0].size)}
                            </option>
                            {this.props.item.derivatives.map((derivative) => 
                                <Dropdown item={derivative} key={derivative.code}/>
                            )}
                        </select>
                    </div>
                    <div className="py-4 datacenters">
                        <h5 className="text-center">Datacenters :</h5>
                        <ul>
                            {this.props.item.datacenters.map((datacenter, index) => 
                                <Datacenter datacenter={datacenter} key={index}/>
                            )}
                        </ul>
                    </div>
                    <div className="py-4 text-center">
                        <h5>Bandwith :</h5>
                        {
                            //Test if we have network option, generate dropdown else call generateNetwork function 
                            this.props.item.addonsFamily[_.findIndex(this.props.item.addonsFamily, {'family' : 'network'})] ? (
                            <select className="bandwithSelector" onChange={this.handleBandwithSelector}>
                                {
                                    //Because result is an obj with addons array on it
                                    this.props.item.addonsFamily[_.findIndex(this.props.item.addonsFamily, {'family' : 'network'})].addons.map((addon, index) => 
                                        <Dropdown item={addon} key={index}/>
                                    )
                                }
                            </select>
                        ) : (
                            this.generateNetwork(this.props.item.specifications.network.outgoing)
                        )}
                    </div>
                    <div className="py-4 text-center">
                        <h5>vRack :</h5>
                        {
                            //Test if we have vrack option, generate dropdown else call generateNetwork function 
                            this.props.item.addonsFamily[_.findIndex(this.props.item.addonsFamily, {'family' : 'vrack'})] ? (
                            <select className="vrackSelector" onChange={this.handleVrackSelector}>
                                {
                                    //Because result is an obj with addons array on it
                                    this.props.item.addonsFamily[_.findIndex(this.props.item.addonsFamily, {'family' : 'vrack'})].addons.map((addon, index) => 
                                        <Dropdown item={addon} key={index}/>
                                    )
                                }
                            </select>
                        ) : (
                            this.generateNetwork(this.props.item.specifications.network.privateBandwidth)
                        )}
                    </div>
                    <h4 className="price py-4 text-center">
                        <Price price={this.state.price} billing="month" value={false} currency={this.props.item.prices.default.renew.currencyCode}/>
                    </h4>
                    <div className="text-center py-2">
                        <Buttons href={this.state.orderUrl} text="Order"/>
                    </div>
                </div>
            )
        //}
    }
}