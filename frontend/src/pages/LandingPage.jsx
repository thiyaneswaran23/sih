import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

 function LandingPage() {
  return (
    <div className="bg-light vh-100 d-flex flex-column justify-content-center align-items-center text-center">
   
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top shadow">
        <div className="container">
          <a className="navbar-brand fw-bold fs-4" href="#">
            AlumniConnect
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <a className="nav-link" href="#features">
                  Features
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#about">
                  About
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#contact">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      
      <header className="container mt-5 pt-5">
        <div className="row align-items-center">
          <div className="col-lg-6 text-lg-start text-center">
            <h1 className="display-4 fw-bold text-dark mb-3">
              Centralized Alumni Data & Engagement
            </h1>
            <p className="lead text-muted mb-4">
              Empower institutions with a unified platform to connect, engage,
              and collaborate with their alumni network effortlessly.
            </p>
            <div className="d-flex gap-3 justify-content-lg-start justify-content-center">
              <a href="/signin" className="btn btn-primary btn-lg px-4 shadow-sm">
                Sign In
              </a>
              <a href="/signup" className="btn btn-outline-dark btn-lg px-4 shadow-sm">
                Sign Up
              </a>
            </div>
          </div>

          <div className="col-lg-6 mt-5 mt-lg-0 text-center">
            <img
              src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              alt="Alumni Network"
              className="img-fluid rounded-3 shadow-lg"
              style={{ maxHeight: "350px" }}
            />
          </div>
        </div>
      </header>

 
      <section id="features" className="container my-5 py-5">
        <h2 className="fw-bold mb-4">Key Features</h2>
        <div className="row g-4">
          <div className="col-md-4">
            <div className="card shadow h-100">
              <div className="card-body">
                <h5 className="card-title fw-bold">Centralized Data</h5>
                <p className="card-text text-muted">
                  Manage all alumni data in one secure, scalable platform.
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card shadow h-100">
              <div className="card-body">
                <h5 className="card-title fw-bold">Seamless Engagement</h5>
                <p className="card-text text-muted">
                  Organize events, reunions, and mentorship programs with ease.
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card shadow h-100">
              <div className="card-body">
                <h5 className="card-title fw-bold">Smart Insights</h5>
                <p className="card-text text-muted">
                  Leverage analytics to strengthen alumni-institution relations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

    
      <footer className="bg-dark text-white text-center py-3 w-100 mt-auto">
        <p className="mb-0 small">
          © {new Date().getFullYear()} AlumniConnect | Smart Education Initiative
        </p>
      </footer>
    </div>
  );
}



export default LandingPage;