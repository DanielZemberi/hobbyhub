import * as React from "react";
import { useAuth } from "@clerk/clerk-react";
import { Outlet, useNavigate } from "react-router-dom";

export default function AuthorizedLayout() {
  const { userId, isLoaded } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!userId && isLoaded) {
      navigate("/sign-in");
    }
  }, [isLoaded, navigate, userId]);

  if (!isLoaded) return "Loading...";

  return <Outlet />;
}
