import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const ThreeScene: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log("ThreeScene component mounted");

    const mount = mountRef.current!;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000); // Set background color to black
    mount.appendChild(renderer.domElement);
    console.log("Renderer DOM element appended");

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5).normalize();
    scene.add(directionalLight);

    // Load the 3D model from local file
    const loader = new GLTFLoader();
    loader.load(
      "/models/scene.gltf", // Path to your local model file
      (gltf) => {
        const model = gltf.scene;
        scene.add(model);
        console.log("Model loaded");

        // Adjust camera to fit the model
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3()).length();
        const center = box.getCenter(new THREE.Vector3());

        camera.near = size / 100;
        camera.far = size * 100;
        camera.updateProjectionMatrix();

        // Adjust camera position to be inside the model
        camera.position.copy(center);
        camera.position.x -= size / 8.0; // Adjust these values to position the camera inside the model
        camera.position.y -= size / 11.0;
        camera.position.z += size / 25.0;

        // Move the camera forward a bit
        camera.position.z -= size / 5.0;

        // Calculate the point to look at for a 90-degree right rotation
        const lookAtPoint = new THREE.Vector3(
          center.x + Math.cos(-Math.PI / 1.8) * size,
          //center.y,
          center.y + Math.sin(-Math.PI / 0.1) * size,
          center.z + Math.sin(-Math.PI / 2) * size,
        );

        camera.lookAt(lookAtPoint);

        // Update controls in the animation loop
        const animate = () => {
          requestAnimationFrame(animate);
          renderer.render(scene, camera);
        };

        animate();
      },
      undefined,
      (error) => {
        console.error("An error occurred while loading the model", error);
      },
    );

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      console.log("ThreeScene component unmounted");
      window.removeEventListener("resize", handleResize);
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: -1,
      }}
    />
  );
};

export default ThreeScene;
