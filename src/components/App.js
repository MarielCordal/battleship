import React, { Component } from 'react';
import './App.css';
import Board from './Board';

class App extends Component {
    destroyedCPUShips=0;
    destroyedUserShips=0;
    winner= '';
    CPUShots = [];
    positionsAvaliables = this.createPositionAvaliablesToShot();
    constructor() {
        super()
        this.state = {
            Usergrid: this.createGrid(10,10),
            CPUgrid: this.createGrid(10,10),
            gameView : 1 ,
            start : false,
            CPUShips : this.CPUShips(),
            userShips : [],
            cpu : true,
            playing: false,
            cpuTurn: false,
            showStart: false,
        }
    }
    setInitialStates = () => {
        this.destroyedCPUShips=0;
        this.destroyedUserShips=0;
        this.winner= '';
        this.CPUShots = [];
        this.positionsAvaliables = this.createPositionAvaliablesToShot();
        this.setState((prevState) => {
            prevState.Usergrid = this.createGrid(10,10)
            prevState.CPUgrid = this.createGrid(10,10)
            prevState.gameView = 1
            prevState.start = false
            prevState.CPUShips = this.CPUShips()
            prevState.userShips = []
            prevState.cpu = true
            prevState.playing = false
            prevState.cpuTurn = false
            prevState.showStart = false
            return prevState;
        });
    }

    createPositionAvaliablesToShot(){
        let positionsAvaliables = new Array(100).fill(null);
        let posx=0
        let posy=0
        for (let pos = 0; pos <=99; pos){
            while (posy <= 9){
                positionsAvaliables[pos] = [posx,posy]
                posy++
                pos++
            }
            posx ++
            posy=0
        }
        return positionsAvaliables
    }

    createGrid( a, b){
        const rows = Array.apply(null, Array(a));
        const cells = Array.apply(null, Array(b));
        const grid = rows.map((row, idx)=> {
        return cells.map((cell, idx) => {
            return {
                status: "empty",
            }
            })
        })
        return grid
    }

    changeStage = () => {
        let { gameView } = this.state;
        gameView++;
        this.setState({ gameView })
        //this initilize the computer
        this.fillEnemyGrid();
        return (true)
    }

    playing = () => {
        let { playing } = this.state;
        playing = true
        this.setState({ playing })
    }

    CPUShips = ()  => {
        let renderShipArray = [];
        let ship1 = [];
        let ship2 = [];
        let ship3 = [];
        let ship4 = [];
        let ship5 = [];
        ship1.push([4,3])
        ship1.push([4,4])
        ship1.push([4,5])
        ship1.push([4,6])

        ship2.push([8,3])
        ship2.push([8,4])
        ship2.push([8,5])

        ship3.push([1,6])
        ship3.push([1,7])
        ship3.push([1,8])

        ship4.push([1,2])
        ship4.push([2,2])
        ship4.push([3,2])

        ship5.push([7,8])
        ship5.push([8,8])

        let ArrayCPUShip1 = {
            shipPositions: ship1,
            long : ship1.length,
            hitCount: 0
        }
        let ArrayCPUShip2 = {
            shipPositions: ship2,
            long : ship2.length,
            hitCount: 0
        }
        let ArrayCPUShip3 = {
            shipPositions: ship3,
            long : ship3.length,
            hitCount: 0
        }
        let ArrayCPUShip4 = {
            shipPositions: ship4,
            long : ship4.length,
            hitCount: 0
        }
        let ArrayCPUShip5 = {
            shipPositions: ship5,
            long : ship5.length,
            hitCount: 0
        }
        renderShipArray.push(ArrayCPUShip1, ArrayCPUShip2, ArrayCPUShip3, ArrayCPUShip4, ArrayCPUShip5)
        const CPUships = renderShipArray;
        return CPUships
    }
    verifyWinner = (isCpu) => {
        isCpu ? this.destroyedCPUShips ++ : this.destroyedUserShips ++ ;
        this.destroyedCPUShips === 5 && this.configWinnerDisplay(false);
        this.destroyedUserShips === 5 && this.configWinnerDisplay(true);
    }
    configWinnerDisplay = (winCpu) => {
        let { gameView } = this.state;
        gameView++;
        this.setState({ gameView })
        winCpu ? this.winner = 'The winner is CPU' : this.winner = 'The winner is User'
    }
    calculateHit = (position, isCpu) => {
        let cpugridtomatch
        if (isCpu){
            cpugridtomatch = this.state.CPUShips
        } else {
            cpugridtomatch = this.state.userShips
        }
        cpugridtomatch.forEach(ship => {
            ship.shipPositions.forEach(pos => {
            if (pos[0] === position.x && pos[1] === position.y){
                //found
                ship.hitCount ++;
                if ( ship.long === ship.hitCount){
                    ship.shipPositions.forEach(cell => {
                        if (isCpu){
                            this.setState((prevState) => {
                                prevState.CPUgrid[cell[0]][cell[1]].status = "destroyed";
                                return prevState;
                            });
                        } else {
                            this.setState((prevState) => {
                                prevState.Usergrid[cell[0]][cell[1]].status = "destroyed";
                                return prevState;
                            });
                        }
                    });
                    isCpu ? this.verifyWinner(true) : this.verifyWinner(false);
                }
            }
            });
        });
    }
    changeStatusUserGrid = (position) => {
        switch (this.state.Usergrid[position.x][position.y].status) {
            case "empty":
                this.setState((prevState) => {
                    prevState.Usergrid[position.x][position.y].status = "water";
                    return prevState;
                });
                break;
            case "ship":
                this.setState((prevState) => {
                    prevState.Usergrid[position.x][position.y].status = "hit";
                    return prevState;
                }, () => {
                    this.calculateHit(position, false);
                });
                break;
            default:
                break;
        }
    }
    changeStatusCPUGrid = (position) => {
        switch (this.state.CPUgrid[position.x][position.y].status) {
            case "empty":
                this.setState((prevState) => {
                    prevState.CPUgrid[position.x][position.y].status = "water";
                    return prevState;
                });
                break;
            case "hidden":
                this.setState((prevState) => {
                    prevState.CPUgrid[position.x][position.y].status = "hit";
                    return prevState;
                }, () => {
                    this.calculateHit(position, true);
                });
            break;
            default:
                break;
        }
    }
    handleClickInUser = (position) => {
      setTimeout(() => {
            this.changeStatusUserGrid(position);
        }, 1000);

        let { cpuTurn } = this.state;
        cpuTurn = false
        this.setState({ cpuTurn })

    }

    handleClickInCPU = (position) => {
        this.changeStatusCPUGrid(position);
          this.setState((prevState) => {
              prevState.cpuTurn = true;
              return prevState;
          }, () => {
              this.handleClickInUser(this.random());
          });

    }
    random = () => {

        let min = 0;
        let max = this.positionsAvaliables.length - 1;
        let randomNumberx = Math.floor(Math.random() * (max - min + 1) + min);
        let randomPos = this.positionsAvaliables[randomNumberx]
        let randomPosition = {
            x: randomPos[0],
            y: randomPos[1]
        }

        this.positionsAvaliables.splice(randomNumberx,1)
        this.CPUShots.push(randomPosition)
        return randomPosition;
    }

    fillEnemyGrid = (a, b) => {
        this.state.CPUShips.forEach(ship => {
            ship.shipPositions.forEach(cell => {
                this.setState((prevState) => {
                    prevState.CPUgrid[cell[0]][cell[1]].status = "hidden";
                    return prevState;
                });
            });
        });
        this.showStartGame();
    }

    showStartGame = () => {
        this.setState((prevState) => {
            prevState.showStart = !prevState.showStart;
            return prevState;
        })
    }

    setUserShips = (ArrayShips) => {
        this.setState((prevState) => {
            let ArrayUserShips = {
                shipPositions : ArrayShips,
                long : ArrayShips.length,
                hitCount: 0
            }
            prevState.userShips.push(ArrayUserShips);
            return prevState;
        })
    }
    render() {

        let turn = ''
        const userBoard = <Board
            grid={this.state.Usergrid}
            changeStage={this.changeStage}
            playing={this.playing}
            cpuTurn={this.state.cpuTurn}
            showStartGame={this.showStartGame}
            handleClickInUser={this.handleClickInUser}
            userShips={this.setUserShips}
            gameView={this.state.gameView}/>

        const CPUBoard = <Board
            cpuShips={this.state.CPUgrid}
            cpu={this.state.cpu}
            playing={this.playing}
            cpuTurn={this.state.cpuTurn}
            handleClickInCPU={this.handleClickInCPU}
            gameView={this.state.gameView}/>

        if (this.state.gameView === 2) {
            turn = this.state.cpuTurn ? <span><h2>Playing: CPU</h2></span> : <span><h2>Playing: User</h2></span>
        }
        let start = this.state.showStart && <button onClick={this.changeStage} className="buttons">Start Game</button>
        let userView = this.state.gameView !== 3 && userBoard;
        let CPUView = this.state.gameView === 2 && CPUBoard;
        let winnerView = this.state.gameView === 3 && <div><h2>{this.winner}</h2></div>
        let restartButton = this.state.gameView === 3 && <div className="restartButton"><button onClick={this.setInitialStates} className="buttons">RESTART GAME</button></div>

        return (
            <div className="App">
                {/*{turn}*/}
                <div className="Board">
                    {userView}
                    {CPUView}
                    {winnerView}
                    {restartButton}
                </div>
                {start}
            </div>
        );
    }
}

export default App;
