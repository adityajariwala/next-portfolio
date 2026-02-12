"use client";

import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import React from "react";
import Callout from "./ui/Callout";
import Stat from "./ui/Stat";
import NewsletterSignup from "./ui/NewsletterSignup";

type Props = {
  source: MDXRemoteSerializeResult;
};

const components = {
  Callout,
  Stat,
  NewsletterSignup,
};

export default function MDXContent({ source }: Props) {
  return (
    <div className="blog-content">
      <MDXRemote {...source} components={components} />
    </div>
  );
}
