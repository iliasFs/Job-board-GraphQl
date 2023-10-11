import { getAccessToken } from "../lib/auth";
import {
  ApolloClient,
  ApolloLink,
  createHttpLink,
  gql,
  InMemoryCache,
  concat,
} from "@apollo/client";

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

const apolloClient = new ApolloClient({
  link: concat(authLink, httpLink),
  cache: new InMemoryCache(),
});

export async function getJob(id) {
  const query = gql`
    query JobById($id: ID!) {
      job(id: $id) {
        id
        date
        title
        description
        company {
          id
          name
        }
      }
    }
  `;

  // const data = await client.request(query, { id: id });
  // return data.job;

  const result = await apolloClient.query({ query, variables: { id } });
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

  const result = await apolloClient.query({ query });
  return result.data.jobs;
}

export async function getCompany(id) {
  const query = gql`
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

  // const data = await client.request(query, { id: id });
  // return data.company;

  const result = await apolloClient.query({ query, variables: { id } });
  return result.data.company;
}
