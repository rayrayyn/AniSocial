import React, { useEffect, useState } from "react";
import Router from "next/router";
import toast from "react-hot-toast";
import { useUserContext } from "../contexts/state";
import { supabase } from "../utils/supabaseClient";

export default function SignUp() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { session } = useUserContext();

  useEffect(() => {
    if (session) Router.push("/");
  }, [session]);

  const handleSignUp = async (e) => {
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
        toast.error("Username already taken!");
      } else {
        toast.error(signUpError.message);
      }
    } else {
      toast.success("Check your email for a confirmation link.");
    }
  };

  return (
    <div>
      <h4>Sign up</h4>
      <form onSubmit={(e) => handleSignUp(e)}>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          label="Email address"
          autoComplete="email"
          placeholder="Type in your email address"
          defaultValue={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          label="Password"
          type="password"
          defaultValue={password}
          autoComplete="current-password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <label htmlFor="username">Username</label>
        <input
          id="username"
          label="Username"
          type="text"
          defaultValue={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <button type="submit">SignUp</button>
      </form>
      <hr />
    </div>
  );
}
