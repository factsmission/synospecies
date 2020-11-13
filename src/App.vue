<template>
  <div id="app">
    <header class="plazi-header">
      <div class="container">
        <a href="http://plazi.org/">
          <img
            src="./assets/logo.png"
            alt="Plazi - take care of freedom"
            width="200"
            height="50"
          />
        </a>
        <a href="https://factsmission.com">
          <img src="./assets/FactsMissionTEO.png" alt="FactsMission" height="20" />
        </a>
      </div>
    </header>
    <nav class="plazi-nav" id="nav">
      <div class="container">
        <router-link to="/">Home</router-link>
        <router-link to="/advanced">Advanced</router-link>
        <router-link to="/about">About</router-link>
        <router-link to="/settings">Settings</router-link>
      </div>
    </nav>

    <main class="container">
      <router-view/>
    </main>

    <div class="plazi-footer">
      <div class="container">
        Synospecies is created and maintained by
        <a href="https://factsmission.com">FactsMission</a> and uses the
        taxonomic treatment data provided by
        <a href="http://plazi.org/">Plazi</a>.
      </div>
      <div class="container">
        <a href="https://github.com/factsmission/synospecies">
          View the code on Github
        </a>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Classic from '@/views/Classic.vue'
@Component({
  components: {
    Classic
  }
})
export default class App extends Vue {}
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css?family=Open+Sans:400,400italic,600,600italic,800,800italic|Oswald:700&display=swap");
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
  height: 100%;
  display: flex;
  flex-direction: column;
}
main.container {
  flex: 1 0 auto;
}
.container {
  width: 140ch;
  max-width: 100%;
  max-width: calc(100vw - 32px);
  margin: 0 auto;
  padding: 32px;
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
  margin: 0 0 16px;
  font-family: Oswald, Arial, Helvetica, sans-serif;
  font-weight: normal;
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
  margin-top: 20px;
  margin-bottom: 20px;
  border: 0;
  border-top: 1px solid #00000033;
}
.section {
  border-bottom: 1px solid #00000033;
  margin: 12px 0;
}
.section:empty {
  display: none;
}
.section.card_header {
  font-family: Oswald, Arial, Helvetica, sans-serif;
  font-weight: 700;
  margin: 0 0 16px 0;
}
.section.card_body {
  margin: 0;
  width: 100%;
}
.card {
  border: 1px solid #00000033;
  border-radius: 8px;
  padding: 16px;
  margin: 12px;
}
.card:empty {
  display: none;
}
.card .card_header,
.card .card_header>* {
  font-family: Oswald, Arial, Helvetica, sans-serif;
  font-weight: 700;
  margin: 0 0 16px 0;
}
.card .card_body {
  margin: 0;
  width: 100%;
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
  border-top: 1px solid #00000033;
  padding: 0.5rem;
}
table tr:nth-child(2) td {
  border-bottom: 1px solid #00000033;
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
.router-link-exact-active {
  background-color: #f3f3f3;
}
.plazi-header > .container {
  padding-top: 26px;
  padding-bottom: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.plazi-footer {
  flex-shrink: 0;
  background-color: #333333;
  border-top: 1px solid #2b2b2b;
  color: #ffffff;
  padding: 10px 0;
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

pre,
pre *,
code,
code *,
.CodeMirror,
.CodeMirror * {
    font-family: 'Fira Code', monospace;
}

@media (max-width: 140ch) {
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
