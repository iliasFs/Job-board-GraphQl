import { getCompany } from "./db/companies.js";
import { getJobs } from "./db/jobs.js";

export const resolvers = {
  //   Query: {
  //     jobs: async () => {
  //       const jobs = await getJobs();
  //       console.log(jobs);
  //       return jobs;
  //     },
  //   },

  Query: {
    jobs: () => getJobs(),
  },
  Job: {
    company: (job) => {
      return getCompany(job.companyId);
    },
    date: (job) => {
      //   console.log("resolving the date for job:", job);
      return toIsoDate(job.createdAt);
    },
  },
};

function toIsoDate(value) {
  return value.slice(0, "yyyy-mm-dd".length);
}
