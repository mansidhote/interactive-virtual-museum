import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as lilGui from 'lil-gui';
import gsap from 'gsap';

// Canvas
const canvas = document.querySelector('canvas');

// Scene
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(
  45, // Field of View
  window.innerWidth / window.innerHeight, // Aspect Ratio
  0.1, // Near
  1000 // Far
);

// Initial position of the camera
camera.position.set(-4.9, 4.4, 1.9);
camera.rotation.set(-0.9, -0.8, -0.8);

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(window.innerWidth, window.innerHeight);

// Orbit Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Sensitivity settings
const minSensitivity = 0.002; // Minimum sensitivity
const maxSensitivity = 0.01; // Maximum sensitivity
const sensitivityRange = 0.5; // Sensitivity range (from center to edge)

// gltf Loader
const gltfLoader = new GLTFLoader();
gltfLoader.load('/model/swedish-royal/scene.gltf', (gltf) => {
  console.log('Our model here!', gltf);
  const model = gltf.scene;
  scene.add(model);

  // Function to handle mouse movement
  function handleMouseMove(event) {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    const deltaX = event.clientX - centerX;
    const deltaY = event.clientY - centerY;

    const distanceToCenter = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const normalizedDistance = Math.min(distanceToCenter / (window.innerWidth / 2), 1);
    const sensitivity = minSensitivity + (maxSensitivity - minSensitivity) * normalizedDistance;

    const rotateY = -deltaX * sensitivity;
    const rotateX = -deltaY * sensitivity;

    cameraRotation(rotateX, rotateY, 0); // Rotate the camera

    // Reset the mouse position to the center
    window.requestAnimationFrame(() => {
      window.scrollTo(centerX, centerY);
    });
  }

  // Add event listener for mouse movement
  window.addEventListener('mousemove', handleMouseMove);

  function cameraRotation(x, y, z) {
    gsap.to(camera.rotation, {
      x,
      y,
      z,
      duration: 0.5, // Adjust the duration as needed
    });
  }

});

// Animation and loop
const animate = () => {
  renderer.render(scene, camera);
};

renderer.setAnimationLoop(animate); // this is the same as requestAnimationFrame(animate). It will call the animate function over and over again on every frame.

animate();