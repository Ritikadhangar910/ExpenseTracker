import React from "react";
import { Container, Nav, Navbar, Button } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { creadentialAction } from "../store/credentail";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
const Navbarfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state) => state.credential.isLoggedIn);
  function logoutHandler() {
    dispatch(creadentialAction.removeToken());
    localStorage.removeItem("token");
    navigate("/auth");
  }
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/auth");
    }
  }, [isLoggedIn, navigate]);
  return (
    <>
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container>
          <Navbar.Brand href="#home">ExpenseTracker</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              {isLoggedIn ? (
                <>
                  <Nav.Item>
                    <NavLink to="/" className="nav-link">
                      Home
                    </NavLink>
                  </Nav.Item>
                  <Button variant="primary" onClick={logoutHandler}>
                    logout
                  </Button>
                </>
              ) : (
                <Nav.Item>
                  <NavLink to="/auth" className="nav-link">
                    Auth
                  </NavLink>
                </Nav.Item>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default Navbarfile;
