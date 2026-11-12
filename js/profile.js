
import { graphqlRequest } from "./graphql.js";

export async function getProfileData() {
    const query = `
        query MyProfile {
            user {
                login
                auditRatio
                totalUp
                totalDown

                transactions_aggregate(
                    where: {
                        type: { _eq: "xp" }
                        invalidatedAt: { _is_null: true }
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
                    }
                ) {
                    aggregate {
                        count
                    }
                }

                transactions(
                    where: {
                        type: { _eq: "xp" }
                        invalidatedAt: { _is_null: true }
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
        totalXP: user.transactions_aggregate.aggregate.sum.amount,
        totalXPTransactions: user.transactions_aggregate.aggregate.count,
        auditRatio: user.auditRatio,
        totalUp: user.totalUp,
        totalDown: user.totalDown,
        totalProjects: user.progresses_aggregate.aggregate.count,
        xpHistory: user.transactions
    };
}
