# hello-jwt

Small example project using JWT for user sessions. After successful login Koa app responses with React app from protected route.

To install dependencies
```
yarn install
```

**Disclaimer**: TypeScript version fixed to 3.1.6 due to a "Excessive stack depth comparing types" bug in TypeORM. See [https://github.com/Microsoft/TypeScript/issues/29112](https://github.com/Microsoft/TypeScript/issues/29112).

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

[1](https://github.com/Microsoft/TypeScript/issues/29112)
