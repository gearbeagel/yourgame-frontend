import React from 'react';
import ThemeSwitcher from './ThemeSwitcher';

const Navbar = ({ isAuthenticated, handleLogout, setCurrentPage }) => {
  const handleNavLinkClick = (page) => {
    setCurrentPage(page);
  };

  return (
    <nav className="navbar navbar-expand-lg">
      <div className="container-fluid">
        <a className="navbar-brand" href="/" onClick={() => handleNavLinkClick('home')}>Home</a>
        
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <a className="nav-link" href="/stories" onClick={() => handleNavLinkClick('stories')}>View Stories</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/create" onClick={() => handleNavLinkClick('create')}>Create a New Story</a>
            </li>
            {isAuthenticated ? (
              <>
                <li className="nav-item">
                  <a className="nav-link" href="/logout" onClick={handleLogout}>Logout</a>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <a className="nav-link" href="/login" onClick={() => handleNavLinkClick('login')}>Login</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/register" onClick={() => handleNavLinkClick('register')}>Register</a>
                </li>
              </>
            )}
          </ul>
          <ThemeSwitcher />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
