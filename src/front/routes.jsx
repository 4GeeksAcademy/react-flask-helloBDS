// Import necessary components and functions from react-router-dom.

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  Navigate,
} from "react-router-dom";
import { Layout } from "./pages/Layout";
import { Home } from "./pages/Home";
import { Single } from "./pages/Single";
import { Demo } from "./pages/Demo";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { Private } from "./pages/Private";

const hasValidToken = () => Boolean(sessionStorage.getItem("token"));

const RequireAuth = ({ children }) => {
  return hasValidToken() ? children : <Navigate to="/login" replace />;
};

const RedirectAuthenticated = ({ children }) => {
  return hasValidToken() ? <Navigate to="/private" replace /> : children;
};

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />} errorElement={<h1>Not found!</h1>} >
      <Route path="/" element={<Home />} />
      <Route path="/single/:theId" element={<Single />} />
      <Route path="/demo" element={<Demo />} />
      <Route path="/login" element={<RedirectAuthenticated><Login /></RedirectAuthenticated>} />
      <Route path="/signup" element={<RedirectAuthenticated><Signup /></RedirectAuthenticated>} />
      <Route path="/private" element={<RequireAuth><Private /></RequireAuth>} />
    </Route>
  )
);