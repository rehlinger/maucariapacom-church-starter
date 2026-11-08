import { defineConfig } from 'tinacms';

// Your hosting provider likely exposes this as an environment variable
const branch =
  process.env.GITHUB_BRANCH ||
  process.env.VERCEL_GIT_COMMIT_REF ||
  process.env.HEAD ||
  'main';

export default defineConfig({
  branch,
  // Get this from tina.io
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID,
  // Get this from tina.io
  token: process.env.TINA_TOKEN,
  build: {
    outputFolder: 'admin',
    publicFolder: 'public',
  },
  // Uncomment to allow cross-origin requests from non-localhost origins
  // during local development (e.g. GitHub Codespaces, Gitpod, Docker).
  // Use 'private' to allow all private-network IPs (WSL2, Docker, etc.)
  // server: {
  //   allowedOrigins: ['https://your-codespace.github.dev'],
  // },
  media: {
    tina: {
      mediaRoot: 'uploads',
      publicFolder: 'public',
    },
  },
  // See docs on content modeling for more info on how to setup new content models: https://tina.io/docs/r/content-modelling-collections/
  search: {
    tina: {
      indexerToken: process.env.TINA_SEARCH_TOKEN,
      stopwordLanguages: ['eng'],
    },
    indexBatchSize: 100,
    maxSearchIndexFieldLength: 100,
  },
  schema: {
    collections: [
    {
      name: "blog",
      label: "Blog Posts",
      path: "src/content/blog",
      format: "md", // change to "mdx" if your posts end in .mdx
      ui: {
        filename: {
          readonly: false,
          slugify: (values) =>
            (values?.title || "")
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/(^-|-$)/g, ""),
        },
      },
      fields: [
        { type: "string", name: "title", label: "Title", isTitle: true, required: true },
        { type: "string", name: "slug", label: "URL slug (lowercase, hyphens)" },
        { type: "datetime", name: "pubDate", label: "Publish date", required: true },
        { type: "string", name: "description", label: "Short description", ui: { component: "textarea" } },
        { type: "string", name: "author", label: "Author" },
        {
          type: "object",
          name: "image",
          label: "Featured image",
          fields: [
            { type: "image", name: "url", label: "Image" },
            { type: "string", name: "alt", label: "Image description (alt text)" },
          ],
        },
        { type: "string", name: "tags", label: "Tags", list: true },
        { type: "boolean", name: "draft", label: "Draft (hide from website)" },
        { type: "rich-text", name: "body", label: "Post text", isBody: true },
      ],
    },
    ],
  },
});
