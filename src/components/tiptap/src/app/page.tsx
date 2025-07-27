"use client";

import { BlockEditor } from "../components/BlockEditor";
import React from "react";

type Props = {};

const Page = (props: Props) => {
  if (typeof window === "undefined") {
    return null;
  }
  return (
    <div className="">
      <BlockEditor />
    </div>
  );
};
export default Page;
