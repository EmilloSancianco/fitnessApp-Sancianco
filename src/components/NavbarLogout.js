import React, { useContext } from 'react';
import { Navbar, Container, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import UserContext from '../UserContext';

const NavbarLogout = () => {
  const navigate = useNavigate();
  const { unsetUser } = useContext(UserContext);

  const handleLogout = () => {
    unsetUser(); 
    navigate('/login', { replace: true });
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" fixed="top">
      <Container className="justify-content-end">
        <Button variant="outline-light" onClick={handleLogout}>
          Logout
        </Button>
      </Container>
    </Navbar>
  );
};

export default NavbarLogout;
