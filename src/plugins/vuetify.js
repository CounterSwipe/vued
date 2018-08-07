import Vue from "vue";
import Vuetify from "vuetify";
import "vuetify/dist/vuetify.min.css";
import colors from "vuetify/es5/util/colors";

//Vue.use(Vuetify, {});
// (color+base||(lighten||darken||accent+#))||shades+color
Vue.use(Vuetify, {
  theme: {
    primary: colors.green.base,
    secondary: colors.grey.darken1,
    accent: colors.shades.black,
    error: colors.red.accent3,
    info: "#2196F3",
    success: "#4CAF50",
    warning: "#FFC107"
  }
});
