import { useState, createContext, useContext } from "react";

const UserContext = createContext({
  session: null,
  setSession: () => {},
});

export function UserWrapper({ children }) {
  const [session, setSession] = useState(null);
  const value = { session, setSession };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUserContext() {
  return useContext(UserContext);
}
