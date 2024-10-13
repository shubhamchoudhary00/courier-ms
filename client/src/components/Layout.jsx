import PropTypes from 'prop-types'; // Import PropTypes
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = ({ children }) => {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ width: '100%' }}>
        <Header />
        <div style={{ position: 'relative', marginTop: '65px', marginLeft: '140px', background: 'white' }}>
          {children}
        </div>
      </div>
    </div>
  );
};

// PropTypes validation for the children prop
Layout.propTypes = {
  children: PropTypes.node.isRequired, // Ensure children is a valid React node
};

export default Layout;
