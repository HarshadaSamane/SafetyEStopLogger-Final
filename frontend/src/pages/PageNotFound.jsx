import React from "react";
import { Link } from "react-router-dom";

export const PageNotFound = () => {
  return (
    <div className="w-full h-screen flex items-center justify-center flex-col bg-black text-white">
      <h1 className="font-extrabold text-4xl mb-5">Page Not Found!</h1>
      <Link to="/login" className="underline text-blue-400">Go to Login.</Link>
    </div>
  );
};
