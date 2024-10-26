"use client"; // Ensure this component runs on the client-side

import React from 'react';
import { tailspin } from 'ldrs'; // Importing tailspin loader

// Register the tailspin loader
tailspin.register();

type LoaderProps = {
  size?: number;   // Optional size for the loader (default is 40)
  stroke?: number; // Optional stroke width for the loader (default is 5)
  speed?: number;  // Optional speed of the loader's spinning animation (default is 0.9)
  color?: string;  // Optional color of the loader (default is 'orange')
  loading: boolean; // Boolean flag to control whether the loader is visible
};

const Loader: React.FC<LoaderProps> = ({
  size = 40,
  stroke = 5,
  speed = 0.9,
  color = 'orange',
  loading
}) => {
  if (!loading) return null; // Do not render anything if not loading

  return (
    <div className="flex justify-center mt-4">
      {/* Loader component with customizable props */}
      <l-tailspin size={size} stroke={stroke} speed={speed} color={color}></l-tailspin>
    </div>
  );
};

export default Loader;
