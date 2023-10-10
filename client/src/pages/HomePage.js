import JobList from "../components/JobList";
import { getJobs } from "../graphql/queries";
import { useState, useEffect } from "react";

//getJobs().then((jobs) => console.log(jobs));

function HomePage() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    getJobs().then((jobs) => setJobs(jobs));
  }, []);

  console.log("[homepage] jobs:", jobs);
  return (
    <div>
      <h1 className="title">Job Board</h1>
      <JobList jobs={jobs} />
    </div>
  );
}

export default HomePage;
