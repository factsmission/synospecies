<template>
  <div id="app">
    <header class="plazi-header">
      <div class="container">
        <a href="http://plazi.org/">
          <img
            src="./assets/logo.png"
            alt="Plazi - take care of freedom"
            class="logo plazi"
          >
        </a>
        <a href="https://factsmission.com">
          <img
            src="./assets/FactsMissionTEO.png"
            alt="FactsMission"
            class="logo fm"
          >
        </a>
      </div>
    </header>
    <nav
      id="nav"
      class="plazi-nav"
    >
      <div class="container">
        <router-link to="/">
          Home
        </router-link>
        <router-link to="/advanced">
          Advanced
        </router-link>
        <router-link to="/about">
          About
        </router-link>
        <router-link to="/settings">
          Settings
        </router-link>
      </div>
    </nav>

    <router-view />

    <div class="plazi-footer">
      <div class="container">
        Synospecies is created and maintained by
        <a href="https://factsmission.com">FactsMission</a>,
        is powered by <a href="https://allegrograph.com/products/allegrograph/">Franz Inc. AllegroGraph</a> and uses the
        taxonomic treatment data provided by
        <a href="http://plazi.org/">Plazi</a>.
        <hr>
        This project has received funding from the European Union’s Horizon 2020 programme (grant agreement 101007492) and from the Arcadia Fund.
        <hr>
        This is an open source project:
        <a href="https://github.com/factsmission/synospecies">
          View the code on Github
        </a>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@300&family=Open+Sans:ital,wght@0,400;0,600;0,800;1,400;1,600;1,800&family=Oswald:wght@500&display=swap');
* {
  box-sizing: border-box;
}
html {
  height: 100%;
  overflow-wrap: break-word;
}
body {
  margin: 0;
  padding: 0;
}
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
main.container {
  flex: 1 0 auto;
}
.container {
  width: 65rem;
  max-width: 100%;
  max-width: calc(100vw - 32px);
  margin: 0 auto;
  padding: 16px 32px 0;
  border-radius: 8px;
}
* {
  font-family: "Open Sans", "Trebuchet MS", Arial, Helvetica, sans-serif;
}
.flex-row {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.container h1,
.container h1 * {
  color: #727272;
}
.image {
  border-radius: 4px;
}
.container > .card {
  margin-left: -16px;
  margin-right: -16px;
}
hr {
  margin: 0.4rem 0;
  border: 0;
  border-top: 1px solid #00000033;
}
.section {
  margin: 12px 0;
}
.section:empty {
  display: none;
}
.section.card_body {
  margin: 0;
  width: 100%;
}
.card {
  border: 1px solid #00000033;
  border-radius: 8px;
  padding: 16px;
  margin: 12px 0;
}
.card:empty {
  display: none;
}
.container h1,
.section.card_header,
.card .card_header,
.card .card_header>* {
  font-family: Oswald, Arial, Helvetica, sans-serif;
  font-weight: normal;
  margin: -8px 0 16px 0;
}
.card .card_body {
  margin: 0;
  width: 100%;
}

.notice {
  background-color: #ffecb3;
  color: #634b03;
}

table {
  margin: 0;
  width: 100%;
  border-collapse: collapse;
}
th {
  color: rgba(0,0,0,0.7);
}
table tr th,
table tr td {
  text-align: center;
  // border-top: 1px solid #00000033;
  padding: 0.5rem;
}
tr:nth-child(odd) {
  background-color: #0000000f;
  & *:first-child {
    border-top-left-radius: 0.2rem;
    border-bottom-left-radius: 0.2rem;
  }
  & *:last-child {
    border-top-right-radius: 0.2rem;
    border-bottom-right-radius: 0.2rem;
  }
}
table a {
  word-break: break-all;
}
a,
a:visited {
  color: #476100;
  text-decoration: none;
}
.nolink {
  color: inherit;
  text-decoration: none;
}
a:hover,
a:focus,
a:active {
  color: #81951d !important;
  text-decoration: underline !important;
}
a img {
  display: block;
}
.plazi-header {
  flex-shrink: 0;
  min-height: 80px;
  margin-bottom: 0;
  background-color: #f5f5f5;
  border-bottom: 1px solid #9bc134;
  border-top-right-radius: 0;
  border-top-left-radius: 0;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
  z-index: 1001;
}
.plazi-nav {
  flex-shrink: 0;
  flex-shrink: 0;
  padding: 0;
  margin-bottom: 0;
  border-bottom: 1px solid #00000033;
  border-radius: 0;
  z-index: 1001;
  & > .container {
    display: flex;
    padding-top: 0;
    padding-bottom: 0;
    flex-wrap: wrap;
    & a {
      display: block;
      line-height: 28px;
      padding: 0 15px;
      color: inherit;
      flex: 1;
      text-align: center;
      &:active,
      &:hover,
      &:focus {
        color: inherit !important;
        text-decoration: none !important;
        background-color: #dddddd;
      }
    }
  }
}
.router-link-active {
  background-color: #f3f3f3;
}
.plazi-header > .container {
  padding-top: 26px;
  padding-bottom: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}
.plazi-footer {
  flex-shrink: 0;
  background-color: #f5f5f5;
  border-top: 1px solid #9bc134;
  color: #444444;
  padding: 10px 0;
  font-size: small;
}
.plazi-footer > .container {
  padding-top: 0;
  padding-bottom: 0;
}
.plazi-footer a {
  color: inherit;
  text-decoration: underline;
}
.nobold,
.nobold * {
  font-weight: normal;
}
body.fullscreen-on {
  overflow: hidden;
  .fullscreen {
    z-index: 10000;
    background: #ffffff;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: 0;
    border-radius: 0;
    border: none;
    overflow: auto;
  }
}
.logo {
  max-width: 100%;

  &.fm {
    max-height: 24px;
  }

  &.plazi {
    max-height: 48px;
  }
}

pre,
pre *,
code,
code *,
.CodeMirror,
.CodeMirror * {
    font-family: 'Fira Code', monospace;
}

@media (max-width: 65rem) {
  .container {
    width: 100%;
    padding-left: 0;
    padding-right: 0;
    .card {
      margin-left: 0;
      margin-right: 0;
      padding: .8rem;
    }
  }
}
</style>
