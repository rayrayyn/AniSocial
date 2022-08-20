import React, { useEffect, useState } from "react";
import Router from "next/router";
import toast from "react-hot-toast";
import Link from "next/link";

import { useUserContext } from "../contexts/state";
import { supabase } from "../utils/supabaseClient";
import { ROUTES } from "../constants/routes";

export default function SignUp() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { session } = useUserContext();

  useEffect(() => {
    if (session) Router.push("/");
  }, [session]);

  const handleSignUp = async (e) => {
    try {
      e.preventDefault();

      const { error: signUpError } = await supabase.auth.signUp(
        {
          email,
          password,
        },
        {
          data: {
            username: username,
          },
        }
      );

      if (signUpError) {
        if (signUpError.message.includes("profiles_username")) {
          throw "Username already taken!";
        }

        throw signUpError.message;
      }

      toast.success("Check your email for a confirmation link.");
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <div className="bg-white shadow-lg border-gray-300 border-2 rounded py-5 px-5 mt-20 max-w-md w-full mx-4">
      <h4 className="text-center text-xl font-bold">Sign Up</h4>
      <form onSubmit={(e) => handleSignUp(e)}>
        <div className="mx-2 my-2">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            label="Username"
            type="text"
            defaultValue={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border-2 border-gray-200 rounded hover:bg-gray-50 w-full p-1"
          />
        </div>

        <div className="mx-2 my-2">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            label="Email address"
            autoComplete="email"
            defaultValue={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border-2 border-gray-200 rounded hover:bg-gray-50 w-full p-1"
          />
        </div>

        <div className="mx-2 my-2">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            label="Password"
            type="password"
            defaultValue={password}
            autoComplete="current-password"
            onChange={(e) => setPassword(e.target.value)}
            className="border-2 border-gray-200 rounded hover:bg-gray-50 w-full p-1"
          />
        </div>

        <div className="mx-2 mt-5 flex items-center justify-center">
          <button
            type="submit"
            className="bg-gray-300 hover:bg-gray-400 rounded px-2 py-1"
          >
            Register
          </button>
        </div>
      </form>
    </div>
  );
}
