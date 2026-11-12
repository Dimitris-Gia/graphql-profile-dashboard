import { login, logout, getToken } from "./auth.js";
import { getProfileData } from "./profile.js";
import {
    drawXpProgressChart,
    drawXpByProjectChart
} from "./charts.js";

// Get HTML elements
const loginSection = document.querySelector("#login-section");
const profileSection = document.querySelector("#profile-section");

const loginForm = document.querySelector("#login-form");
const loginButton = document.querySelector("#login-button");
const loginError = document.querySelector("#login-error");

const logoutButton = document.querySelector("#logout-button");


// Show the profile dashboard
function showProfile() {
    loginSection.hidden = true;
    profileSection.hidden = false;
}


// Show the login form
function showLogin() {
    profileSection.hidden = true;
    loginSection.hidden = false;
}


// Display an error message
function showError(message) {
    loginError.textContent = message;
    loginError.hidden = false;
}


// Hide the error message
function hideError() {
    loginError.textContent = "";
    loginError.hidden = true;
}


async function loadProfile() {
    try {
        const profile = await getProfileData();

        document.querySelector("#username").textContent =
            profile.username;

        document.querySelector("#total-xp").textContent =
            Number(profile.totalXP).toLocaleString("en-US");

        document.querySelector("#audit-ratio").textContent =
            profile.auditRatio.toFixed(2);

        document.querySelector("#total-projects").textContent =
            profile.totalProjects.toString();

        drawXpProgressChart(profile.xpHistory);
        drawXpByProjectChart(profile.xpHistory);
        showProfile();
    } catch (error) {
        console.error("Profile loading error:", error);
        logout();
        showLogin();
        showError("Could not load profile data. Please login again.");
    }
}



// Handle login form submission
loginForm.addEventListener("submit", async (event) => {

    // Prevent the browser from refreshing the page
    event.preventDefault();

    hideError();

    // Read form values
    const identifier = document.querySelector("#identifier").value.trim();
    const password = document.querySelector("#password").value;

    // Prevent multiple login requests
    loginButton.disabled = true;
    loginButton.textContent = "Logging in...";

    try {

        // Authenticate with Zone01
        await login(identifier, password);
        // Show dashboard
        await loadProfile();
        // Clear password field
        loginForm.reset();


    } catch (error) {

        console.error("Login error:", error);

        showError(error.message);

    } finally {

        // Enable button again
        loginButton.disabled = false;
        loginButton.textContent = "Login";

    }

});


// Handle logout
logoutButton.addEventListener("click", () => {

    logout();

    showLogin();

});


// Check if a JWT already exists
if (getToken()) {
    loadProfile();
} else {
    showLogin();
}