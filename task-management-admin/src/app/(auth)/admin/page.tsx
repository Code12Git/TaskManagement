"use client";

import React from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import { adminLogin } from "@/redux/actions/authAction";
import LoadingSpinner from "@/app/LoadingSpinner";
import ErrorDisplay from "@/app/ErrorDisplay";
import { useRouter } from "next/navigation";
import loginValidation from "@/validations/loginValidation";
const Page = () => {
 


  type LoginForm = z.infer<typeof loginValidation>;

  const dispatch = useAppDispatch();
  const router = useRouter()
  const { isLoading, error } = useAppSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    clearErrors,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginValidation),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const submitHandler = async(data: LoginForm) => {
    const res = await dispatch(adminLogin(data));
    clearErrors();
    reset();
    if(res?.statusCode === 200){
      router.push('/')
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-500 via-purple-600 to-pink-500 px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white/80 backdrop-blur-lg p-8 sm:p-10 rounded-3xl shadow-2xl w-full max-w-md"
      >
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-3xl sm:text-4xl font-bold text-gray-800 mb-6 text-center"
        >
          Admin Login
        </motion.h1>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-4"
          >
            <ErrorDisplay error={error} />
          </motion.div>
        )}

        <motion.form
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
          onSubmit={handleSubmit(submitHandler)}
        >
          <div>
            <label htmlFor="email" className="sr-only">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Email"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
              {...register("email")}
            />
            {errors?.email && (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-500 text-sm mt-1 ml-1 text-left"
              >
                {errors.email.message}
              </motion.p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="sr-only">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Password"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
              {...register("password")}
            />
            {errors?.password && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-500 text-sm mt-1 ml-1 text-left"
              >
                {errors.password.message}
              </motion.p>
            )}
          </div>

          <motion.button
            type="submit"
            disabled={isSubmitting || isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isSubmitting || isLoading ? (
              <>
                <LoadingSpinner />
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </motion.button>
        </motion.form>
      </motion.div>
    </div>
  );
};

export default Page;