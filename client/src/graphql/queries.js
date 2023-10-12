import { getAccessToken } from "../lib/auth";
import {
  ApolloClient,
  ApolloLink,
  createHttpLink,
  gql,
  InMemoryCache,
  concat,
} from "@apollo/client";
import { jobByIdQuery } from "./mutations";

// const client = new GraphQLClient("http://localhost:9000/graphql");

const httpLink = createHttpLink({ uri: "http://localhost:9000/graphql" });
const authLink = new ApolloLink((operation, forward) => {
  const accessToken = getAccessToken();
  if (accessToken) {
    operation.setContext({
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  }
  return forward(operation);
});

export const apolloClient = new ApolloClient({
  link: concat(authLink, httpLink),
  cache: new InMemoryCache(),
  // defaultOptions: {
  //   query: {
  //     fetchPolicy: "cache-first",
  //   },
  //    watchQuery: {
  //     fetchPolicy: "network-only",
  //    },
  // },
});

export const companyBiIdQuery = gql`
  query CompanyById($id: ID!) {
    company(id: $id) {
      id
      name
      description
      jobs {
        id
        date
        title
      }
    }
  }
`;

export async function getJob(id) {
  // const data = await client.request(query, { id: id });
  // return data.job;

  const result = await apolloClient.query({
    query: jobByIdQuery,
    variables: { id },
  });
  return result.data.job;
}

export async function getJobs() {
  const query = gql`
    query {
      jobs {
        title
        id
        date
        company {
          id
          name
        }
      }
    }
  `;

  const result = await apolloClient.query({
    query,
    fetchPolicy: "network-only",
  });
  return result.data.jobs;
}
