import { GRAPHQL_URL } from "./config.js";
import { getToken } from "./auth.js";


// Send a GraphQL request
export async function graphqlRequest(query, variables = {}) {

    // Get the JWT
    const token = getToken();

    // Check authentication
    if (!token) {
        throw new Error("You must login first");
    }

    // Send the request
    const response = await fetch(GRAPHQL_URL, {

        method: "POST",

        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },

        body: JSON.stringify({
            query: query,
            variables: variables
        })

    });

    // Read the JSON response
    const result = await response.json();

    // Check HTTP errors
    if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
    }

    // Check GraphQL errors
    if (result.errors) {
        const messages = result.errors
            .map(error => error.message)
            .join(", ");

        throw new Error(messages);
    }

    // Return the requested data
    return result.data;
}