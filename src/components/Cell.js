import React, {Component} from 'react';
import './App.css';

class Cell extends Component{
    render(){
        const { position, cellState } = this.props;
        return(
            <button 
                onClick={() => this.props.paintCell(position)} 
                className={`cell ${cellState}`}>
                </button>
        )
    }
}

export default Cell;