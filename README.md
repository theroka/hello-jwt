# hello-jwt

Small example project using JWT for user sessions. After successful login Koa app responses with React app from protected route.

To install dependencies
```
yarn install
```

To build project
```
yarn gulp
```
Runs gulp default task through node_modules/.bin/gulp.
Output is written to ./build

Run server with
```
node build/server.js
```
Runs webserver on localhost:8080
Serves two different server-side rendered React apps from /build/public and /build/protected.
