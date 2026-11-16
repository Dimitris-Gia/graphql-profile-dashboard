
import { graphqlRequest } from "./graphql.js";

export async function getProfileData() {
    const query = `
        query MyProfile {
            user {
                login
                auditRatio
                totalUp
                totalDown
                firstName
                lastName

                transactions_aggregate(
                    where: {
                        type: { _eq: "xp" }
                        invalidatedAt: { _is_null: true }
                        eventId: { _eq: 585 }
                    }
                ) {
                    aggregate {
                        sum {
                            amount
                        }
                        count
                    }
                }

                progresses_aggregate(
                    where: {
                        isDone: { _eq: true }
                        object: {
                            type: { _eq: "project" }
                        }
                        _and: [
                            { path: { _nlike: "%/prompt-piscine/%" } }
                            { path: { _nlike: "/ai-starter/%" } }
                        ]
                    }
                ) {
                    aggregate {
                        count(
                            columns: objectId
                            distinct: true
                        )
                    }
                }

                transactions(
                    where: {
                        type: { _eq: "xp" }
                        invalidatedAt: { _is_null: true }
                        eventId: { _eq: 585 }
                    }
                    order_by: {
                        createdAt: asc
                    }
                ) {
                    amount
                    createdAt
                    path
                    object {
                        id
                        name
                        type
                    }
                }
            }
        }
    `;

    const data = await graphqlRequest(query);
    const user = data.user[0];

    return {
        username: user.login,

        fullName: [user.firstName, user.lastName]
            .filter(Boolean)
            .join(" "),

        totalXP: Number(
            user.transactions_aggregate.aggregate.sum.amount
        ),

        totalXPTransactions:
            user.transactions_aggregate.aggregate.count,

        auditRatio: user.auditRatio,
        totalUp: user.totalUp,
        totalDown: user.totalDown,

        totalProjects:
            user.progresses_aggregate.aggregate.count,

        xpHistory: user.transactions
    };
}
