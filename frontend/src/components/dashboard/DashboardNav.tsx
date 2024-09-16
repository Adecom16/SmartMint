"use client";

import React, { useEffect, useState } from "react";

interface Tab {
  id: number;
  label: string;
}

interface TabNavigationProps {
  tabs: Tab[];
  selectedTab: number;
  setTab: (id: number) => void;
}

const DashboardTabNavigation: React.FC<TabNavigationProps> = ({
  tabs,
  selectedTab,
  setTab,
}) => {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <div className="fixed left-0 z-30 right-0 mx-auto mb-4 w-full border bg-background">
      <div className="container px-3 py-3 lg:px-5 lg:pl-14">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-start rtl:justify-end">
            <div className="flex">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`mr-2 rounded border px-4 py-2 font-sans text-sm font-semibold no-underline focus:outline-none ${
                    selectedTab === tab.id
                      ? "bg-white text-gray-900"
                      : "text-white"
                  }`}
                  onClick={() => setTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardTabNavigation;
