import React, { useEffect } from "react";
import { supabase } from "../utils/supabaseClient";
import { Toaster } from "react-hot-toast";
import Navbar from "./Navbar";
import { useUserContext } from "../contexts/state";

export default function Layout({ children }) {
  const { session, setSession } = useUserContext();

  useEffect(() => {
    setSession(supabase.auth.session());

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, [session, setSession]);

  return (
    <>
      <Navbar />
      <main className="flex justify-center">{children}</main>
      <Toaster position="top-center" reverseOrder={false} />
    </>
  );
}
