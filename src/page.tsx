import Koa from "koa";
import React from "react";
import { renderToString } from "react-dom/server";
import PublicApp from "./public/App";
import ProtectedApp from "./protected/App";

export const renderFullPage = (
  title: string,
  body: string,
  assetRoot: string,
  preloadedState?: string
) => {
  return `<!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8"/>
        <title>${title}</title>
        <link rel="stylesheet" href="${assetRoot}/styles.css"/>
      </head>
      <body>
        <div id="root">${body}</div>
        <script>
          window.__PRELOADED_STATE__ = ${
            preloadedState ? preloadedState.replace(/</g, "\\u003c") : null
          }
        </script>
        <script type="text/javascript" src="${assetRoot}/bundle.js"></script>
      </body>
    </html>`;
};

export const getIndex = async (ctx: Koa.Context) => {
  let jsx = renderToString(<PublicApp />);
  ctx.body = renderFullPage("hello-jwt", jsx, "/public");
};

export const getApp = async (ctx: Koa.Context) => {
  let jsx = renderToString(<ProtectedApp />);
  ctx.body = renderFullPage("hello-jwt", jsx, "/protected");
};
