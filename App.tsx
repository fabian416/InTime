
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { useState, useEffect, } from "react";
import React from 'react';
import { View, Text, StyleSheet, PermissionsAndroid, Button, StatusBar } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import BackgroundTimer from 'react-native-background-timer';
import { NativeModules } from 'react-native';


const geofenceLatitude = -34.48027088936589;
const geofenceLongitude = -58.579378656095656;
const geofenceRadius = 38; // Radio de 50 metros



const degreesToRadians = (degrees: number) => {
  return degrees * Math.PI / 180;
}

const distance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371; // Radio de la tierra en km
  const dLat = degreesToRadians(lat2 - lat1);
  const dLon = degreesToRadians(lon2 - lon1);
  const a =
    0.5 -
    Math.cos(dLat) / 2 +
    (Math.cos(degreesToRadians(lat1)) * Math.cos(degreesToRadians(lat2)) * (1 - Math.cos(dLon))) / 2;
  return R * 2 * Math.asin(Math.sqrt(a)) * 1000; // Distancia en metros
};

type TimerProps = {
  active: boolean;
  InitialTime: number| 0;
}

const Timer = ({ active, InitialTime}: TimerProps) => {
  const [time, setTime] = useState(InitialTime);

  useEffect(() => {
    let timerId: number;
    if (active) {
      timerId = BackgroundTimer.setInterval(() => {
        setTime(time => time + 1000);
      }, 1000);
    }
    return () => {
      BackgroundTimer.clearInterval(timerId);
    };
  }, [active]);

  const formatTime = (time: number): string => {
    const pad = (n: number) => (n < 10 ? `0${n}` : n);
    const hours = Math.floor(time / 3600000);
    const minutes = Math.floor((time % 3600000) / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  };


  return (
    <Text style={styles.timer}>
      PASARON {formatTime(time)}
    </Text>
  );
};


  const App = () => {

  
  const [location, setLocation] = useState<any>(null);
  const [error, setError] = useState<string>('');
  const [inGeofence, setInGeofence] = useState<boolean>(false);
  const [timeInGeofence, setTimeInGeofence] = useState<number>(0);
  
  const handleLocationPermission = async () => {
  try {
  const result = await PermissionsAndroid.requestMultiple([
   PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION, ]);

   const granted =
  result[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] === 'granted' && 
  result[PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION] === 'granted'; 
  
    
  if (granted) {
    console.log("puedes usar la ubicacion");
    const { LocationService } = NativeModules;
    if (LocationService) {
      LocationService.startService();
      } else {
        console.log("locationService no esta disponible");
      }
  Geolocation.watchPosition(
  position => {
  setLocation(position);
  console.log(position);
  const distanceToGeofence = distance(
  position.coords.latitude,
  position.coords.longitude,
  geofenceLatitude,
  geofenceLongitude
  );
  if (distanceToGeofence < geofenceRadius) {
  setInGeofence(true);
  setTimeInGeofence (timeInGeofence+1000);
  } else {
  setInGeofence(false);
  }
  },
  error => {
  setError(error.message);
  console.log(error);
  },
  {
  enableHighAccuracy: true,
  distanceFilter: 5,
  interval: 1000,
  fastestInterval: 5000,
  showLocationDialog: true,
  forceRequestLocation: true,
  },
  );

  } else {
  console.log("Location permission denied");
  }
  } catch (err) {
  console.warn(err);
  }
  };
  
  useEffect(() => {
  handleLocationPermission();
  return () => {
    console.log('se ha parado de mandar ubicacion en segundo plano');
  Geolocation.stopObserving();
  };
  }, []);
  
  return (
  <View style={styles.container}>
  <StatusBar barStyle="dark-content" />
  <Text style={styles.title}>In Time</Text>
  <Text style={styles.subtitle}>Latitud: {location?.coords.latitude}</Text>
  <Text style={styles.subtitle}>Longitud: {location?.coords.longitude}</Text>
  {error ? (
  <Text style={styles.error}>{error}</Text>
  ) : inGeofence ? (
  <Text style={styles.inGeofence}>Estas trabajando</Text>
  ) : (
  <Text style={styles.outOfGeofence}>No estas en tu trabajo</Text>
  )}
  <Timer InitialTime={timeInGeofence} active={inGeofence} />

  <Button
  title="Reset"
  onPress={() => {console.log("boton presionado")
  setTimeInGeofence(prevTime => 0);
    console.log(`timeInGeofence después de resetear: ${timeInGeofence}`);
  }}
  />
  </View>
  );
  };
  
  const styles = StyleSheet.create({
  container: {
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
  },
  title: {
  fontSize: 24,
  fontWeight: 'bold',
  marginBottom: 16,
  },
  subtitle: {
  fontSize: 16,
  marginBottom: 8,
  },
  inGeofence: {
  fontSize: 20,
  color: 'green',
  marginBottom: 16,
  },
  outOfGeofence: {
  fontSize: 20,
  color: 'red',
  marginBottom: 16,
  },
  timer: {
    fontSize: 48,
    fontWeight: 'bold',
    color:'red',
  },
  error: {
  fontSize: 20,
  color: 'orange',
  marginBottom: 16,
  },
});

export default App;
