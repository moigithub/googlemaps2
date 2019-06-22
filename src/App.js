import React, { Component } from 'react';
import { GoogleMap, LoadScript, Marker, StandaloneSearchBox } from '@react-google-maps/api'
import './App.css';

const GOOGLEMAP_LIBRARIES = ["places"]

class App extends Component {

    mapRef = React.createRef();

  state = {
    watcherId: null,
    coords: {latitude: -33.866, longitude: 151.196},
    map:null,
    placesService:null
  }

  success = (pos) => {
    this.setState({ coords: pos.coords })
  };

  error(err) {
    console.warn('ERROR(' + err.code + '): ' + err.message);
  };

  componentDidMount() {
    var options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 1000
    };



    navigator.geolocation.getCurrentPosition(this.success, this.error, options);
    const id = navigator.geolocation.watchPosition(this.success, this.error, options);

    this.setState({ watcherId: id })

  }

  createPlacesService=(map)=>{
    // const mapa = this.mapRef.current
    // const elem = document.getElementById("nearby-places-map")

    // Create the places service.
    console.log(this.mapRef)
    console.log("newmap", this.mapRef.current.getInstance(), map)
  const service = new window.google.maps.places.PlacesService(map);

  const {latitude, longitude} = this.state.coords
  const request = {
    location:  new window.google.maps.LatLng(latitude, longitude),
    radius: '1000',
    type: ['bank']
  };
  service.nearbySearch(request, (results, status)=>{
    console.log("nearbysearch", results, status)
  });
  //   this.setState({  placesService })

  }

  // getNearbyBanks = (coords) => {
  //   const { latitude, longitude } = coords
  //   const BASEURL = `https://maps.googleapis.com/maps/api/place/nearbysearch/json`
  //   const URL = `${ BASEURL }?location=${ latitude },${ longitude }&radius=1000&type=bank&key=${ process.env.REACT_APP_GOOGLE_MAPS_KEY }`
  //   fetch(URL)
  //     .then(response => response.json())
  //     .then(data => console.log("nearby", coords, data))
  // }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watcherId);
  }

  handleDragMarker = ({ latLng }) => {
    const coords = {
      latitude: latLng.lat(),
      longitude: latLng.lng()
    };
    this.setState({ coords });
    // this.props.onChange(coords, null);
  };

  onPlacesChanged = () => {

    const places = this.searchBox.getPlaces();
    if (places.length) {
      const latLng = places[0].geometry.location;
      const coords = { latitude: latLng.lat(), longitude: latLng.lng() };

      this.setState({ coords });
      // this.props.onChange(position, places[0]);
      // this.getNearbyBanks(coords)
    }


  };

  render() {
    return (
      <div className="App">
        <h1>hola mundo</h1>
        <LoadScript
          id="script-loader"
          googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_KEY}
          libraries={GOOGLEMAP_LIBRARIES}
          onLoad={() => console.log('script loaded', window)}
          loadingElement={<div>Loading...</div>}
          preventGoogleFontsLoading={true}
        >
          <GoogleMap
            id='nearby-places-map'
            ref={this.mapRef}
            mapContainerStyle={{
              height: "600px",
              width: "800px"
            }}
            zoom={14}
            center={{
              lat: this.state.coords.latitude,
              lng: this.state.coords.longitude
            }}
            options={{ mapTypeControl: false }}
            onLoad={this.createPlacesService}
          >
            <StandaloneSearchBox
              onLoad={ref => this.searchBox = ref}
              onPlacesChanged={this.onPlacesChanged}
            >
              <input
                type="text"
                placeholder="Buscar lugar..."
                style={{
                  boxSizing: `border-box`,
                  border: `1px solid transparent`,
                  width: `40%`,
                  height: `32px`,
                  padding: `0 12px`,
                  borderRadius: `3px`,
                  boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
                  fontSize: `14px`,
                  outline: `none`,
                  textOverflow: `ellipses`,
                  position: "absolute",
                  left: "50%",
                  marginLeft: "-20%",
                  top: '15px'
                }}
              />
            </StandaloneSearchBox>

            <Marker
              draggable
              onLoad={marker => {
                // console.log('marker: ', marker)
              }}
              position={{
                lat: this.state.coords.latitude,
                lng: this.state.coords.longitude
              }}
              onDragEnd={this.handleDragMarker}
            />
          </GoogleMap>
        </LoadScript>
      </div>
    );
  }
}

export default App;
