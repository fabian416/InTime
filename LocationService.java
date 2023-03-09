package com.nowintime;

import android.app.Service;
import android.content.Intent;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.os.Bundle;
import android.os.IBinder;
import android.util.Log;

public class LocationService extends Service implements LocationListener {

    private LocationManager locationManager;

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        locationManager = (LocationManager) getSystemService(LOCATION_SERVICE);

        try {
            // Registra para recibir actualizaciones de ubicación
            locationManager.requestLocationUpdates(LocationManager.GPS_PROVIDER, 10000, 0, this);
        } catch (SecurityException e) {
            Log.e("LocationService", "Error al solicitar actualizaciones de ubicación", e);
        }

        return START_STICKY;
    }

    @Override
    public void onLocationChanged(Location location) {
        // Aquí puedes actualizar la ubicación del usuario y calcular el tiempo que ha pasado en una ubicación específica
        Log.i("LocationService", "Nueva ubicación: " + location.toString());
    }

    @Override
    public void onStatusChanged(String provider, int status, Bundle extras) {}

    @Override
    public void onProviderEnabled(String provider) {}

    @Override
    public void onProviderDisabled(String provider) {}

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }
}