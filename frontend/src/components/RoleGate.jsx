import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function RoleGate({ allow, children }) {
  const { user } = useContext(AuthContext);

  if (!allow.includes(user?.role)) {
    return (
      <div className="flex items-center justify-center h-screen text-xl font-semibold text-red-600">
        You are not authorized to view this page.
      </div>
    );
  }

  return children;
}