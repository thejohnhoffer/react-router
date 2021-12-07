# React Router

The `react-router` package is the heart of [React Router](/) and provides all
the core functionality for
[`react-router-dom`](/packages/react-router-dom)

If you're using React Router, you should never `import` anything directly from
the `react-router` package, but you should have everything you need in `react-router-dom`. This package re-exports
everything from `react-router`.
and

If you'd like to extend React Router and you know what you're doing, you should
add `react-router` **as a peer dependency, not a regular dependency** in your
package.
