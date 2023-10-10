import { getCompany } from "./db/companies.js";
import { getJob, getJobs, getJobsByCompany } from "./db/jobs.js";
import { GraphQLError } from "graphql";

export const resolvers = {
  Query: {
    job: async (_root, { id }) => {
      const job = await getJob(id);
      if (!job) {
        throw notFoundError("no job found with this id: " + id);
      }
      return job;
    },
    jobs: () => getJobs(),
    company: async (_root, { id }) => {
      const company = await getCompany(id);
      if (!company) {
        throw notFoundError("No company found with id: " + id);
      }
      return company;
    },
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

function notFoundError(message) {
  return new GraphQLError(message, {
    extensions: { code: "NOT-FOUND" },
  });
}

function toIsoDate(value) {
  return value.slice(0, "yyyy-mm-dd".length);
}
