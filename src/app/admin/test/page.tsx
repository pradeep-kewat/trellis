"use client";

import { GetSignedURL } from "@/app/actions/aws";
import { useEffect } from "react";

const Test = () => {
  useEffect(() => {
    const getData = async () => {
      const response = await GetSignedURL();
      console.log(response);
    };
    getData();
  }, []);

  return (
    <div>
      <h1>Test</h1>
    </div>
  );
};

export default Test;
