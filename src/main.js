import "@babel/polyfill";
import Vue from "vue";
import "./plugins/vuetify";
import App from "./App.vue";
//import { initializedApp } from "firebase";
import firebase from "firebase/app";
import "firebase/app";
import "firebase/auth";
import "firebase/database";
import router from "./router";
//import store from "./store";
import { store } from "./store";
import DateFilter from "./filters/date";
import AlertCmp from "./components/Shared/Alert.vue";
import EditMeetupDetailsDialog from "./components/Meetup/Edit/EditMeetupDetailsDialog.vue";
import EditMeetupDateDialog from "./components/Meetup/Edit/EditMeetupDateDialog.vue";
import EditMeetupTimeDialog from "./components/Meetup/Edit/EditMeetupTimeDialog.vue";
import RegisterDialog from "./components/Meetup/Registration/RegisterDialog.vue";

Vue.config.productionTip = false;

Vue.filter("date", DateFilter);
Vue.component("app-alert", AlertCmp);
Vue.component("app-edit-meetup-details-dialog", EditMeetupDetailsDialog);
Vue.component("app-edit-meetup-date-dialog", EditMeetupDateDialog);
Vue.component("app-edit-meetup-time-dialog", EditMeetupTimeDialog);
Vue.component("app-meetup-register-dialog", RegisterDialog);
//Vue.use("app-alert", AlertCmp);

new Vue({
  router,
  store,
  //render: h => h(App),
  created() {
    firebase.initializeApp({
      apiKey: "AIzaSyCJZTD68YHp4dZb_9cg75bxoer96cgXliY",
      authDomain: "vuedcsdemo.firebaseapp.com",
      databaseURL: "https://vuedcsdemo.firebaseio.com",
      projectId: "vuedcsdemo",
      storageBucket: "vuedcsdemo.appspot.com"
    });
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.$store.dispatch("autoSignIn", user);
        this.$store.dispatch("fetchUserData");
      }
    });
    this.$store.dispatch("loadMeetups");
    /*  firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
        // User is signed in.
        const userData = {
          id: user.user.uid,
          registeredMeetups: []
        }
        store.dispatch('setUser', userData)
      } else {
        console.log('No user is signed in.')
      }
      })
      //also need to add an action 'setUser' in store! iow index.js
    */
  },
  render: h => h(App)
}).$mount("#app");

/*
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
*/
