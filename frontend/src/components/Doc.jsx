// Docs.jsx
import React, { useState } from "react";

export default function Docs() {
  const [search, setSearch] = useState("");

  const sections = [
    {
      title: "Getting Started",
      items: [
        { label: "Introduction", anchor: "#intro" },
        { label: "Quick start", anchor: "#quickstart" },
        { label: "Authentication", anchor: "#auth" },
      ],
    },
    {
      title: "Guides",
      items: [
        { label: "Uploading content", anchor: "#upload" },
        { label: "Managing roles", anchor: "#roles" },
        { label: "Cloudinary setup", anchor: "#cloudinary" },
      ],
    },
    {
      title: "API Reference",
      items: [
        { label: "Users", anchor: "#api-users" },
        { label: "Content", anchor: "#api-content" },
        { label: "Errors", anchor: "#api-errors" },
      ],
    },
  ];

  const filtered = sections.map((s) => ({
    ...s,
    items: s.items.filter((i) =>
      i.label.toLowerCase().includes(search.toLowerCase())
    ),
  }));

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 p-6 hidden md:block">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-800">Documentation</h2>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search docs…"
            className="mt-3 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <nav className="space-y-6">
          {filtered.map((s) => (
            <div key={s.title}>
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                {s.title}
              </h3>
              <ul className="mt-2 space-y-1">
                {s.items.map((i) => (
                  <li key={i.anchor}>
                    <a
                      href={i.anchor}
                      className="block rounded px-3 py-1.5 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition"
                    >
                      {i.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </aside>

      {/* Content */}
      <main className="flex-1 px-6 py-10 max-w-4xl mx-auto">
        <article className="prose prose-indigo prose-sm md:prose-base max-w-none">
          <h1 id="intro">Introduction</h1>
          <p>
            EduMedia Tech is a modern ed-tech platform that lets teachers upload rich educational
            content and students access it securely. Built with JWT authentication, Cloudinary
            storage, and MongoDB metadata, it scales from solo tutors to entire institutions.
          </p>

          <h2 id="quickstart">Quick start</h2>
          <ol>
            <li>
              <a href="/register" className="text-indigo-600 hover:underline">
                Create an account
              </a>{" "}
              (Student or Teacher).
            </li>
            <li>Confirm your email—JWT tokens are issued automatically.</li>
            <li>
              Drag-and-drop files ≤ 100 MB; they’re streamed to Cloudinary and metadata saved in
              MongoDB.
            </li>
            <li>Share links or embed content in your LMS.</li>
          </ol>

          <h2 id="auth">Authentication</h2>
          <p>
            We use short-lived <code>access_token</code> (15 min) and long-lived{" "}
            <code>refresh_token</code> (7 days). Include the access token in the{" "}
            <code>Authorization: Bearer &lt;token&gt;</code> header for every API call.
          </p>
          <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
            {`POST /api/auth/login
{
  "email": "ada@example.com",
  "password": "••••••••"
}

200 OK
{
  "access_token":  "eyJhbGc...",
  "refresh_token": "eyJhbGc...",
  "user": { "id": "60b...", "role": "teacher" }
}`}
          </pre>

          <h2 id="upload">Uploading content</h2>
          <p>
            Multipart request to <code>/api/content</code>. Cloudinary responds with a secure HTTPS
            URL and public_id; we store both plus your metadata.
          </p>
          <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
            {`curl -X POST https://api.edumediatech.com/v1/content \\
  -H "Authorization: Bearer &lt;token&gt;" \\
  -F "type=video" \\
  -F "title=Calculus 101" \\
  -F "file=@lecture.mp4"`}
          </pre>

          <h2 id="roles">Managing roles</h2>
          <ul>
            <li>
              <strong>Student</strong>: view, bookmark, comment.
            </li>
            <li>
              <strong>Teacher/Creator</strong>: upload, edit, delete own content, view analytics.
            </li>
            <li>
              <strong>Admin</strong>: full CRUD on users & content, custom branding, reports.
            </li>
          </ul>

          <h2 id="cloudinary">Cloudinary setup</h2>
          <p>
            Create a free Cloudinary account, copy your cloud name, API key & secret into the{" "}
            <code>.env</code> file:
          </p>
          <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
            {`CLOUDINARY_CLOUD_NAME=your-cloud
CLOUDINARY_API_KEY=123456789
CLOUDINARY_API_SECRET=abcdef...`}
          </pre>
          <p>
            Signed uploads are enforced; URLs are automatically transformed for optimal delivery.
          </p>

          <h2 id="api-users">Users API</h2>
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead>
              <tr>
                <th className="py-2 text-left">Method</th>
                <th className="py-2 text-left">Endpoint</th>
                <th className="py-2 text-left">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="py-2 font-mono">GET</td>
                <td className="py-2 font-mono">/api/users/me</td>
                <td className="py-2">Current user profile</td>
              </tr>
              <tr>
                <td className="py-2 font-mono">PATCH</td>
                <td className="py-2 font-mono">/api/users/:id</td>
                <td className="py-2">Update profile (name, avatar)</td>
              </tr>
            </tbody>
          </table>

          <h2 id="api-content">Content API</h2>
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead>
              <tr>
                <th className="py-2 text-left">Method</th>
                <th className="py-2 text-left">Endpoint</th>
                <th className="py-2 text-left">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="py-2 font-mono">GET</td>
                <td className="py-2 font-mono">/api/content</td>
                <td className="py-2">List (paginated, searchable)</td>
              </tr>
              <tr>
                <td className="py-2 font-mono">POST</td>
                <td className="py-2 font-mono">/api/content</td>
                <td className="py-2">Upload new asset</td>
              </tr>
              <tr>
                <td className="py-2 font-mono">DELETE</td>
                <td className="py-2 font-mono">/api/content/:id</td>
                <td className="py-2">Remove asset (deletes Cloudinary file)</td>
              </tr>
            </tbody>
          </table>

          <h2 id="api-errors">Error codes</h2>
          <ul>
            <li>
              <code>400</code> – Bad request (validation failed)
            </li>
            <li>
              <code>401</code> – Unauthorized (missing/invalid token)
            </li>
            <li>
              <code>403</code> – Forbidden (insufficient role)
            </li>
            <li>
              <code>404</code> – Resource not found
            </li>
            <li>
              <code>413</code> – Payload too large (&gt; 100 MB)
            </li>
            <li>
              <code>429</code> – Rate limit exceeded
            </li>
          </ul>

          <p className="mt-10 text-sm text-gray-500">
            Last updated: {new Date().toLocaleDateString()} •{" "}
            <a href="mailto:support@edumediatech.com" className="text-indigo-600 hover:underline">
              support@edumediatech.com
            </a>
          </p>
        </article>
      </main>
    </div>
  );
}