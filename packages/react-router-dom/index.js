import * as React from "react";
import { createBrowserHistory, createHashHistory, createPath } from "history";
import { MemoryRouter, Navigate, Outlet, Route, Router, Routes, createRoutesFromChildren, generatePath, matchRoutes, matchPath, resolvePath, renderMatches, useHref, useInRouterContext, useLocation, useMatch, useNavigate, useNavigationType, useOutlet, useParams, useResolvedPath, useRoutes } from "react-router";
function warning(cond, message) {
    if (!cond) {
        // eslint-disable-next-line no-console
        if (typeof console !== "undefined")
            console.warn(message);
        try {
            // Welcome to debugging React Router!
            //
            // This error is thrown as a convenience so you can more easily
            // find the source for a warning that appears in the console by
            // enabling "pause on exceptions" in your JavaScript debugger.
            throw new Error(message);
            // eslint-disable-next-line no-empty
        }
        catch (e) { }
    }
}
////////////////////////////////////////////////////////////////////////////////
// RE-EXPORTS
////////////////////////////////////////////////////////////////////////////////
// Note: Keep in sync with react-router exports!
export { MemoryRouter, Navigate, Outlet, Route, Router, Routes, createRoutesFromChildren, generatePath, matchRoutes, matchPath, renderMatches, resolvePath, useHref, useInRouterContext, useLocation, useMatch, useNavigate, useNavigationType, useOutlet, useParams, useResolvedPath, useRoutes };
///////////////////////////////////////////////////////////////////////////////
// DANGER! PLEASE READ ME!
// We provide these exports as an escape hatch in the event that you need any
// routing data that we don't provide an explicit API for. With that said, we
// want to cover your use case if we can, so if you feel the need to use these
// we want to hear from you. Let us know what you're building and we'll do our
// best to make sure we can support you!
//
// We consider these exports an implementation detail and do not guarantee
// against any breaking changes, regardless of the semver release. Use with
// extreme caution and only if you understand the consequences. Godspeed.
///////////////////////////////////////////////////////////////////////////////
/** @internal */
export { UNSAFE_NavigationContext, UNSAFE_LocationContext, UNSAFE_RouteContext } from "react-router";
/**
 * A <Router> for use in web browsers. Provides the cleanest URLs.
 */
export function BrowserRouter({ basename, children, window }) {
    let historyRef = React.useRef();
    if (historyRef.current == null) {
        historyRef.current = createBrowserHistory({ window });
    }
    let history = historyRef.current;
    let [state, setState] = React.useState({
        action: history.action,
        location: history.location
    });
    React.useLayoutEffect(() => history.listen(setState), [history]);
    return (React.createElement(Router, { basename: basename, children: children, location: state.location, navigationType: state.action, navigator: history }));
}
/**
 * A <Router> for use in web browsers. Stores the location in the hash
 * portion of the URL so it is not sent to the server.
 */
export function HashRouter({ basename, hashType, children, window }) {
    let historyRef = React.useRef();
    if (historyRef.current == null) {
        historyRef.current = createHashHistory({ window });
    }
    let history = historyRef.current;
    let [state, setState] = React.useState({
        action: history.action,
        location: history.location
    });
    React.useLayoutEffect(() => history.listen(setState), [history]);
    let hashTypeBasename = hashType && hashType === "noslash" ? "" : "/";
    return (React.createElement(Router, { basename: basename || hashTypeBasename, children: children, location: state.location, navigationType: state.action, navigator: history }));
}
export function HistoryRouter({ basename, children, history }) {
    const [state, setState] = React.useState({
        action: history.action,
        location: history.location
    });
    React.useLayoutEffect(() => history.listen(setState), [history]);
    return (React.createElement(Router, { basename: basename, children: children, location: state.location, navigationType: state.action, navigator: history }));
}
function isModifiedEvent(event) {
    return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
}
/**
 * The public API for rendering a history-aware <a>.
 */
export const Link = React.forwardRef(function LinkWithRef({ onClick, reloadDocument, replace = false, state, target, to, ...rest }, ref) {
    let href = useHref(to);
    let internalOnClick = useLinkClickHandler(to, { replace, state, target });
    function handleClick(event) {
        if (onClick)
            onClick(event);
        if (!event.defaultPrevented && !reloadDocument) {
            internalOnClick(event);
        }
    }
    return (
    // eslint-disable-next-line jsx-a11y/anchor-has-content
    React.createElement("a", { ...rest, href: href, onClick: handleClick, ref: ref, target: target }));
});
/**
 * A <Link> wrapper that knows if it's "active" or not.
 */
export const NavLink = React.forwardRef(function NavLinkWithRef({ "aria-current": ariaCurrentProp = "page", caseSensitive = false, className: classNameProp = "", end = false, style: styleProp, to, ...rest }, ref) {
    let location = useLocation();
    let path = useResolvedPath(to);
    let locationPathname = location.pathname;
    let toPathname = path.pathname;
    if (!caseSensitive) {
        locationPathname = locationPathname.toLowerCase();
        toPathname = toPathname.toLowerCase();
    }
    let isActive = locationPathname === toPathname ||
        (!end &&
            locationPathname.startsWith(toPathname) &&
            locationPathname.charAt(toPathname.length) === "/");
    let ariaCurrent = isActive ? ariaCurrentProp : undefined;
    let className = [classNameProp, isActive ? "active" : null]
        .filter(Boolean)
        .join(" ");
    let style = typeof styleProp === "function" ? styleProp({ isActive }) : styleProp;
    return (React.createElement(Link, { ...rest, "aria-current": ariaCurrent, className: className, ref: ref, style: style, to: to }));
});
////////////////////////////////////////////////////////////////////////////////
// HOOKS
////////////////////////////////////////////////////////////////////////////////
/**
 * Handles the click behavior for router `<Link>` components. This is useful if
 * you need to create custom `<Link>` components with the same click behavior we
 * use in our exported `<Link>`.
 */
export function useLinkClickHandler(to, { target, replace: replaceProp, state } = {}) {
    let navigate = useNavigate();
    let location = useLocation();
    let path = useResolvedPath(to);
    return React.useCallback((event) => {
        if (event.button === 0 && // Ignore everything but left clicks
            (!target || target === "_self") && // Let browser handle "target=_blank" etc.
            !isModifiedEvent(event) // Ignore clicks with modifier keys
        ) {
            event.preventDefault();
            // If the URL hasn't changed, a regular <a> will do a replace instead of
            // a push, so do the same here.
            let replace = !!replaceProp || createPath(location) === createPath(path);
            navigate(to, { replace, state });
        }
    }, [location, navigate, path, replaceProp, state, target, to]);
}
/**
 * A convenient wrapper for reading and writing search parameters via the
 * URLSearchParams interface.
 */
export function useSearchParams(defaultInit) {
    warning(typeof URLSearchParams !== "undefined", `You cannot use the \`useSearchParams\` hook in a browser that does not ` +
        `support the URLSearchParams API. If you need to support Internet ` +
        `Explorer 11, we recommend you load a polyfill such as ` +
        `https://github.com/ungap/url-search-params\n\n` +
        `If you're unsure how to load polyfills, we recommend you check out ` +
        `https://polyfill.io/v3/ which provides some recommendations about how ` +
        `to load polyfills only for users that need them, instead of for every ` +
        `user.`);
    let defaultSearchParamsRef = React.useRef(createSearchParams(defaultInit));
    let location = useLocation();
    let searchParams = React.useMemo(() => {
        let searchParams = createSearchParams(location.search);
        for (let key of defaultSearchParamsRef.current.keys()) {
            if (!searchParams.has(key)) {
                defaultSearchParamsRef.current.getAll(key).forEach(value => {
                    searchParams.append(key, value);
                });
            }
        }
        return searchParams;
    }, [location.search]);
    let navigate = useNavigate();
    let setSearchParams = React.useCallback((nextInit, navigateOptions) => {
        navigate("?" + createSearchParams(nextInit), navigateOptions);
    }, [navigate]);
    return [searchParams, setSearchParams];
}
/**
 * Creates a URLSearchParams object using the given initializer.
 *
 * This is identical to `new URLSearchParams(init)` except it also
 * supports arrays as values in the object form of the initializer
 * instead of just strings. This is convenient when you need multiple
 * values for a given key, but don't want to use an array initializer.
 *
 * For example, instead of:
 *
 *   let searchParams = new URLSearchParams([
 *     ['sort', 'name'],
 *     ['sort', 'price']
 *   ]);
 *
 * you can do:
 *
 *   let searchParams = createSearchParams({
 *     sort: ['name', 'price']
 *   });
 */
export function createSearchParams(init = "") {
    return new URLSearchParams(typeof init === "string" ||
        Array.isArray(init) ||
        init instanceof URLSearchParams
        ? init
        : Object.keys(init).reduce((memo, key) => {
            let value = init[key];
            return memo.concat(Array.isArray(value) ? value.map(v => [key, v]) : [[key, value]]);
        }, []));
}
