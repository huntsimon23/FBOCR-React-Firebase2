// eslint-disable-next-line
import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import * as firebase from 'firebase';

var config = {
  apiKey: "AIzaSyCVhC-Vg7G-Bhzet27hRTNCgHBCq_qTX8s",
  authDomain: "huntsimon23-fbocr-react.firebaseapp.com",
  databaseURL: "https://huntsimon23-fbocr-react.firebaseio.com",
  projectId: "huntsimon23-fbocr-react",
  storageBucket: "huntsimon23-fbocr-react.appspot.com",
  messagingSenderId: "170664006695",
  appId: "1:170664006695:web:69079a07f83da418b8ea02",
  measurementId: "G-EYWJMJHT25"  };

firebase.initializeApp(config)

class UpdateableItem extends Component {
  constructor (props) {
    super(props);
    this.state = {
      text: props.text,
      amount: (props.amount == null) ? 0 : props.amount,
      currency: (props.currency == null) ? 'DKK' : props.currency
    };
    this.dbItems = firebase.database().ref().child('items');

    this.itemChange = this.itemChange.bind(this);
    this.handleUpdateItem = this.handleUpdateItem.bind(this);
  }

  itemChange(e) {
    this.setState({ [e.target.name]: e.target.value })
  }

  handleUpdateItem(e) {
    e.preventDefault();
    if (this.state.text && this.state.text.trim().length !== 0) {
      this.dbItems.child(this.props.dbkey).update(this.state);
    }
  }

  render(){
    return (
      <form onSubmit={ this.handleUpdateItem }>
        <label htmlFor={this.props.dbkey + 'itemname'}>Name</label>
        <input 
          id={this.props.dbkey + 'itemname'}
          onChange={ this.itemChange } 
          value={ this.state.text } 
          name="text"
        />
        <br/>
        <label htmlFor={this.props.dbkey + 'itemamaount'}>Amount</label>
        <input 
          id={this.props.dbkey + 'itemamaount'}
          type="number"
          onChange={ this.itemChange } 
          value={ this.state.amount } 
          name="amount"
        />
        <br/>
        <label htmlFor={this.props.dbkey + 'itemselect'}>Currency</label>
        <select 
          id={this.props.dbkey + 'itemcurrency'}
          value={ this.state.currency }
          onChange={ this.itemChange }
          name="currency"
        >
          <option value="DKK">DKK</option>
          <option value="EUR">EUR</option>
          <option value="USD">USD</option>
        </select>
        <button>Save</button>
      </form>
    );
  }
}

class App extends Component {
  constructor () {
    super();
    this.state = {
      items: [],
      newitemtext : ''
    };
    this.dbItems = firebase.database().ref().child('items');

    this.onNewItemChange = this.onNewItemChange.bind(this);
    this.handleNewItemSubmit = this.handleNewItemSubmit.bind(this);
    this.removeItem = this.removeItem.bind(this);
  }

  componentDidMount() {
    this.dbItems.on('value', dataSnapshot => {
      var items = [];

      dataSnapshot.forEach(function(childSnapshot) {
        var item = childSnapshot.val();
        item['.key'] = childSnapshot.key;
        items.push(item);
      });

      this.setState({
        items: items
      });
    });
  }

  componentWillUnmount() {
    this.dbItems.off();
  }

  handleNewItemSubmit(e) {
    e.preventDefault();
    if (this.state.newitemtext && this.state.newitemtext.trim().length !== 0) {
      this.dbItems.push({
        text: this.state.newitemtext
      });
      this.setState({
        newitemtext: ''
      });
    }
  }

  onNewItemChange(e) {
    this.setState({newitemtext: e.target.value});
  }

  removeItem(key){
    this.dbItems.child(key).remove();
  }

  render() {
    var _this = this;
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>
            App
          </h2>
        </div>
        <ul>
          {this.state.items.map(function(item) {
            return ( 
              <li key={ item['.key'] }>
                <UpdateableItem dbkey={item['.key']} text={item.text} currency={item.currency} amount={item.amount} />
                <a onClick={ _this.removeItem.bind(null, item['.key']) } style={{cursor: 'pointer', color: 'red'}}>Delete</a>
              </li>
            );
          })}
        </ul>
        <form onSubmit={ this.handleNewItemSubmit }>
          <input 
            onChange={ this.onNewItemChange } 
            value={ this.state.newitemtext } 
          />
          <button>{ 'Add #' + (this.state.items.length + 1) }</button>
        </form>
      </div>
    );
  }
}


export default App;