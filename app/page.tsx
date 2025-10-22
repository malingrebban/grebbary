"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const handleRoleSelection = (role: "developer" | "designer") => {
    // Save role to localStorage
    localStorage.setItem("grebbary-role", role);
    // Redirect to role-specific page
    router.push(`/${role}`);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <main className="flex min-h-screen w-full max-w-4xl flex-col items-start justify-center py-8 sm:py-16 px-8 sm:px-8">
        {/* Title */}
        <h1 className="text-5xl sm:text-6xl md:text-8xl font-bold text-left text-white mb-12 sm:mb-20 tracking-wider">
          Grebbary
        </h1>

        {/* Description */}
        <div className="text-left text-white mb-12 sm:mb-20 w-full max-w-2xl">
          <div>
            <p className="text-xl sm:text-2xl font-bold leading-relaxed mb-0 sm:mb-0">
              Discover. Reuse. Create
            </p>
            <p className="text-xl sm:text-2xl font-bold leading-relaxed mb-4 sm:mb-6">
              — the Grebban way.
            </p>
          </div>
          <p className="text-base sm:text-lg leading-relaxed">
            A central place where everyone at Grebban can save, share, and get
            inspired by the code and design we actually use in our projects.
          </p>
        </div>

        {/* Role Selection Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 w-full max-w-2xl">
          <button
            onClick={() => handleRoleSelection("developer")}
            className="flex-1 px-8 py-6 border-2 border-white rounded-lg text-white text-lg font-medium transition-all duration-200 hover:bg-white hover:text-black focus:outline-none focus:ring-4 focus:ring-white focus:ring-opacity-50"
          >
            Developer
          </button>

          <button
            onClick={() => handleRoleSelection("designer")}
            className="flex-1 px-8 py-6 border-2 border-white rounded-lg text-white text-lg font-medium transition-all duration-200 hover:bg-white hover:text-black focus:outline-none focus:ring-4 focus:ring-white focus:ring-opacity-50"
          >
            Designer
          </button>
        </div>
      </main>
    </div>
  );
}
