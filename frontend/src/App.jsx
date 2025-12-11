import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import RoleGate from "./components/RoleGate";


import Dashboard from "./pages/Dashboard";
import Sales from "./pages/Sales";
import Inventory from "./pages/Inventory";
import Reports from "./pages/Reports";
import Login from "./pages/Login";


export default function App() {
return (
<AuthProvider>
<BrowserRouter>
<Routes>
<Route path="/login" element={<Login />} />


<Route path="/" element={<Navigate to="/dashboard" />} />


<Route
path="/dashboard"
element={
<PrivateRoute>
<Dashboard />
</PrivateRoute>
}
/>


<Route
path="/sales"
element={
<PrivateRoute>
<RoleGate allow={["Admin", "Pharmacist", "Cashier"]}>
<Sales />
</RoleGate>
</PrivateRoute>
}
/>


<Route
path="/inventory"
element={
<PrivateRoute>
<RoleGate allow={["Admin", "Pharmacist"]}>
<Inventory />
</RoleGate>
</PrivateRoute>
}
/>


<Route
path="/reports"
element={
<PrivateRoute>
<RoleGate allow={["Admin"]}>
<Reports />
</RoleGate>
</PrivateRoute>
}
/>
</Routes>
</BrowserRouter>
</AuthProvider>
);
}