"use client";

import React from "react";
import Link from "next/link";
import { Button } from "./ui/button";  // Import the Button component from your UI library

type Props = {
  text: string;
  className?: string;
};

const GetStartedButton = ({ text, className }: Props) => {
  return (
    <Link href="/get-started" passHref>
      <Button className={`w-60 ${className}`} asChild>
        <a>{text}</a>
      </Button>
    </Link>
  );
};

export default GetStartedButton;
