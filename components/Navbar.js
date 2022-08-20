import React, { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { UserCircleIcon } from "@heroicons/react/outline";

import { useUserContext } from "../contexts/state";
import { supabase } from "../utils/supabaseClient";
import { ROUTES } from "../constants/routes";

export default function Navbar() {
  const [clicked, setClicked] = useState(false);

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error(error);
    } else {
      setClicked(false);
    }
  };

  const { session } = useUserContext();

  return (
    <nav className="h-16 p-4 border-b-2 border-gray-200 sticky top-0 bg-white shadow-sm">
      <div className="relative flex justify-between items-center max-w-screen-md w-full h-full m-auto">
        <Link href={ROUTES.home}>
          <a>AniSocial</a>
        </Link>

        <div className="h-full inline-block">
          <div
            className="h-full flex items-center cursor-pointer"
            onClick={() => setClicked(!clicked)}
          >
            {session && session.user.user_metadata.username}
            <UserCircleIcon className="ml-3 h-full" />
          </div>

          <div
            className={`${
              clicked ? "block" : "hidden"
            } absolute right-0 bg-white mt-4 p-4 border border-gray-200 shadow-sm rounded-b-md whitespace-nowrap`}
          >
            {session ? (
              <>
                <div>
                  <Link
                    href={`${ROUTES.profile}/${session.user.user_metadata.username}`}
                  >
                    <a onClick={() => setClicked(false)}>Profile</a>
                  </Link>
                </div>
                <div className="cursor-pointer" onClick={signOut}>
                  Sign Out
                </div>
              </>
            ) : (
              <>
                <div>
                  <Link href={ROUTES.signIn}>
                    <a onClick={() => setClicked(false)}>Sign In</a>
                  </Link>
                </div>
                <div>
                  <Link href={ROUTES.signUp}>
                    <a onClick={() => setClicked(false)}>Sign Up</a>
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
