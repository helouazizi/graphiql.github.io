export async function fetchdata() {

  const userQuery = `
  user {
      firstName
      lastName
      auditRatio
      campus
      attrs
    }
`;

  const xpQuery = `
  xp :transaction ( where : {
    type : { _eq : "xp"},
    eventId: { _eq: 41 }
  } )  {
  amount 
    type  
    createdAt
    progress{
      path
      
    }
  }
`;

  const totalXpQuery = `
 totalxpamount: transaction_aggregate(where: {
      type: { _eq: "xp" },
       eventId: { _eq: 41 }
    }) {
      aggregate {
        sum {
          amount
        }
      }
    }
`;

  const levelQuery = `
  levels: transaction_aggregate(where: {
      type: { _eq: "level" },
         eventId: { _eq: 41 }
    }) {
      aggregate {
        max {
          amount
        }
      }
    }
`;

  const skillQuery = `
    skil: transaction(where: { type: { _regex: "skill" } }) {
      amount
      type
    }
`;
  const query = `
{
  ${userQuery}
  ${xpQuery}
  ${totalXpQuery}
  ${levelQuery}
  ${skillQuery}
}
`;


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



