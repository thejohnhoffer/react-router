# React Router Noslash

This package exists as a stopgap until [Issue #8459](https://github.com/remix-run/react-router/issues/8459) is resolved.

## Deploy

For now, I'm manually running:

```
yarn install
yarn build
node scripts/version.js v6.1.0-noslash.8.x
node scripts/publish
npm dist-tag add react-router-noslash@6.1.0-noslash.8.x latest
npm dist-tag add react-router-dom-noslash@6.1.0-noslash.8.x latest
```

This is a fork of [react-router](https://github.com/remix-run/react-router).
