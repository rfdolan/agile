
import React, { Component } from 'react';
import Column from "./Column.js";
import EditableElement from './EditableElement.js';
import base_url from './api'

const get_columns_url = base_url + 'getBoardColumns'
const create_column_url = base_url + 'createColumn'

class Board extends Component {
    state = {
        id: this.props.id,
        name: this.props.name,
        createdAt: this.props.createdAt,
        columns: [],
        intervalIsSet: false,
        loadedColumns: false,
        newColumnName: ''
    }

    // when component mounts, first thing it does is fetch all existing data in our db
    // then we incorporate a polling logic so that we can easily see if our db has
    // changed and implement those changes into our UI
    componentDidMount() {
        this.getColumns();
        if (!this.state.intervalIsSet) {
            let interval = setInterval(this.getBoardFromDb, 1000);
            this.setState({ intervalIsSet: interval });
        }
    }

    // never let a process live forever
    // always kill a process everytime we are done using it
    componentWillUnmount() {
        if (this.state.intervalIsSet) {
            clearInterval(this.state.intervalIsSet);
            this.setState({ intervalIsSet: null });
        }
    }

    // rfdolan
    // Function to render the tasks in a column based off of their ids
    renderColumns() {
        //console.log(this.state.columnIds)
        let columns = [];
        for (let i = 0; i < this.state.columns.length; i++) {
            let curr = this.state.columns[i]
            columns.push(<Column id={curr.column_id} name={curr.name} key={curr.column_id}
                deleteCallback={this.getColumns} />);
        }
        return columns;
    }

    // Gets columns for this board
    getColumns = (e) => {
        let boardId = encodeURIComponent(this.state.id)
        fetch(get_columns_url + `?id=${boardId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'applications/json'
            }
        })
            .then(res => res.json())
            .then(
                (result) => {
                    //console.log(result)
                    let status = result.statusCode
                    if (status === 200) {
                        let cols = result.columns
                        //console.log(cols)
                        this.setState({
                            columns: cols,
                            loadedColumns: true
                        })
                    } else {
                        console.log("Error getting columns")
                    }
                }
            );
    };

    createNewColumn = (e) => {
        if (this.state.newColumnName === '') { return; }
        let newName = encodeURIComponent(this.state.newColumnName)
        let boardId = encodeURIComponent(this.state.id)
        fetch(create_column_url + `?name=${newName}&id=${boardId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'applications/json'
            }
        })
            .then(res => res.json())
            .then(
                (result) => {
                    //console.log(result)
                    let status = result.statusCode
                    if (status === 200) {
                        this.setState({
                            columns: result.columns,
                            newColumnName: ''
                        })
                    } else {
                        console.log("Error creating task")
                    }
                }
            );
    }

    renderName = (propName, propContent) => {
        return <div>
            <EditableElement
                elementType="h1"
                content={propContent}
                updateProp={this.updateDB}
                fieldName={propName}
                sytle={{ display: "flex", overflowX: "wrap", width: "250px" }}
            />
        </div>
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    // TODO move all style to a stylesheet
    render() {
        return (
            <div>
                <h2>{this.state.name}</h2>

                <div style={{ display: "inline-flex" }}>
                    {this.state.loadedColumns ? this.renderColumns() : ''}

                    <label>New Column Name:
                    <input name="newColumnName" value={this.state.newColumnName}
                            onChange={e => this.handleChange(e)}></input>
                    </label>
                    <button type="button" style={{ height: '25px' }} onClick={(e) => this.createNewColumn(e)}>Create New Column</button>
                </div>

            </div>
        )
    }

};

export default Board;