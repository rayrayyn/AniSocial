import React, { useEffect, useState } from "react";
import Router from "next/router";
import toast from "react-hot-toast";
import Link from "next/link";

import { useUserContext } from "../contexts/state";
import { supabase } from "../utils/supabaseClient";
import { ROUTES } from "../constants/routes";

export default function SignUp() {
  const [email, setEmail] = useState("");

  const { session } = useUserContext();

  useEffect(() => {
    if (session) Router.push("/");
  }, [session]);

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      const { data, error } = await supabase.auth.api.resetPasswordForEmail(
        email,
        {
          redirectTo: `${window.location.origin}${ROUTES.updatePassword}`,
        }
      );

      if (error) {
        throw error.message;
      }

      if (data) {
        toast.success("Check your email for a password change request.");
      }
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <div className="bg-white shadow-lg border-gray-300 border-2 rounded py-5 px-5 mt-20 max-w-md w-full mx-4">
      <h4 className="text-center text-xl font-bold">Forgot Password</h4>

      <Link href={`${ROUTES.signIn}`}>
        <p className="text-center text-blue-500 hover:underline cursor-pointer">
          Login into Account
        </p>
      </Link>

      <form onSubmit={(e) => handleSubmit(e)}>
        <div className="m-2">
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

        <div className="mx-2 mt-5 flex items-center justify-center">
          <button
            type="submit"
            className="bg-gray-300 hover:bg-gray-400 rounded px-2 py-1"
          >
            Request Password Change
          </button>
        </div>
      </form>
    </div>
  );
}
