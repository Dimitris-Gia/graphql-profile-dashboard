import { SIGNIN_URL } from "./config.js";

// Convert username and password to Base64
function createBasicAuth(identifier, password) {
    const credentials = `${identifier}:${password}`;

    // Convert UTF-8 characters into bytes
    const bytes = new TextEncoder().encode(credentials);

    // Convert bytes into a binary string
    const binary = Array.from(bytes)
        .map(byte => String.fromCharCode(byte))
        .join("");

    // Encode the binary string into Base64
    return btoa(binary);
}


// Login function
export async function login(identifier, password) {
    const encodedCredentials = createBasicAuth(identifier, password);

    const response = await fetch(SIGNIN_URL, {
        method: "POST",
        headers: {
            "Authorization": `Basic ${encodedCredentials}`
        }
    });

    const rawResponse = await response.text();

    if (!response.ok) {
        throw new Error("Invalid username or password");
    }

    let token = rawResponse.trim();

    // If the response is a JSON string, decode it.
    if (token.startsWith('"')) {
        try {
            token = JSON.parse(token);
        } catch {
            throw new Error("Invalid response from authentication server");
        }
    }

    // Remove Bearer prefix if the server includes it.
    token = token.replace(/^Bearer\s+/i, "");

    // A JWT must contain three parts separated by dots.
    const parts = token.split(".");

    if (
        parts.length !== 3 ||
        parts.some(part => !/^[A-Za-z0-9_-]+$/.test(part))
    ) {
        throw new Error("The authentication server returned an invalid JWT");
    }

    sessionStorage.setItem("jwt", token);

    return token;
}



// Logout function
export function logout() {
    sessionStorage.removeItem("jwt");
}


// Get the current JWT
export function getToken() {
    return sessionStorage.getItem("jwt");
}