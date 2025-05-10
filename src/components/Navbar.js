import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Navbar.css';

import logo from "../Assets/logo/logo.png";

const Navbar = ({ isAuthenticated, loggedInUser, handleLogout }) => {
    const [watchlistType, setWatchlistType] = useState(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const location = useLocation();

    // UseEffect to get the selected watchlistType from localStorage
    useEffect(() => {
        const savedWatchlistType = localStorage.getItem('watchlistType');
        setWatchlistType(savedWatchlistType);
    }, [location]);

    const watchListLinkText = watchlistType === '1'
        ? 'WatchList1'
        : watchlistType === '2'
            ? 'WatchList2'
            : 'WatchList';

    const watchListLinkPath = watchlistType === '1'
        ? '/watchlist1'
        : watchlistType === '2'
            ? '/watchlist2'
            : '/watchlist';


    // Toggle for the hamburger menu
    const handleMenuToggle = () => {
        setMenuOpen(!menuOpen);
    };

    // Close the menu when a link is clicked
    const handleLinkClick = () => {
        setMenuOpen(false);
    };

    return (
        <nav>
            <div className="logo">
                <a href="/home"><img src={logo} alt="Logo" /></a>
            </div>
            <div className={`nav-links ${menuOpen ? 'active' : ''}`}>
                <div className='menu-items'>
                    <Link to="/home" onClick={handleLinkClick}>Home</Link>
                    <Link to="/plans" onClick={handleLinkClick}>Plans</Link>
                    <Link to={watchListLinkPath} onClick={handleLinkClick}>{watchListLinkText}</Link>
                    <Link to="/pnl" onClick={handleLinkClick}>P&L</Link>
                    {/* <Link to="/dashboard" onClick={handleLinkClick}>Admin</Link> */}
                </div>
                {isAuthenticated ? (
                    <>
                        <span>{loggedInUser}</span>
                        <button className='log' onClick={handleLogout}>Logout</button>
                    </>
                ) : (
                    <Link className='log' to="/login" onClick={handleLinkClick}>Login</Link>
                )}
            </div>

            <div className="hamburger" onClick={handleMenuToggle}>
                {menuOpen ? (
                    <span className="cross">✖</span>
                ) : (
                    <span className="bar"></span>
                )}
                <span className="bar "></span>
                <span className="bar "></span>
            </div>
        </nav>
    );
};

export default Navbar;
