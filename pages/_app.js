import React from "react";
import Layout from "../components/Layout";
import { UserWrapper } from "../contexts/state";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <UserWrapper>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </UserWrapper>
  );
}

export default MyApp;
