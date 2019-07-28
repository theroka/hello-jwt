import React, { Fragment, useState } from "react";

export const App = () => {

  const signout = async () => {
    let response = await fetch("/signout", { method: "post", credentials: "include" });
    if (response.ok) window.location.replace("/");
  };

  return (
    <Fragment>
      <header>
        <h3>Hello!</h3>
        <nav>
          <a href="#/">Foo</a>
          &bull;
          <a href="/signout">Signout (Link)</a>
          &bull;
          <a onClick={signout}>Signout (AJAX)</a>
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
