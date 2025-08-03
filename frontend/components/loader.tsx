import { Spinner } from "@heroui/spinner";
import React from "react";

const Loader = () => {
  return (
    <div className="h-[100vh]  w-[100vw] flex justify-center items-center">
      <Spinner color="warning" />
    </div>
  );
};

export default Loader;
