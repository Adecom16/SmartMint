import React from 'react';

interface NavBarProps {
  tab: number;
  setTab: (tab: number) => void;
}

const ContractOverviewNav: React.FC<NavBarProps> = ({ tab, setTab }) => {
  return (
    <nav className="fixed left-0 right-0 mx-auto mb-4 w-full border bg-background">
      <div className="container px-3 py-3 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-start rtl:justify-end">
            <div className="flex">
              {['Overview', 'Events', 'Explorer'].map((label, index) => (
                <button
                  key={index}
                  className={`mr-2 rounded border px-4 py-2 font-sans text-sm font-semibold no-underline focus:outline-none ${
                    tab === index ? 'bg-white text-gray-900' : 'text-white'
                  }`}
                  onClick={() => setTab(index)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center">
            <div className="ms-3 flex items-center">
              <div>
                <button
                  type="button"
                  className="flex rounded-full bg-gray-800 text-sm focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                  aria-expanded="false"
                  data-dropdown-toggle="dropdown-user"
                >
                  <span className="sr-only">Open user menu</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default ContractOverviewNav;