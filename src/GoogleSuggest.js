import React from "react";
import GoogleMapLoader from "react-google-maps-loader";
import GooglePlacesSuggest from "react-google-places-suggest";
import ReactGoogleMap from "react-google-map";

const MY_API_KEY = "AIzaSyByJ7fJG_IDNM-kqHCBoywD2dV1cwXbUyI";
const proxyurl = "https://cors-anywhere.herokuapp.com/";

export default class GoogleSuggest extends React.Component {
  state = {
    search: "",
    value: "",
    restaurants: [],
    restCoord: [],
    coordinates: {
      lat: 20.296059,
      lng: 85.824539
    }
  };

  handleInputChange = e => {
    this.setState({ search: e.target.value, value: e.target.value });
  };

  handleSelectSuggest = (geocodedPrediction, originalPrediction) => {
    console.log(geocodedPrediction.geometry.location); // eslint-disable-line
    this.setState({
      search: "",
      value: geocodedPrediction.formatted_address,
      coordinates: {
        lat: geocodedPrediction.geometry.location.lat(),
        lng: geocodedPrediction.geometry.location.lng()
      }
    });
  };

  handleNoResult = () => {
    console.log("No results for ", this.state.search);
  };

  handleSubmit = () => {
    console.log(this.state);
    fetch(
      proxyurl +
        "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" +
        this.state.coordinates.lat +
        "," +
        this.state.coordinates.lng +
        "&radius=5000&type=restaurant&key=" +
        MY_API_KEY
    )
      .then(res => res.json())
      .then(res => {
        var coord = [];
        res.results.map((point, index) => {
          coord.push({
            title: point.name,
            position: {
              lat: point.geometry.location.lat,
              lng: point.geometry.location.lng
            },
            onLoaded: (googleMaps, map, marker) => {

            }
          });
        });
        this.setState({
            restaurants: res.results,
            restCoord: coord
          });
      });
  };

  render() {
    const { search, value } = this.state;
    return (
      <div>
        <GoogleMapLoader
          params={{
            key: MY_API_KEY,
            libraries: "places,geocode"
          }}
          render={googleMaps =>
            googleMaps && (
              <GooglePlacesSuggest
                googleMaps={googleMaps}
                autocompletionRequest={{
                  input: search
                  // Optional options
                  // https://developers.google.com/maps/documentation/javascript/reference?hl=fr#AutocompletionRequest
                }}
                // Optional props
                onNoResult={this.handleNoResult}
                onSelectSuggest={this.handleSelectSuggest}
                textNoResults="My custom no results text" // null or "" if you want to disable the no results item
                customRender={prediction => (
                  <div className="customWrapper">
                    {prediction
                      ? prediction.description
                      : "My custom no results text"}
                  </div>
                )}
              >
                <input
                  type="text"
                  value={value}
                  placeholder="Search a location"
                  onChange={this.handleInputChange}
                />
                <button onClick={this.handleSubmit}>Submit</button>
              </GooglePlacesSuggest>
            )
          }
        />
        <GoogleMapLoader
          params={{
            key: MY_API_KEY,
            libraries: "places,geometry"
          }}
          render={googleMaps =>
            googleMaps && (
              <div style={{ height: "300px" }}>
                <ReactGoogleMap
                  googleMaps={googleMaps}
                  center={{ lat: this.state.coordinates.lat, lng: this.state.coordinates.lng }}
                  zoom={12}
                  coordinates={this.state.restCoord}
                />
              </div>
            )
          }
        />
      </div>
    );
  }
}
