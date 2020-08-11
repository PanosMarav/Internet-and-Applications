import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import main from './components/main'


class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <div className="container mt-3">
            <Switch>
              <Route exact path={["/", "/tutorials"]} component={main} />
            </Switch>
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
