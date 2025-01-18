import Vue from 'vue'
let VueQuillEditor
if (process.browser) {
  VueQuillEditor = require('@/utils/ssrEditor.js')
}

Vue.use(VueQuillEditor)
