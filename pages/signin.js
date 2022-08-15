import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Router from "next/router";
import { supabase } from "../utils/supabaseClient";
import { useUserContext } from "../contexts/state";

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
    <div>
      <h4>Sign In</h4>
      <form onSubmit={(e) => handleSignIn(e)}>
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

        <button type="submit">SignIn</button>
      </form>
      <hr />
    </div>
  );
}
