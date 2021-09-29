<script lang="ts">
    import {Router} from "@roxi/routify";
    import {routes} from "../.routify/routes";
    // import * as axios from "axios";

    // Add a request interceptor
    // axios.interceptors.request.use(request => {
    //     // Check if the user is logged in
    //     const token = localStorage.getItem("token");
//
    //     if (token && isLoggedIn()) {
    //         request.headers.common.Authorization = `JWT ${token}`;
    //     }
//
    //     // Even if we're not logged in, inject the common headers (like content-type)
    //     const headers = commonHeaders();
    //     for (const header in headers) {
    //         request.headers.common[header] = headers[header];
    //     }
//
    //     return request;
    // });


</script>

<main>
    <Router {routes}/>
</main>

<style lang="scss" global>
  // ResetCSS!
  html, body, div, span, applet, object, iframe,
  h1, h2, h3, h4, h5, h6, p, blockquote, pre,
  a, abbr, acronym, address, big, cite, code,
  del, dfn, em, img, ins, kbd, q, s, samp,
  small, strike, strong, sub, sup, tt, var,
  b, u, i, center,
  dl, dt, dd, ol, ul, li,
  fieldset, form, label, legend,
  table, caption, tbody, tfoot, thead, tr, th, td,
  article, aside, canvas, details, embed,
  figure, figcaption, footer, header, hgroup,
  menu, nav, output, ruby, section, summary,
  time, mark, audio, video {
    margin: 0;
    padding: 0;
    border: 0;
    font-size: 100%;
    font: inherit;
    vertical-align: baseline;
  }

  /* HTML5 display-role reset for older browsers */
  article, aside, details, figcaption, figure,
  footer, header, hgroup, menu, nav, section {
    display: block;
  }

  body {
    line-height: 1;
  }

  ol, ul {
    list-style: none;
  }

  blockquote, q {
    quotes: none;
  }

  blockquote:before, blockquote:after,
  q:before, q:after {
    content: '';
    content: none;
  }

  table {
    border-collapse: collapse;
    border-spacing: 0;
  }

</style>
