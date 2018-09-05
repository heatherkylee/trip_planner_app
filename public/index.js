/* global Vue, VueRouter, axios */

var HomePage = {
  template: "#home-page",
  data: function() {
    return {
      message: "Welcome to Trip Here"
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
          router.push("/trips/" + this.tripID);
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
      editTrip: [],
      errors: []
    };
  },
  created: function() {
    axios.get("/api/trips/" + this.$route.params.id).then(function(response) {
      console.log(response.data);
      this.editTrip = response.data;
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
        .patch("/api/trips/" + this.$route.params.id, params).then(function(response) {
          console.log("Trip name has been updated");
          router.push("/trips/" + this.$route.params.id);
        }.bind(this));
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
      results: [{ geometry: {location: {lat: "", lng: ""}}}],
      // candidate: {place_id: ""},
      details: [],
      addTripDetails: [],
      errors: [],
      currentPlace: {},
      lat: "",
      lng: "",
      map: "",
      marker: "",
      title: "",
      infowindow: ""
    };
  },
  created: function() {
    axios.get("/api/trips/" + this.$route.params.id).then(function(response) {
      this.trip = response.data;
      console.log(this.trip);
      // this.lat = parseFloat(this.trip.places[0].lat, 10) || 40.7128;
      // this.lng = parseFloat(this.trip.places[0].lng, 10) || 74.006;

      var myLatLng = {lat: parseFloat(this.lat, 10), lng: parseFloat(this.lng, 10)};
      // console.log(myLatLng);
      this.map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 40.7128, lng: 74.006},
        zoom: 10
      });

      for (var i = 0; i < this.trip.places.length; i++) {
        this.marker = new google.maps.Marker({
          position: {lat: parseFloat(this.trip.places[i].lat, 10), lng: parseFloat(this.trip.places[i].lng, 10)},
          map: this.map,
          title: this.trip.places[i].name
        });

        this.infowindow = new google.maps.InfoWindow({
          content: this.trip.places[i].name
        });

        this.marker.addListener('click', function() {
          this.infowindow.open(map, this.marker);
        });

      }}.bind(this));
  },
  mounted: function() {
    console.log("beginning of mounted");
    this.autocomplete = new google.maps.places.Autocomplete(
      /** @type {!HTMLInputElement} */(this.$refs.autocomplete),
      {types: ['establishment', 'geocode']});

    var search = this.autocomplete.addListener('place_changed', () => {
      this.currentPlace = this.autocomplete.getPlace();
      console.log(this.currentPlace);
      this.newPlace = "";
    });
  },
  methods: {
    addToTrip: function(inputCurrentPlace) {
      console.log("printing input current place");
      console.log(inputCurrentPlace);
      this.results = [];

      axios.get("https://maps.googleapis.com/maps/api/place/details/json?placeid=" + this.currentPlace.place_id + "&fields=name,geometry&key=APIKEY").then(function(response) {
        // var lat = response.data.result.geometry.location.lat;
        // var lng = response.data.result.geometry.location.lng;
        this.lat = response.data.result.geometry.location.lat;
        this.lng = response.data.result.geometry.location.lng;

        this.marker = new google.maps.Marker({
          position: {lat: this.lat, lng: this.lng },
          map: this.map,
          title: inputCurrentPlace.name
        });          

        console.log(this.lat);
        console.log(this.lng);

        var tripID = {
          place_id: inputCurrentPlace.place_id
        };
        console.log("adding to trip");
        var hours;
        if (inputCurrentPlace.opening_hours) {
          hours = inputCurrentPlace.opening_hours.weekday_text;
        } else {
          hours = "Not Available"; 
        }
        var phoneNumber;
        if (inputCurrentPlace.international_phone_number) {
          phoneNumber = inputCurrentPlace.international_phone_number;
        } else {
          phoneNumber = "Not Available"; 
        }
        console.log(inputCurrentPlace);
        console.log(inputCurrentPlace.place_id);
        console.log(this.$route.params.id);
        var params = {
          place_id: inputCurrentPlace.place_id,
          trip_id: this.$route.params.id,
          name: inputCurrentPlace.name,
          address: inputCurrentPlace.formatted_address,
          phone_number: phoneNumber,
          opening_hours: hours,
          website: inputCurrentPlace.website,
          lat: this.lat,
          lng: this.lng
        };
        console.log("printing the params");
        console.log(params);

        axios.post("/api/places", params).then(function(response) {
          console.log(response.data);
          console.log("place has been added");
          this.trip.places.push(response.data);
          this.currentPlace = {};
        }.bind(this));
      }.bind(this));
    },  
    deleteTrip: function(inputTrip) {
      console.log("deleting trip");
      var theParams = {id: this.$route.params.id };
      axios.delete("/api/trips/" + this.$route.params.id, theParams).then(function(response) {
        console.log("trip has been deleted");
        router.push("/trips");
      });
    },
    editTrip: function(inputTrip) {
      router.push("/trips/" + this.trip.id +  "/edit");
    },
    deletePlace: function(inputPlace) {
      console.log("deleting place");
      // console.log(inputPlace);
      console.log(inputPlace.id);
      var theParams = {id: inputPlace.id };
      // console.log(theParams);
      axios.delete("/api/places/" + inputPlace.id, theParams).then(function(response) {
        console.log("place has been deleted");
      });
      var index = this.trip.places.indexOf(inputPlace);
      this.trip.places.splice(index, 1);
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