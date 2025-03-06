import React from "react";
import ThreeScene from "./components/ThreeScene";

function App() {
  return (
    <div className="bg-transparent flex justify-center items-center h-screen w-screen relative">
      <ThreeScene />
      <h1 className="text-white text-4xl z-10">Hello, World!</h1>
    </div>
  );
}

export default App;
