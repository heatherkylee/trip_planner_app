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

// Trips

var TripsPage = {
  template: "#trips-page",
  data: function() {
    return {
      message: "My Trips",
      trips: [],
      // myTrips: []
      name: "",
      tripID: 0,
      errors: []
    };
  },
  created: function() {
    axios.get("/api/trips").then(function(response) {
      console.log(response.data);
      this.trips = response.data;
    }.bind(this));
  },
  methods: {
    submit: function() {
      var params = {
        name: this.name,
      };
      axios
        .post("/api/trips", params)
        .then(function(response) {
          this.tripID = response.data.id;
          console.log(this.tripID);
          this.trips.push(response.data);
          // router.push("/trips/" + this.tripID);
        }.bind(this));
    }
  },
  computed: {}
};

var EditTripPage = {
  template: "#edit-trip-page",
  data: function() {
    return {
      message: "Edit Trip",
      name: "",
      editTripName: "",
      errors: []
    };
  },
  created: function() {
    axios.get("/api/trips/" + this.$route.params.id).then(function(response) {
      console.log(response.data);
      this.editTripName = response.data.name;
      this.name = this.editTripName;
    }.bind(this));
  },
  methods: {
    submit: function() {
      var params = {
        name: this.name,
      };
      axios
        .patch("/api/trips/" + this.$route.params.id, params)
        .then(function(response) {
          router.push("/trips");
          console.log("Trip name has been updated");
        })
        .catch(
          function(error) {
            this.errors = error.response.data.errors;
          }.bind(this)
        );
    }
  }
};

var ShowTripPage = {
  template: "#show-trip-page",
  data: function() {
    return {
      trip: {},
      message: "Simple Search",
      newPlace: "",
      results: [],
      candidate: {place_id: ""},
      details: [],
      addTripDetails: []
    };
  },
  created: function() {
    axios.get("/api/trips/" + this.$route.params.id).then(function(response) {
      this.trip = response.data;
      console.log(this.trip);
    }.bind(this));
  },
  methods: {
    searchPlace: function() {
      console.log("searching for a place");
      var newPlace = this.newPlace;
      axios.get("https://maps.googleapis.com/maps/api/place/findplacefromtext/json?key=APIKEY&input=" + newPlace + "&inputtype=textquery&fields=name,formatted_address,place_id").then(function(response) {
        this.results = response.data;
        console.log(response.data);
      }.bind(this));

      this.newPlace = "";

    },
    addToTrip: function(inputCandidate) {
      // console.log(inputCandidate);
      this.results = [];
      var tripID = {
        place_id: inputCandidate.place_id
      };

      axios.get("https://maps.googleapis.com/maps/api/place/details/json?placeid=" + tripID.place_id + "&fields=name,formatted_address,formatted_phone_number,opening_hours,website,photos,place_id&key=APIKEY").then(function(response) {
        console.log("place details");
        console.log(response.data);
        // console.log("****");
        // console.log(this.details);
        console.log("adding to trip");
        var hours;
        if (response.data.result.opening_hours) {
          hours = response.data.result.opening_hours.weekday_text.join(", ");
        } else {
          hours = "Not Available"; 
        }
        var phoneNumber;
        if (response.data.result.formatted_phone_number) {
          phoneNumber = response.data.result.formatted_phone_number;
        } else {
          phoneNumber = "Not Available"; 
        }
        var theParams = {
          place_id: inputCandidate.place_id,
          trip_id: this.$route.params.id,
          name: response.data.result.name,
          address: response.data.result.formatted_address,
          phone_number: phoneNumber,
          opening_hours: hours,
          website: response.data.result.website
        };
        // console.log("printing the params");
        // console.log(theParams);
        axios.post("/api/places", theParams).then(function(response) {
          console.log(response.data);
          console.log("place has been added");
          this.trip.places.push(response.data);
        }.bind(this));

      }.bind(this)).catch(function(error) {
        console.log(error.response);
      });
    },
    deleteTrip: function(inputTrip) {
      console.log("deleting trip");
      axios.delete("/api/trips" + this.$route.params.id).then(function(response) {
        console.log("trip has been deleted");
      })
    }
  },
  computed: {}
};

// Authentication

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
          router.push("/trips");
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
    { path: "/trips/:id/edit", component: EditTripPage },
    { path: "/trips/:id", component: ShowTripPage },
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