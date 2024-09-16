import Image from "next/image";
import React from "react";
import emptyBox from "../../../public/images/emptyBox.gif";

const EmptyPage = () => {
  return (
    <div className="absolute top-[25%] left-0 right-0">
      <Image
        src={emptyBox}
        alt=""
        className="block  mx-auto"
      />

      <p className="text-white text-center text-2xl font-semibold">Please Connect your wallet to access this feature</p>
    </div>
  );
};

export default EmptyPage;
