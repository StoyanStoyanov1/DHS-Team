import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Script to handle redirects from 404.html */}
        <script dangerouslySetInnerHTML={{
          __html: `
            // This script checks to see if a redirect is present in the query string
            // and converts it back into the correct URL and adds it to the browser's
            // history using window.history.replaceState(...), which won't cause the
            // browser to attempt to load the new URL.
            (function() {
              var redirect = sessionStorage.redirect;
              delete sessionStorage.redirect;
              if (redirect && redirect !== window.location.href) {
                window.history.replaceState(null, null, redirect);
              }
              
              // Handle SPA routing for Firebase hosting
              var l = window.location;
              if (l.search) {
                var q = {};
                l.search.slice(1).split('&').forEach(function(v) {
                  var a = v.split('=');
                  q[a[0]] = a.slice(1).join('=').replace(/~and~/g, '&');
                });
                if (q.p !== undefined) {
                  window.history.replaceState(null, null,
                    l.pathname.slice(0, -1) + (q.p || '') +
                    (q.q ? ('?' + q.q) : '') +
                    l.hash
                  );
                }
              }
            })();
          `
        }} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}