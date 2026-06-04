import { Link, useNavigate } from "react-router-dom";
import { auth } from "../hooks/useAuth";

export const Navbar = () => {
	const navigate = useNavigate();
	const isAuthenticated = auth.isAuthenticated();

	const handleLogout = () => {
		auth.clearToken();
		navigate("/login");
	};

	return (
		<nav className="navbar navbar-light bg-light">
			<div className="container">
				<Link to="/">
					<span className="navbar-brand mb-0 h1">React Boilerplate</span>
				</Link>
				<div className="d-flex gap-2">
					<Link to="/demo">
						<button className="btn btn-primary">Demo</button>
					</Link>
					{isAuthenticated ? (
						<>
							<Link to="/private">
								<button className="btn btn-outline-success">Privado</button>
							</Link>
							<button className="btn btn-outline-danger" onClick={handleLogout}>Cerrar sesión</button>
						</>
					) : (
						<>
							<Link to="/login">
								<button className="btn btn-outline-primary">Iniciar sesión</button>
							</Link>
							<Link to="/signup">
								<button className="btn btn-outline-secondary">Registrarse</button>
							</Link>
						</>
					)}
				</div>
			</div>
		</nav>
	);
};