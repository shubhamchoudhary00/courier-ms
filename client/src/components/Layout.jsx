import PropTypes from 'prop-types'; // Import PropTypes
import Sidebar from './Navbar';
import Header from './Header';

const Layout = ({ children }) => {
  return (
    <div style={styles.container}>
      <Sidebar />
      <div style={styles.contentWrapper}>
        {/* Uncomment the Header if needed */}
        {/* <Header /> */}
        <div style={styles.mainContent}>
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

// Styles for layout
const styles = {
  container: {
    display: 'flex',  // Flexbox layout
    height: '100vh',  // Take full viewport height
  },
  contentWrapper: {
    flex: 1,  // Take remaining space for content
    overflowY: 'auto',  // Scrollable content area
    // Custom scrollbar styles to hide scrollbar
    scrollbarWidth: 'none', // For Firefox
    msOverflowStyle: 'none', // For IE and Edge
  },
  mainContent: {
    padding: '20px',
    marginTop: '0px',  // Offset for the header if needed
    background: 'white',
  },
};

// Hide scrollbar for WebKit browsers (Chrome, Safari)
styles.contentWrapper['&::-webkit-scrollbar'] = {
  display: 'none',
};

export default Layout;
