import React, { PureComponent } from "react";

export interface AppProps {
  ip: string;
}

interface AppState {
  ip: string;
}

class App extends PureComponent<AppProps, AppState> {
  state: AppState = { ip: this.props.ip };

  render() {
    return (
      <div>
        <input
          value={this.state.ip}
          onChange={({ target: { value } }) => this.setState({ ip: value })}
        />
        <button onClick={() => alert(this.state.ip)}>Submit</button>
      </div>
    );
  }
}

export default App;
