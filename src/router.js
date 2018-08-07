import Vue from "vue";
import Router from "vue-router";
//original=import Home from "./views/Home.vue";
//am=import Home from "@components/Home";
import Home from "./components/Home.vue";
//import Meetups from "./components/Meetup/Meetups.vue";
import CreateMeetup from "./components/Meetup/CreateMeetup.vue";
//import Profile from "./components/User/Profile.vue";
//import Signin from "./components/User/Signin.vue";
//import Signup from "./components/User/Signup.vue";
//import About from "./views/About.vue";
import Meetup from "./components/Meetup/Meetup.vue";
import AuthGuard from "./router/auth-guard";
import NotFoundComponent from "./views/404.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "Home", //original="home"
      component: Home
    },
    {
      path: "/meetups",
      name: "Meetups",
      component: () =>
        import(/* webpackChunkName: "about" */ "./components/Meetup/Meetups.vue")
    },
    {
      path: "/meetup/new", //path:"/meetups",??!
      name: "CreateMeetup",
      component: CreateMeetup,
      beforeEnter: AuthGuard
    },
    {
      path: "/meetups/:id",
      name: "Meetup",
      props: true,
      component: Meetup
    },
    {
      path: "/profile",
      name: "Profile",
      component: () =>
        import(/* webpackChunkName: "about" */ "./components/User/Profile.vue")
    },
    {
      path: "/signup",
      name: "Signup",
      component: () =>
        import(/* webpackChunkName: "about" */ "./components/User/Signup.vue")
    },
    {
      path: "/signin",
      name: "Signin",
      component: () =>
        import(/* webpackChunkName: "about" */ "./components/User/Signin.vue")
    },
    {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "about" */ "./views/About.vue")
    },
    {
      path: "*",
      component: NotFoundComponent
    }
  ]
});
