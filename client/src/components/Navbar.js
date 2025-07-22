import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiHome, FiLogOut, FiSun, FiMoon } from 'react-icons/fi';
import { motion } from 'framer-motion';
import AuthContext from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);

    return (
        <motion.nav
            className="navbar"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <motion.h1
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2"
            >
                <span className="text-primary">Task Manager</span>
            </motion.h1>

            <div className="nav-links">
                {user ? (
                    <>
                        <motion.div whileHover={{ scale: 1.05 }}>
                            <Link to="/dashboard" className="nav-link flex items-center gap-1">
                                <FiHome /> Dashboard
                            </Link>
                        </motion.div>
                        <motion.button
                            onClick={logout}
                            className="logout-btn flex items-center"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <FiLogOut /> Logout
                        </motion.button>
                    </>
                ) : (
                    <>
                        <motion.div whileHover={{ scale: 1.05 }}>
                            <Link
                                to="/login"
                                className="nav-link login-btn"
                            >
                                Login
                            </Link>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.05 }}>
                            <Link
                                to="/register"
                                className="nav-link register-btn"
                            >
                                Register
                            </Link>
                        </motion.div>
                    </>
                )}
            </div>
        </motion.nav>
    );
};
export default Navbar;