/** @type { import("drizzle-kit").Config } */
export default {
  schema: './utils/schema.js',
  dialect: 'postgresql',
  dbCredentials: {
    url: 'postgresql://neondb_owner:1KqAJZOLyn9u@ep-shiny-thunder-a5jvkxvr.us-east-2.aws.neon.tech/ai-wala?sslmode=require',
  },
};
