import React from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

const Navbar2 = ({ userData }) => {
  const state = useSelector((state) => state.handleCart);
  const navigate = useNavigate();

  const navbarStyle = {
    backgroundColor: 'rgba(193, 170, 208, 0.3)',
  };

  const buttonStyle = {
    backgroundColor: 'rgba(140, 150, 170, 0.3)',
    color: '#000',
    borderColor: '#000',
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('id');
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light py-1 sticky-top" style={navbarStyle}>
      <div className="container">
        <Link to="/usuario/dashboard2" className="navbar-brand fw-bold fs-4 px-2">
          <img
            src="/public/assets/logo.png"
            alt="Logo"
            style={{
              display: 'block',
              margin: '0 auto',
              maxWidth: '100%',
            }}
          />
        </Link>
        <button
          className="navbar-toggler mx-2"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="buttons text-center">
          <Link to="/usuario/perfil" className="btn m-2">
            <div style={{ display: 'flex', alignItems: 'center' }}>
            {typeof userData === 'string' && <span>{userData} </span>}
              <img
                src="/public/assets/user.png"
                alt="Usuario"
                style={{
                  maxWidth: '30px',
                  marginRight: '-1px',
                }}
              />
            </div>
          </Link>
          <Link to="/usuario/cart" className="btn btn-outline-dark m-2" style={buttonStyle}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <img
                src="/public/assets/carrito.png"
                alt="Carrito"
                style={{
                  maxWidth: '30px',
                  marginRight: '-1px',
                }}
              />
              <span> ({state.length})</span>
            </div>
          </Link>
          <Link to="/login" className="btn btn-outline-dark m-2" style={buttonStyle} onClick={handleLogout}>
            <i className="fa fa-sign-in-alt mr-1"></i> Salir
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar2;
