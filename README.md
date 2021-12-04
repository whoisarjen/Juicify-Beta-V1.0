Juicify is an "coach app", which helps people manage their weight by analizing what they eat and suggesting what to change.

The app is wrote with Vue and styled with Vuetify. It also uses technology like PWA to be availably not only as web app, but also as native app. It comes with server, which use Websocket, Redis and mongoDB to prove best user expierence. The goal was to create as fast app as possible, so except caching on server site, Juicify uses indexedDB on client site, what allow to make the app working even, when there is not internet connection.

The whole app is in beta and still have some bugs to fix, but for now the project is stoped and will rewrited it in React with better idea on the whole project managment.

You can try the app here: https://juicify.app, using your own account or test one (login: Marek, password: Marek123).

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
