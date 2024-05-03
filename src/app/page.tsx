"use client";
import React from "react";
import Todo from "../components/Todo";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Home: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <ToastContainer /> {/* toast container to show toast messages */}
      <h1 className="text-3xl font-semibold mb-4"><s>To</s>Do !</h1>
      <Todo />
    </div>
  );
};

export default Home;
