import { getCompany } from "./db/companies.js";
import { getJob, getJobs, getJobsByCompany } from "./db/jobs.js";

export const resolvers = {
  Query: {
    job: (_root, { id }) => getJob(id),
    jobs: () => getJobs(),
    company: (_root, { id }) => getCompany(id),
  },

  Company: {
    jobs: (company) => getJobsByCompany(company.id),
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
