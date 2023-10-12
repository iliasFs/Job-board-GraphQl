import { getAccessToken } from "../lib/auth";
import {
  ApolloClient,
  ApolloLink,
  createHttpLink,
  gql,
  InMemoryCache,
  concat,
} from "@apollo/client";
//Graph-QL - Client
// const client = new GraphQLClient("http://localhost:9000/graphql", {
//   headers: () => {
//     const accessToken = getAccessToken();
//     if (accessToken) {
//       return { Authorization: `Bearer ${accessToken}` };
//     }
//     return {};
//   },
// });

//Apollo client
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

export const jobByIdQuery = gql`
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

export async function createJob({ title, description }) {
  const mutation = gql`
    mutation CreateJob($input: CreateJobInput!) {
      job: createJob(input: $input) {
        id
        title
        description
        company {
          id
          name
        }
      }
    }
  `;

  const result = await apolloClient.mutate({
    mutation,
    variables: { input: { title, description } },
    update: (cache, result) => {
      cache.writeQuery({
        query: jobByIdQuery,
        variables: { id: result.data.job.id },
        data: result.data,
      });
    },
  });

  return result.data.job;
}
