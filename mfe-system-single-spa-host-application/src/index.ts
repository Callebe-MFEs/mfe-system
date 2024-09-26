import "./index.scss";

// the assets are injected as a relative path.
// if the path is not the root, we need to redirect to the root
// to load the assets correctly
// we store the current path in the search query 'next'
// so we can redirect back to the original path after rendering the root

if (window.location.pathname === "/") {
  import("./bootstrap")
    .then(({ bootstrapPromise }) => bootstrapPromise)
    .then(() => {
      // after bootstrap the app, remove the next query param from the url
      // and update the browser history with the new url
      const query: URLSearchParams = new URLSearchParams(window.location.search);

      if (query.has("next")) {
        const next = query.get("next");
        query.delete("next");
        const params = query.size ? `?${query.toString()}` : "";
        window.history.pushState({}, "", `${next}${params}`);
      }
    });
}
