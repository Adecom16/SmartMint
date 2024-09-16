import React from "react";

interface InfoCardProps {
  title: string;
  content: number | string;
}

const InfoCard: React.FC<InfoCardProps> = ({ title, content }) => {
  return (
    <div className="mt-8 flex justify-center">
      <div className="mr-8 block w-full max-w-sm cursor-pointer rounded-lg border p-5 shadow">
        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          {title}
        </h5>
        <p className="text-lg font-normal text-gray-100">{content}</p>
      </div>
    </div>
  );
};

export default InfoCard;
