import React, { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import Router from "next/router";

import { supabase } from "../utils/supabaseClient";
import { useUserContext } from "../contexts/state";
import { ROUTES } from "../constants/routes";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { session } = useUserContext();

  useEffect(() => {
    if (session) Router.push("/");
  }, [session]);

  const handleSignIn = async (e) => {
    e.preventDefault();

    const { error: signInError } = await supabase.auth.signIn({
      email,
      password,
    });

    if (signInError) {
      toast.error(signInError.message);
    } else {
      Router.push("/");
    }
  };

  return (
    <div className="bg-white shadow-lg border-gray-300 border-2 rounded py-5 px-5 mt-20 max-w-md w-full mx-4">
      <h4 className="text-center text-xl font-bold">Sign In</h4>
      <Link href={`${ROUTES.signUp}`}>
        <p className="text-center text-blue-500 hover:underline cursor-pointer">
          Create an Account
        </p>
      </Link>

      <form onSubmit={(e) => handleSignIn(e)}>
        <div className="mx-2 my-2">
          <label htmlFor="email" className="block">
            Email
          </label>
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
          <label htmlFor="password" className="block">
            Password
          </label>
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
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
