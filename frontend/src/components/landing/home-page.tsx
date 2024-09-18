"use client";

// import { Gluten } from "next/font/google";
import Image from "next/image";
import { FC } from "react";

import { Fade } from "react-awesome-reveal";

import { Button } from "@/components/ui/button";

import heroImg from "../../../public/images/caeser.svg";
import Link from "next/link";

// export const gluten = Gluten({ subsets: ["latin"] });

export const HomeSection: FC = () => {
  return (
    <>
      <section className="container mt-0 sm:mt-6">
        <div className="mx-auto grid max-w-screen-2xl px-4 pt-20 lg:grid-cols-12 lg:gap-8  lg:pt-28 xl:gap-0">
          <div className="mr-auto place-self-center  lg:col-span-7">
            <Fade direction="left">
              <h1 className="mb-4 max-w-3xl text-4xl font-extrabold leading-none tracking-tight text-white lg:text-5xl xl:text-6xl">
                Mint Your Digital Masterpiece with Ease.
                <br />
              </h1>
            </Fade>
            <Fade direction="left">
              <p className="md:text-xllg:mb-8 mb-6 max-w-2xl font-mono font-light text-gray-500 lg:text-2xl">
                Step into the digital realm where ownership meets creativity.
                With our platform, you can bring your unique digital assets to
                life as NFTs (Non-Fungible Tokens) with just a single click.
              </p>
            </Fade>

            <div className="mb-4 space-y-4 sm:flex sm:space-x-4 sm:space-y-0">
              <Fade direction="left">
                <Link href="/dashboard">
                  <Button
                    variant={"default"}
                    // className="h-12 min-w-[4rem] gap-2 rounded-xl border border-white/10 bg-primary px-4 py-3 font-bold text-foreground lg:min-w-[8rem] lg:rounded-2xl"
                    className="h-12 min-w-[4rem] gap-2 rounded-xl border border-white/10  px-4 py-3 font-bold text-foreground lg:min-w-[8rem] lg:rounded-2xl"
                    translate="no"
                  >
                    Get Started
                  </Button>
                </Link>
              </Fade>
            </div>
          </div>
          <div className=" lg:col-span-5 lg:mt-0 lg:flex">
            <Fade direction="right">
              <Image
                src={heroImg}
                alt=""
                width={500}
                height={500}
                className="w-[100%] md:w-[60%] lg:h-[95%] lg:w-[95%]"
              />
            </Fade>
          </div>
        </div>
      </section>
    </>
  );
};
