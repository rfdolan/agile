import React, {Component} from "react";
import "./Board.css";

// This class controls the whole board, which is essentially just four columns.
class Board extends Component {
    constructor(props){
        super(props);
        this.state = {
            data: []
        };
        this.moveOverTop = this.moveOverTop.bind(this);
    }
    moveOverTop(key) {
        console.log("Move "+ key + " over!");
    }

    render() {
        return (
            <div className="board">
                <h3>Kanban Board</h3>
                <Column name="To Do" id={0} moveOverTask={this.moveOverTop} items={this.state.data[0]}/>
                <Column name="In Progress"id={1} moveOverTask={this.moveOverTop} items={this.state.data[1]}/>
                <Column name="Blocked"id={2} moveOverTask={this.moveOverTop} items={this.state.data[2]}/>
                <Column name="Completed" id={3} moveOverTask={this.moveOverTop} items={this.state.data[3]}/>
            </div>
        )
    }
}

class Column extends Component {

    constructor(props){
        super(props);
    
        this.state = {
            items:[]
        };

        this.addItem = this.addItem.bind(this);
        this.moveOverTask = this.moveOverTask.bind(this);
    }

    addItem(e) {
        var itemArray = this.state.items;

        if((this._nameInput.value !== "") && (this._descInput.value !== "")) {
            itemArray.unshift({
                name:this._nameInput.value,
                description: this._descInput.value,
                key:Date.now()
            });
            this.setState({
                items: itemArray
            });
            this._nameInput.value = null;
            this._descInput.value = null;
        }
        console.log(itemArray);
        e.preventDefault();
    }

    moveOverTask(key){
        this.props.moveOverTask(key);

    }

    render() {
        return (
            <div className="column">
                <h3>{this.props.name}</h3>
                <form onSubmit={this.addItem}>
                    <input ref={ (a) => this._nameInput = a}
                    placeholder="Enter taskname"></input>
                    <input ref={ (a)=> this._descInput = a}
                    placeholder="Enter description"></input>
                    <button type="submit">add</button>
                </form>
                <TaskHolder entries={this.state.items} 
                moveOver={this.moveOverTask} />
            </div>
        )
    }
}

class TaskHolder extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
        this.moveOver = this.moveOver.bind(this);
        this.createItems = this.createItems.bind(this);
    }
    
    moveOver(key){
        this.props.moveOver(key);
    }

    createItems(item) {
        return <Task entries={item} key={item.key} moveOverBase={this.moveOver}/>
    }

    render()  {
        var listEntries = this.props.entries;
        var listItems = listEntries.map(this.createItems)
        return(
            <div className="list">
                {listItems}
            </div>
        )
    }

}

class Task extends Component {
    constructor(props) {
        super(props);

        this.state = this.props.entries;
    }
    moveOverBase(key){
        this.props.moveOverBase(key);
    }

    render() {
        return (
            <div className="square" draggable="true" key={this.state.key} 
            onClick={ () =>this.moveOverBase(this.state.key)}>
                <p>Name: {this.state.name}</p>
                <p>Description: {this.state.description}</p>
            </div>
        )
    }

}


export default Board;