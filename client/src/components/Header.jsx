import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setUser } from '../redux/features/userSlice';

function Header() {
  const navigate=useNavigate();
  const dispatch=useDispatch();

  const handleLogout=()=>{
    localStorage.clear();
    dispatch(setUser(null));
    navigate('/login');
  }
  return (
    <>
      <Navbar bg="dark" data-bs-theme="dark" style={{paddingLeft:'6px',position:'fixed',width:'100%',zIndex:'99',display:'flex',justifyContent:'space-between',paddingRight:'25px'}}>
        <Container style={{margin:'0'}}>
          <Navbar.Brand href="#home">Navbar</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="#home">Home</Nav.Link>
            <Nav.Link href="#features">Features</Nav.Link>
            <Nav.Link href="#pricing">Pricing</Nav.Link>
          </Nav>
        </Container>
        <span style={{color:'white',cursor:'pointer'}} onClick={handleLogout}>Logout</span>
      </Navbar>
    

   
    </>
  );
}

export default Header;