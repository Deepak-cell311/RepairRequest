// pages/AuthRedirect.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AuthRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const role = params.get("role");

    if (role === "admin") {
      navigate("/dashboard");
    } else if (role === "maintenance") {
      navigate("/assigned-requests");
    } else {
      navigate("/dashboard"); // default for requester or unknown
    }
  }, []);

  return <p>Redirecting based on role...</p>;
}
