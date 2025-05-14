export async function fetchdata() {
  
    const query = `
  {
    user {
      firstName
      lastName
      auditRatio
      campus
      attrs
    }
    xp :transaction ( where : {
    type : { _eq : "xp"},
    progress : {
      path : { _regex : "^/oujda/module/(piscine-js$|(?!piscine-js/).*)$"}
    }
  } )  {
  amount 
    type  
    createdAt
    progress{
      path
      
    }
  }
    totalxpamount: transaction_aggregate(where: {
      type: { _eq: "xp" },
      progress: {
        path: { _regex: "^/oujda/module/(piscine-js$|(?!piscine-js/).*)$" }
      }
    }) {
      aggregate {
        sum {
          amount
        }
      }
    }
    levels: transaction_aggregate(where: {
      type: { _eq: "level" },
      progress: {
        path: { _regex: "^/oujda/module/(piscine-js$|(?!piscine-js/).*)$" }
      }
    }) {
      aggregate {
        max {
          amount
        }
      }
    }
    skil: transaction(where: { type: { _regex: "skill" } }) {
      amount
      type
    }
  }`;

  try {
    const response = await fetch("https://learn.zone01oujda.ma/api/graphql-engine/v1/graphql", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${sessionStorage.getItem("token")}`
      },
      body: JSON.stringify({ query })
    });

    const data = await response.json();
  return data

  } catch (error) {
 return
  }
}
