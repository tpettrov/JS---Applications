import React, { Component } from 'react';
import './App.css';
import $ from 'jquery';
import NavigationBar from './components/NavigationBar';
import Footer from './components/Footer';
import ReactDOM from 'react-dom';
import Home from './views/Home'
import Login from './views/Login'

export default class App extends Component {

    constructor(props) {

        super(props);
        this.state = {

            username: sessionStorage.getItem('username'),
            userId: sessionStorage.getItem('userId')
        }
    }


  render() {
    return (
      <div className="App">
            <header>

                <NavigationBar
                    username = {this.state.username}
                    homeClicked = {this.showHomeView.bind(this)}
                    loginClicked = {this.showLoginView.bind(this)}
                />
                <div id="errorBox">Error msg</div>
                <div id="infoBox">Info msg</div>
                <div id="loadingBox">Loading msg</div>
                </header>

          <div id="main">Main app view </div>
        <Footer />

      </div>
    );
  }

    showView(reactComponent){

        ReactDOM.render(
            reactComponent,
            document.getElementById('main')
        )

    }

    showHomeView(){

        this.showView(<Home />);

    }

    showLoginView(){

        this.showView(<Login />);
    }

}


