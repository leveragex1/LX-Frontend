import React from 'react';
import '../styles/footer.css';


const Footer = () => {
  return (
    <footer className="main">
        <p>©2025 LeverageX All Rights Reserved.</p>
        <p>ISO 2004:2025</p>
        <div className="footer-links">
          {/* <Link to="/term"> Term  </Link> */}
          <a href="/term" >Terms & Conditions</a>
          <a href="/privacy">Privacy Policy</a>
          <br />
          <a >leveragexfund@gmail.com</a>
        </div>
      </footer>
  )
}

export default Footer;