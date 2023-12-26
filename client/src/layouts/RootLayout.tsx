import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import { Link, Outlet } from "react-router-dom";

export default function RootLayout() {
  return (
    <>
      <header className="sticky top-0 bg-white w-full left-0 right-0 flex justify-end p-5">
        <div>
          <SignedIn>
            <UserButton afterSignOutUrl="/sign-in" />
          </SignedIn>
          <SignedOut>
            <Link to="/sign-in">Sign In</Link>
          </SignedOut>
        </div>
      </header>
      <main className="p-5">
        <Outlet />
      </main>
    </>
  );
}
