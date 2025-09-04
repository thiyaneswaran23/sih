import { useState, useEffect } from "react";
import axios from "axios";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    dob: "",
    gender: "",
    phone: "",
    address: "",
    linkedin: "",
    department: "",
    yearOfStudy: "",
    graduationYear: "",
    jobTitle: "",
    company: "",
  });
  const [preview, setPreview] = useState(
    "https://cdn-icons-png.flaticon.com/512/149/149071.png"
  );

  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    if (isNaN(d.getTime())) return "";
    return d.toISOString().split("T")[0];
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const userData = res.data.user;
        setUser(userData);
        setPreview(userData.profilePhoto || preview);

        setForm((prev) => ({
          ...prev,
          ...userData,
          dob: formatDate(userData.dob),
        }));
      } catch (err) {
        console.error("Failed to fetch profile", err);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    if (!isEditing) return;
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put("http://localhost:5000/api/profile", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data.user);
      setIsEditing(false);
      alert("Profile updated");
    } catch (err) {
      console.error("Profile update failed", err);
      alert("Error updating profile ");
    }
  };

  const handleCancel = () => {
    setForm({
      ...user,
      dob: user.dob ? new Date(user.dob).toISOString().split("T")[0] : "",
    });
    setIsEditing(false);
  };

  if (!user) return <p className="text-center mt-5">Loading...</p>;

  return (
    <div className="container my-5">
      <div className="card shadow-lg border-0">
        <div className="card-body">
    
          <div className="d-flex align-items-center mb-4">
            <div className="position-relative me-4">
              <img
                src={preview}
                alt="Profile"
                className="rounded-circle border shadow"
                style={{ width: "120px", height: "120px", objectFit: "cover" }}
              />
              {isEditing && (
                <input
                  type="file"
                  accept="image/*"
                  className="form-control form-control-sm mt-2"
                  onChange={(e) => {
                    if (e.target.files[0]) {
                      setPreview(URL.createObjectURL(e.target.files[0]));
                    }
                  }}
                />
              )}
            </div>
            <div>
              <h3 className="mb-1">{form.fullName || "Your Name"}</h3>
              <p className="text-muted mb-0">
                {user.role === "Alumni"
                  ? `${form.jobTitle || "Job Title"} ${form.company && `@ ${form.company}`}`
                  : `${form.department || "Department"} ${
                      form.yearOfStudy && `- Year ${form.yearOfStudy}`
                    }`}
              </p>
            </div>
          </div>
          <div className="mb-4">
            <h5 className="mb-3 border-bottom pb-2 text-primary">Personal Info</h5>
            <div className="row g-3">
              <div className="col-md-6">
                <input
                  type="text"
                  name="fullName"
                  value={form.fullName || ""}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="Full Name"
                  className="form-control"
                />
              </div>
              <div className="col-md-6">
                <input
                  type="date"
                  name="dob"
                  value={form.dob || ""}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="form-control"
                />
              </div>
              <div className="col-md-6">
                <select
                  name="gender"
                  value={form.gender || ""}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="form-select"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="col-md-6">
                <input
                  type="text"
                  name="phone"
                  value={form.phone || ""}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="Phone Number"
                  className="form-control"
                />
              </div>
              <div className="col-12">
                <input
                  type="text"
                  name="address"
                  value={form.address || ""}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="Address"
                  className="form-control"
                />
              </div>
              <div className="col-12">
                <input
                  type="text"
                  name="linkedin"
                  value={form.linkedin || ""}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="LinkedIn URL"
                  className="form-control"
                />
              </div>
            </div>
          </div>
          {user.role === "Student" && (
            <div className="mb-4">
              <h5 className="mb-3 border-bottom pb-2 text-primary">Academic Info</h5>
              <div className="row g-3">
                <div className="col-md-6">
                  <input
                    type="text"
                    name="department"
                    value={form.department || ""}
                    onChange={handleChange}
                    disabled={!isEditing}
                    placeholder="Department"
                    className="form-control"
                  />
                </div>
                <div className="col-md-6">
                  <input
                    type="text"
                    name="yearOfStudy"
                    value={form.yearOfStudy || ""}
                    onChange={handleChange}
                    disabled={!isEditing}
                    placeholder="Year of Study"
                    className="form-control"
                  />
                </div>
                <div className="col-md-6">
                  <input
                    type="text"
                    name="graduationYear"
                    value={form.graduationYear || ""}
                    onChange={handleChange}
                    disabled={!isEditing}
                    placeholder="Graduation Year"
                    className="form-control"
                  />
                </div>
              </div>
            </div>
          )}
          {user.role === "Alumni" && (
            <div className="mb-4">
              <h5 className="mb-3 border-bottom pb-2 text-primary">Work Info</h5>
              <div className="row g-3">
                <div className="col-md-6">
                  <input
                    type="text"
                    name="jobTitle"
                    value={form.jobTitle || ""}
                    onChange={handleChange}
                    disabled={!isEditing}
                    placeholder="Job Title"
                    className="form-control"
                  />
                </div>
                <div className="col-md-6">
                  <input
                    type="text"
                    name="company"
                    value={form.company || ""}
                    onChange={handleChange}
                    disabled={!isEditing}
                    placeholder="Company"
                    className="form-control"
                  />
                </div>
              </div>
            </div>
          )}
          <div className="mt-4 d-flex gap-2">
            {isEditing ? (
              <>
                <button
                  type="button"
                  onClick={handleSave}
                  className="btn btn-primary flex-fill"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="btn btn-secondary flex-fill"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="btn btn-dark w-100"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
