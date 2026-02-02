import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [blogs, setBlogs] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingBlogId, setEditingBlogId] = useState(null);

 const API_URL = "http://localhost:5050/api/blogs";
// no port needed because of proxy

  // Fetch blogs
  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setBlogs(data);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      alert("Failed to fetch blogs");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // Add or Update blog
  const submitBlog = async (e) => {
    e.preventDefault();
    if (!title || !description) return alert("Please fill in all fields");

    try {
      const method = editingBlogId ? "PUT" : "POST";
      const url = editingBlogId ? `${API_URL}/${editingBlogId}` : API_URL;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description }),
      });

      if (!res.ok) throw new Error("Failed to save blog");

      setTitle("");
      setDescription("");
      setEditingBlogId(null);
      fetchBlogs();
    } catch (error) {
      console.error(error);
      alert("Error saving blog");
    }
  };

  // Delete blog
  const deleteBlog = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;

    try {
      const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete blog");

      setBlogs(blogs.filter(blog => blog._id !== id));
    } catch (error) {
      console.error(error);
      alert("Error deleting blog");
    }
  };

  // Start editing
  const startEdit = (blog) => {
    setTitle(blog.title);
    setDescription(blog.description);
    setEditingBlogId(blog._id);
  };

  return (
    <div className="app-container">
      <h2>My Blog App</h2>

      <form onSubmit={submitBlog} className="form-box">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <br />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <br />
        <button type="submit">{editingBlogId ? "Update Blog" : "Add Blog"}</button>
        {editingBlogId && (
          <button
            type="button"
            onClick={() => {
              setTitle("");
              setDescription("");
              setEditingBlogId(null);
            }}
          >
            Cancel
          </button>
        )}
      </form>

      <h3>Blog Posts</h3>
      {loading ? (
        <p>Loading...</p>
      ) : blogs.length === 0 ? (
        <p>No blogs found.</p>
      ) : (
        blogs.map((blog) => (
          <div key={blog._id} className="blog-card">
            <h4>{blog.title}</h4>
            <p>{blog.description}</p>
            <small>{new Date(blog.createdAt).toLocaleString()}</small>
            <br />
            <button onClick={() => startEdit(blog)}>Edit</button>
            <button onClick={() => deleteBlog(blog._id)}>Delete</button>
          </div>
        ))
      )}
    </div>
  );
}

export default App;
