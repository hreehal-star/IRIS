import * as THREE from 'three';

const GLOBE_RADIUS = 1;

export function getCartesianCoordinates(latitude: number, longitude: number): THREE.Vector3{

    let x: number;
    let y: number;
    let z: number;

    const latitudeRadians: number = latitude * Math.PI / 180;
    const longitudeRadians: number = longitude * Math.PI / 180;

    x = GLOBE_RADIUS * Math.cos(latitudeRadians) * Math.cos(longitudeRadians);
    y = GLOBE_RADIUS * Math.sin(latitudeRadians);
    z = -GLOBE_RADIUS * Math.cos(latitudeRadians) * Math.sin(longitudeRadians);

    return new THREE.Vector3(x, y, z);
}