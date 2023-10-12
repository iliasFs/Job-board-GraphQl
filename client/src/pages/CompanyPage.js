import { useParams } from "react-router";
import { companyBiIdQuery } from "../graphql/queries";
import JobList from "../components/JobList";
import { useQuery } from "@apollo/client";

function CompanyPage() {
  const { companyId } = useParams();
  const { data, loading, error } = useQuery(companyBiIdQuery, {
    variables: { id: companyId },
  });

  // const [state, setState] = useState({
  //   company: null,
  //   loading: true,
  //   error: false,
  // });

  // useEffect(() => {
  //   (async () => {
  //     try {
  //       const company = await getCompany(companyId);
  //       setState({ company, loading: false, error: false });
  //     } catch (error) {
  //       setState({ company: null, loading: false, error: true });
  //     }
  //   })();
  // }, [companyId]);

  console.log("[Company Page]", { data, loading, error });

  if (loading) {
    return <div>Loading</div>;
  }
  if (error) {
    return <div className="has-text-danger">Data unavailable...</div>;
  }

  const { company } = data;
  return (
    <div>
      <h1 className="title">{company.name}</h1>
      <div className="box">{company.description}</div>
      <h2 className="title is-5">Jobs at {company.name}</h2>
      <JobList jobs={company.jobs} />
    </div>
  );
}

export default CompanyPage;
