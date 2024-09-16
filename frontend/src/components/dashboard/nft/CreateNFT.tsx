"use client";

import { Dialog, DialogTrigger } from "@/components/ui/dialog";

import CreateNftForm from "./CreateNFTForm";
import { useState } from "react";

export function CreateNFT() {
  const [open, setOpen] = useState(false);

  function closeModal(){
    setOpen(false)
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          className={`mr-2 rounded border bg-white px-4 py-2 font-sans text-sm font-semibold  text-gray-900 no-underline focus:outline-none`}
        >
          Create
        </button>
      </DialogTrigger>
      <CreateNftForm onSubmit={closeModal}/>
    </Dialog>
  );
}
