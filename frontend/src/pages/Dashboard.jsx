import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-4">Welcome, {user.name}</h1>
      <p className="text-lg">Role: {user.role}</p>

      <button
        className="mt-5 bg-red-600 text-white px-4 py-2 rounded-lg"
        onClick={logout}
      >
        Logout
      </button>
    </div>
  );
}