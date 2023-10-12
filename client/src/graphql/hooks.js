import { useQuery } from "@apollo/client";
import { companyBiIdQuery } from "../graphql/queries";

export default function useCompany(id) {
  const { data, loading, error } = useQuery(companyBiIdQuery, {
    variables: { id },
  });

  return { company: data?.company, loading, error: Boolean(error) };
}
