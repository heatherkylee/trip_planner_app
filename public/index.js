/* global Vue, VueRouter, axios */

var HomePage = {
  template: "#home-page",
  data: function() {
    return {
      message: "Welcome to Vue.js!"
    };
  },
  created: function() {},
  methods: {},
  computed: {}
};

var TripsPage = {
  template: "#trips-page",
  data: function() {
    return {
      message: "My Trips"
    };
  },
  created: function() {},
  methods: {},
  computed: {}
};

var AddPlace = {
  template: "#add-place-page",
  data: function() {
    return {
      message: "Simple Search",
      newPlace: "",
      results: [],
      candidate: {place_id: ""},
      places: [],
      details: []
    };
  },
  created: function() {},
  methods: {
    searchPlace: function() {
      console.log("searching for a place");
      var newPlace = this.newPlace;
      axios.get("https://maps.googleapis.com/maps/api/place/findplacefromtext/json?key=APIKEY&input=" + newPlace + "&inputtype=textquery&fields=name,formatted_address,place_id").then(function(response) {
        this.results = response.data;
        console.log(response.data);
      }.bind(this));
    },
    addToTrip: function(inputCandidate) {
      console.log("adding to trip");
      var theParams = {
        place_id: inputCandidate.place_id
      };
      console.log(theParams);
      axios.post("/api/places", theParams).then(function(response) {
        console.log(response.data);
        console.log("place has been added");
        this.places.push(response.data);
      }.bind(this));
      
      var tripID = {
        place_id: inputCandidate.place_id
      };

      axios.get("https://maps.googleapis.com/maps/api/place/details/json?placeid=" + tripID.place_id + "&fields=name,formatted_address,formatted_phone_number,opening_hours,website&key=APIKEY").then(function(response) {
        console.log("place details");
        console.log(response.data);
        this.details.push(response.data);
        console.log(details.results.formatted_address);
      }.bind(this));
    }
  },
  computed: {}
};

var SignupPage = {
  template: "#signup-page",
  data: function() {
    return {
      name: "",
      email: "",
      password: "",
      passwordConfirmation: "",
      errors: []
    };
  },
  methods: {
    submit: function() {
      var params = {
        name: this.name,
        email: this.email,
        password: this.password,
        password_confirmation: this.passwordConfirmation
      };
      axios
        .post("/api/users", params)
        .then(function(response) {
          router.push("/login");
        })
        .catch(
          function(error) {
            this.errors = error.response.data.errors;
          }.bind(this)
        );
    }
  }
};

var LoginPage = {
  template: "#login-page",
  data: function() {
    return {
      email: "",
      password: "",
      errors: []
    };
  },
  methods: {
    submit: function() {
      var params = {
        email: this.email, password: this.password
      };
      axios
        .post("/api/sessions", params)
        .then(function(response) {
          axios.defaults.headers.common["Authorization"] =
            "Bearer " + response.data.jwt;
          localStorage.setItem("jwt", response.data.jwt);
          router.push("/");
        })
        .catch(
          function(error) {
            this.errors = ["Invalid email or password."];
            this.email = "";
            this.password = "";
          }.bind(this)
        );
    }
  }
};

var LogoutPage = {
  template: "<h1>Logout</h1>",
  created: function() {
    axios.defaults.headers.common["Authorization"] = undefined;
    localStorage.removeItem("jwt");
    router.push("/");
  }
};

var router = new VueRouter({
  routes: [
    { path: "/", component: HomePage },
    { path: "/trips", component: TripsPage },
    { path: "/places/new", component: AddPlace },
    { path: "/signup", component: SignupPage },
    { path: "/login", component: LoginPage },
    { path: "/logout", component: LogoutPage }
  ],
  scrollBehavior: function(to, from, savedPosition) {
    return { x: 0, y: 0 };
  }
});

var app = new Vue({
  el: "#vue-app",
  router: router,
  created: function() {
    var jwt = localStorage.getItem("jwt");
    if (jwt) {
      axios.defaults.headers.common["Authorization"] = jwt;
      console.log("jwt");
      console.log(jwt);
    }
  }
});