import React, { useState } from "react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";

import { supabase } from "../utils/supabaseClient";
import { ROUTES } from "../constants/routes";

export default function SignUp() {
  const router = useRouter();

  const [newPassword, setNewPassword] = useState("");

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      const { data, error } = await supabase.auth.update({
        password: newPassword,
      });

      if (error) {
        throw error.message;
      }

      if (data) {
        toast.success("Password Updated!");
        router.push(ROUTES.home);
      }
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <div className="bg-white shadow-lg border-gray-300 border-2 rounded py-5 px-5 mt-20 max-w-md w-full mx-4">
      <h4 className="text-center text-xl font-bold">Update Password</h4>
      <form onSubmit={(e) => handleSubmit(e)}>
        <div className="m-2">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            label="Password"
            type="password"
            defaultValue={newPassword}
            autoComplete="current-password"
            onChange={(e) => setNewPassword(e.target.value)}
            className="border-2 border-gray-200 rounded hover:bg-gray-50 w-full p-1"
          />
        </div>

        <div className="mx-2 mt-5 flex items-center justify-center">
          <button
            type="submit"
            className="bg-gray-300 hover:bg-gray-400 rounded px-2 py-1"
          >
            Change Password
          </button>
        </div>
      </form>
    </div>
  );
}
