import React from "react";
import { Link } from "react-router-dom";

function Home() {
    // Check if a user is logged in by checking for a token in local storage
    const isLoggedIn = !!localStorage.getItem('token'); 

    const handleLogout = () => {
        // Function to handle logout
        localStorage.removeItem('token'); // Remove the token from local storage
        window.location.reload(); // Reload the page to update the UI
    };

    return (
        <div>
            <h1>Welcome to the home page</h1>
            {!isLoggedIn && (
                <>
                    <Link to='/register'>Register</Link>
                    <Link to='/login'>Login</Link>
                    <Link to='/ho'>Login</Link>
                </>
            )}
            {isLoggedIn && (
                <>
                    <Link to='/inquiry'>Inquiry Form</Link>
                    <Link to='/profile'>Profile</Link>
                    <Link onClick={handleLogout}>Logout</Link>
                </>
            )}
        </div>
    );
}

export default Home;
