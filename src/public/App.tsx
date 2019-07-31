import React, { Fragment, useState } from "react";

interface IState {
  loading: boolean;
  username: string | null;
  secret: string | null;
}

const initialState: IState = { loading: false, username: null, secret: null };

export const App = () => {
  let [state, setState] = useState(initialState);

  const signin = async () => {
    const { username, secret } = state;
    const body = JSON.stringify({ username, secret });
    const headers = new Headers({
      "Content-Type": "application/json"
    });
    let response = await fetch("/signin", { method: "post", body, headers });
    if (response.ok) window.location.replace("/app");
  };

  const change = (evt: React.ChangeEvent<HTMLInputElement>) => {
    let key: string = evt.target.name;
    let value: string = evt.target.value;
    setState({ ...state, [key]: value });
  };

  return (
    <Fragment>
      <header>
        <h3>Hello!</h3>
        <nav>
          <a href="#/">Foo</a>
          &bull;
          <a href="/signout">Signout</a>
        </nav>
      </header>
      <main>
        <div id="login">
          <input
            type="text"
            name="username"
            placeholder="Username..."
            onChange={change}
          />
          <br />
          <input
            type="password"
            name="secret"
            placeholder="********"
            onChange={change}
          />
          <br />
          <button onClick={signin} disabled={!(state.username && state.secret)}>
            signin
          </button>
        </div>
      </main>
      <footer>
        <p>
          <b>For dev purposes only:</b>
        </p>
        <nav>
          <a href="/debug/users" target="blank">
            Users
          </a>
          &bull;
          <a href="/debug/tokens" target="blank">
            Tokens
          </a>
        </nav>
      </footer>
    </Fragment>
  );
};

export default App;
