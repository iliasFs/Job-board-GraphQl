import { getCompany } from "./db/companies.js";
import {
  deleteJob,
  getJob,
  getJobs,
  getJobsByCompany,
  updateJob,
} from "./db/jobs.js";
import { GraphQLError } from "graphql";
import { createJob } from "./db/jobs.js";

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

  Mutation: {
    createJob: (_root, { input: { title, description } }, context) => {
      if (!context.user) {
        throw unauthorizedError("Missing authentication");
      }
      console.log(context.user);

      const companyId = context.user.companyId; //TODO SET BASED ON USER
      return createJob({ companyId, title, description });
    },
    deleteJob: async (_root, { id }, context) => {
      if (!context.user) {
        throw unauthorizedError("Missing authentication");
      }
      //we need to secure that the user belonging to one company should delete jobs only for that company and not others

      const job = await deleteJob(id, context.user.companyId);
      if (!job) {
        throw notFoundError("No job found with id: " + id);
      }
      return job;
    },

    updateJob: async (
      _root,
      { input: { id, title, description } },
      { user }
    ) => {
      if (!user) {
        throw unauthorizedError("Missing authentication");
      }
      const companyId = user.companyId;
      const job = await updateJob(id, companyId, title, description);
      if (!job) {
        throw notFoundError("No job found with id: " + id);
      }
      return job;
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

function unauthorizedError(message) {
  return new GraphQLError(message, {
    extensions: { code: "UNAUTHORIZED" },
  });
}

function toIsoDate(value) {
  return value.slice(0, "yyyy-mm-dd".length);
}
