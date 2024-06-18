"use client";
import { useEffect, useLayoutEffect, useState } from "react";
import PreloaderComponent from "./components/PreloaderComponent";
import { useAuth } from "./context/GlobalContext";
import Link from "next/link";
import moment from "moment";
import WithAuth from "./components/WithAuth";
import SearchBar from "./components/SearchBar";
import PostComponent from "./components/PostComponent";
import UniversalPaginator from "./components/UniversalPaginator";

function Home() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return <PreloaderComponent />
  } else {
    return (
      <>
        <SearchBar />
        <div className="grid grid-cols-12 my-5">
          <UniversalPaginator allowEdit={false} resourceName="PostsHome" limit={1} />
        </div>
      </>
    )
  }
}
export default WithAuth(Home);
