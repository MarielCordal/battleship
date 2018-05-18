import React, { Component } from 'react';
import './App.css';
import Cell from './Cell';

export  class Board extends Component {
 constructor(props){
    super(props);
    this.state = {
        grid: [],
        cpuShips:[],
        cpu: null,
        vertical: true,
        shipsAvailables : [4,3,3,3,2],
        shipsInBoard: [],
        playing: false,
    }
    this.availablePos = 0;
    this.showRotation = true;
 }

    resolveClass (x,y, hits = this.props.hits) {
        if (!hits || hits.length ===0) return 'empty'
        let hit = hits.filter((hit)=>hit.x === x && hit.y === y)[0];
        return hit ? hit.status : 'empty'
    }

    resolveClassEnemy (x,y) {
        let ship = this.props.allShips ? this.props.allShips.filter((hit)=>hit[0] === x && hit[1] === y)[0] : undefined;
        let shipStatus = ship ? 'ship' : 'empty';
        let hit = this.props.enemyHits ? this.props.enemyHits.filter((hit)=>hit.x === x && hit.y === y)[0] : undefined;
        return hit ? hit.status : shipStatus
    }

    paintCell = (position) => {
        let shipsInBoard = [];
        if (this.props.gameView === 2){
            if (this.props.cpu) {
                !this.props.cpuTurn && this.props.handleClickInCPU(position)
            } else {
                this.props.cpuTurn && this.props.handleClickInUser(position)
            }
        } else {
            let grid = this.props.grid;
            if (this.availablePos < this.state.shipsAvailables.length ){
                let long = this.state.shipsAvailables[this.availablePos];
                if (this.state.vertical) {
                    if ( (position.y + long) > 10) {
                        return ''
                    } else {
                            let freeSpace = this.checkFreeSpaceY(position,long);
                            if (freeSpace){
                                for (let index = 0; index < long; index++) {
                                        grid[position.x][position.y + index].status = "ship";
                                        shipsInBoard.push([position.x,position.y + index]);
                                    }
                            } else {
                                return ''
                            }
                    }
                } else {
                    if ( (position.x + long) > 10) {
                        return ''
                    } else {
                        let freeSpace = this.checkFreeSpaceX(position,long);
                        if (freeSpace){
                            for (let index = 0; index < long; index++) {
                                grid[position.x + index][position.y].status = "ship";
                                shipsInBoard.push([position.x + index,position.y]);
                            }
                        } else {
                            return ''
                        }
                    }
                }
                this.availablePos ++;
                if ( this.availablePos === this.state.shipsAvailables.length ) {
                    this.setState((prevState) => {
                        prevState.shipsInBoard.push(shipsInBoard);
                        return prevState;
                    });
                    this.showRotation = false;
                    this.props.showStartGame();
                    this.isPlaying()
                }
            }
            this.setState((prevState) => {
                prevState.shipsInBoard.push(shipsInBoard);
                return prevState;
            }, () => {
                this.props.userShips(shipsInBoard);
            });
        }
    }

    checkFreeSpaceY = (position, long) => {
        for (let index = 0; index < long; index++) {
            if (this.props.grid[position.x][position.y + index].status === "ship"){
                return false;
            }
        }
            return true;
    }
    checkFreeSpaceX = (position, long) => {
        for (let index = 0; index < long; index++) {
            if (this.props.grid[position.x + index][position.y].status === "ship"){
                return false;
            }
        }
            return true;
    }
    isPlaying = () => {
        this.setState((prevState) => {
            prevState.playing = true;
            return prevState;
        })
    }
    toggle = () => {
        this.setState((prevState) => {
            prevState.vertical = !prevState.vertical;
            return prevState;
        })
    }

    render() {
        let position;
        let grid;
        let isCpu = this.props.cpu;
        if (isCpu) {
            grid = this.props.cpuShips;
        } else {
            grid = this.props.grid;
        }
        grid = grid.map((row, posY) => {
            return <div className="row" key={posY}>
                {
                    row.map((cell, posX) => {
                        position = {x:posX, y:posY};
                        return <Cell cellState={grid[posX][posY].status} 
                            paintCell={this.paintCell} 
                            key={`${posX}-${posY}`} 
                            position={position} />
                    })
                }
            </div>
        })
        let title = isCpu ? <span><h2>CPU Board</h2></span> : <span><h2>Mariel Board</h2></span>
        let labelShip = this.props.gameView === 1 && <span><h3>{this.state.shipsAvailables[this.availablePos] ? 'Place ship of '  + this.state.shipsAvailables[this.availablePos] + ' spaces' : 'No more ships to place '}</h3></span>
        const labelRotation = this.props.gameView === 1 && <button onClick={this.toggle}>{this.state.vertical ? 'change to horizontal' : 'change to vertical'}</button>
        let rotationButton = this.showRotation && labelRotation 

        return (
            <div className="board">
                <div>{title}</div>
                <div>
                    {labelShip}
                    {rotationButton}
                    {grid}
                </div>
            </div>
        );
    }
}

export default Board;