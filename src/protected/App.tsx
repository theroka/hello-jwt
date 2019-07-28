import React, { Fragment } from "react";

export const App = () => {
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
        <p>Protected route/app.</p>
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
