import React, { useEffect } from "react";
import Head from "next/head";
import { Toaster } from "react-hot-toast";

import { supabase } from "../utils/supabaseClient";
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
      <Head>
        <title>AniSocial</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Navbar />
      <main className="flex justify-center">{children}</main>
      <Toaster position="top-center" reverseOrder={false} />
    </>
  );
}
