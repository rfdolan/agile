import React, { Component } from 'react';
import './style/editable.css';

class EditableElement extends Component {
    state = {
        editing: false,
        content: this.props.content,
        fieldName: this.props.fieldName,
        elementtype: this.props.elementType,
    }

    toggleEdit = () => {
      if(this.state.content != null){
        this.setState({
          editing: !this.state.editing
        })
      }
    }

    updateValue = () => {
      this.setState({
        editing: false,
        content: this.refs.textInput.value
      });
      this.props.updateProp(this.state.fieldName, this.refs.textInput.value);
    }

    renderEditView = () => {
      return <this.state.elementtype>
        <input type='text'
          className='editing' 
          defaultValue={this.state.content}
          ref='textInput' 
          /> 
          <button onClick={this.toggleEdit}>X</button>
          <button onClick={this.updateValue}>OK</button>
          </this.state.elementtype>
    }
    
    renderNormalView = () => {

      return <this.state.elementtype
          onDoubleClick={this.toggleEdit} 
          contentEditable={this.editing}
          ref={(domNode) => {this.domElm = domNode;}}
          onBlur={this.save}
          onKeyDown={this.handleKeyDown}
          style={{wordWrap:"break-word"}}>
          {this.state.content}
           </this.state.elementtype>
    }

      render() {
          return this.state.editing ?
          this.renderEditView() :
          this.renderNormalView()
      }
}

export default EditableElement;