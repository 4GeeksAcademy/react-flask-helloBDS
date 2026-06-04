import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../hooks/useAuth";

export const Private = () => {
    const navigate = useNavigate();
    const [userEmail, setUserEmail] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const token = auth.getToken();
        if (!token) {
            navigate("/login");
            return;
        }

        const backendUrl = import.meta.env.VITE_BACKEND_URL;
        if (!backendUrl) {
            setError("VITE_BACKEND_URL no está definido en .env");
            setLoading(false);
            return;
        }

        fetch(`${backendUrl}/api/profile`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(async (response) => {
                if (!response.ok) {
                    auth.clearToken();
                    navigate("/login");
                    return;
                }
                const data = await response.json();
                setUserEmail(data.user?.email || "");
            })
            .catch(() => {
                auth.clearToken();
                navigate("/login");
            })
            .finally(() => {
                setLoading(false);
            });
    }, [navigate]);

    return (
        <div className="container mt-5">
            {loading ? (
                <div className="alert alert-info">Validando tu sesión ...</div>
            ) : error ? (
                <div className="alert alert-danger">{error}</div>
            ) : (
                <>
                    <h1>Bienvenido a tu área privada</h1>
                    <p className="lead">La sesión está activa con el correo: <strong>{userEmail}</strong></p>
                    <div className="alert alert-success">
                        Solo los usuarios autenticados pueden ver esta página.
                    </div>
                </>
            )}
        </div>
    );
};
