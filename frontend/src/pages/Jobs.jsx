import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import axios from "axios";

export default function Jobs() {
  const { user } = useOutletContext();
  const [jobs, setJobs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: "",
    company: "",
    description: "",
    location: "",
    jobType: "Full-time",
    salary: "",
    requirements: "",
    applyLink: "",
  });

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/jobs", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setJobs(res.data.jobs);
      } catch (err) {
        console.error(err);
      }
    };
    fetchJobs();
  }, []);

  const handlePostJob = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const jobData = {
        ...form,
        requirements: form.requirements
          ? form.requirements.split(",").map((r) => r.trim())
          : [],
      };
      const res = await axios.post("http://localhost:5000/api/jobs", jobData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJobs([res.data.job, ...jobs]);
      setForm({
        title: "",
        company: "",
        description: "",
        location: "",
        jobType: "Full-time",
        salary: "",
        requirements: "",
        applyLink: "",
      });
      setShowForm(false);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to post job");
    }
  };

  const handleApply = async (jobId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:5000/api/jobs/${jobId}/apply`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setJobs(
        jobs.map((job) =>
          job._id === jobId
            ? { ...job, applicants: [...job.applicants, user._id] }
            : job
        )
      );

      alert("Applied successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to apply");
    }
  };

  const handleDeleteJob = async (jobId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/jobs/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJobs(jobs.filter((j) => j._id !== jobId));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete job");
    }
  };

  return (
    <div>
      <h3 className="mb-4">Job Openings</h3>

      {user.role === "Alumni" && (
        <button
          className="btn btn-primary mb-4"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Cancel" : "Post a Job"}
        </button>
      )}

      {showForm && (
        <form onSubmit={handlePostJob} className="card p-3 mb-4 shadow-sm">
          <h5>Post a Job</h5>
          <input
            type="text"
            placeholder="Job Title"
            className="form-control mb-2"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Company"
            className="form-control mb-2"
            value={form.company}
            onChange={(e) => setForm({ ...form, company: e.target.value })}
            required
          />
          <textarea
            placeholder="Job Description"
            className="form-control mb-2"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
            required
          />
          <input
            type="text"
            placeholder="Location"
            className="form-control mb-2"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
          />
          <select
            className="form-control mb-2"
            value={form.jobType}
            onChange={(e) => setForm({ ...form, jobType: e.target.value })}
          >
            <option>Full-time</option>
            <option>Part-time</option>
            <option>Internship</option>
            <option>Contract</option>
          </select>
          <input
            type="text"
            placeholder="Salary (optional)"
            className="form-control mb-2"
            value={form.salary}
            onChange={(e) => setForm({ ...form, salary: e.target.value })}
          />
          <input
            type="text"
            placeholder="Requirements (comma separated)"
            className="form-control mb-2"
            value={form.requirements}
            onChange={(e) =>
              setForm({ ...form, requirements: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Apply Link or Email"
            className="form-control mb-2"
            value={form.applyLink}
            onChange={(e) => setForm({ ...form, applyLink: e.target.value })}
          />
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </form>
      )}

      {jobs.length === 0 ? (
        <p>No jobs posted yet.</p>
      ) : (
        jobs.map((job) => {
          const hasApplied = job.applicants?.includes(user._id);

          return (
            <div key={job._id} className="card mb-3 shadow-sm">
              <div className="card-body">
                <h5>
                  {job.title} @ {job.company}
                </h5>
                <p className="text-muted mb-1">
                  {job.location} • {job.jobType}
                </p>
                <p>{job.description}</p>
                {job.salary && <p>Salary: {job.salary}</p>}
                {job.requirements?.length > 0 && (
                  <p>Requirements: {job.requirements.join(", ")}</p>
                )}

                {job.postedBy?._id?.toString() !== user._id?.toString() && (
                  <button
                    className="btn btn-sm btn-success"
                    onClick={() => handleApply(job._id)}
                    disabled={hasApplied}
                  >
                    {hasApplied ? "Applied" : "Apply"}
                  </button>
                )}

                {user.role === "Alumni" &&
                  job.postedBy?._id?.toString() === user._id?.toString() && (
                    <button
                      className="btn btn-sm btn-danger ms-2"
                      onClick={() => handleDeleteJob(job._id)}
                    >
                      Delete
                    </button>
                  )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
