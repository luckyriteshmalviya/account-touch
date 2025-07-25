import React from "react";
import GridShape from "../../components/common/GridShape";
import { Link } from "react-router";
// import ThemeTogglerTwo from "../../components/common/ThemeTogglerTwo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
      <div className="relative flex flex-col justify-center w-full h-screen lg:flex-row dark:bg-gray-900 sm:p-0">
        {children}
        <div className="items-center hidden w-full h-full lg:w-1/2 bg-gradient-to-br from-brand-900 to-brand-950 dark:from-gray-800 dark:to-gray-900 lg:grid">
          <div className="relative flex items-center justify-center z-1">
            {/* <!-- ===== Common Grid Shape Start ===== --> */}
            <GridShape />
            <div className="flex flex-col items-center">
              <Link to="/" className="block">
                <img
                  src="/images/logo/accountouch logo-b.png"
                  alt="AccountTouch Logo"
                  className="w-72 h-auto drop-shadow-[0_4px_12px_rgba(0,0,0,0.3)] hover:drop-shadow-[0_6px_16px_rgba(0,0,0,0.4)] transition-shadow duration-300"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = "/images/logo/accountouch logo-a.png";
                  }}
                />
              </Link>
            </div>
          </div>
        </div>
        {/* <div className="fixed z-50 hidden bottom-6 right-6 sm:block">
          <ThemeTogglerTwo />
        </div> */}
      </div>
    </div>
  );
}
