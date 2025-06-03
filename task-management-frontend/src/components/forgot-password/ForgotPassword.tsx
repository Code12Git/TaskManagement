"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiEye, FiEyeOff } from "react-icons/fi";

const ForgotPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-semibold text-center mb-6">
          Reset Password
        </h2>
        <form className="space-y-4">
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="New password"
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {showPassword ? (
              <FiEyeOff
                onClick={() => setShowPassword(false)}
                className="absolute cursor-pointer top-1/2 right-4 transform -translate-y-1/2 text-gray-400"
              />
            ) : (
              <FiEye
                onClick={() => setShowPassword(true)}
                className="absolute cursor-pointer top-1/2 right-4 transform -translate-y-1/2 text-gray-400"
              />
            )}{" "}
          </div>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm new password"
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {showConfirmPassword ? (
              <FiEye
                onClick={() => setShowConfirmPassword(false)}
                className="absolute cursor-pointer top-1/2 right-4 transform -translate-y-1/2 text-gray-400"
              />
            ) : (
              <FiEyeOff
                onClick={() => setShowConfirmPassword(true)}
                className="absolute cursor-pointer top-1/2 right-4 transform -translate-y-1/2 text-gray-400"
              />
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition duration-300"
          >
            Reset Password
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
