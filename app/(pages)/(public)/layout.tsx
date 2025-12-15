
import React from "react";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
      <div className=" w-full space-y-8">
        {children}
      </div>
    </div>
  );
}
