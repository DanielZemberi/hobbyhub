import { SignInButton, SignUpButton } from "@clerk/clerk-react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { AuthorizedLayout, RootLayout } from "../layouts";
import PickInterestsPage from "../pages/PickInterestsPage";
import LobbyPage from "../pages/LobbyPage";

const Router = () => {
  const router = createBrowserRouter([
    {
      element: <RootLayout />,
      children: [
        {
          path: "/",
          element: <div className="w-full bg-red-500">HobbyHub homepage</div>,
        },
        {
          path: "/sign-in",
          element: (
            <div className="flex justify-center items-center">
              <SignInButton afterSignInUrl="/authorized" />
            </div>
          ),
        },
        {
          path: "/sign-up",
          element: (
            <div>
              <SignUpButton />
            </div>
          ),
        },
        {
          element: <AuthorizedLayout />,
          path: "/",
          children: [
            { path: "/pick-interests", element: <PickInterestsPage /> },
            { path: "/lobby", element: <LobbyPage /> },
          ],
        },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
};

export default Router;
