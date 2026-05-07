import { useState } from "react";
import axios from "axios";

const INITIAL = {
  emp_id: "",
  first_name: "",
  last_name: "",
  birthdate: "",
  gender: "",
  race: "",
  department: "",
  jobtitle: "",
  location: "",
  hire_date: "",
  termdate: "",
  location_city: "",
  location_state: "",
  age: "",
};

// ── Field component is OUTSIDE Employee ──────────────────────
// This is the fix — if it were inside, every keystroke would
// recreate it and cause the input to lose focus
const Field = ({ label, name, type = "text", opts, min, max, required = true, formData, handleChange }) => (
  <div className="mb-3">
    <label className="form-label fw-semibold small text-uppercase text-secondary">
      {label} {required && <span className="text-danger">*</span>}
    </label>

    {opts ? (
      <select
        name={name}
        className="form-select"
        value={formData[name]}
        onChange={handleChange}
        required={required}
      >
        <option value="">— Select —</option>
        {opts.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    ) : (
      <input
        type={type}
        name={name}
        className="form-control"
        placeholder={`Enter ${label.toLowerCase()}`}
        value={formData[name]}
        onChange={handleChange}
        min={min}
        max={max}
        required={required}
      />
    )}

    <div className="invalid-feedback">
      {name === "age"
        ? "Age must be between 18 and 65."
        : `${label} is required.`}
    </div>
  </div>
);

// ── Main Employee Form Component ──────────────────────────────
function Employee({ onEmployeeAdded }) {
  const [formData, setFormData] = useState(INITIAL);
  const [validated, setValidated] = useState(false);
  const [loading, setLoading]     = useState(false);
  const [toast, setToast]         = useState(null);

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!e.target.checkValidity()) {
      setValidated(true);
      return;
    }

    try {
      setLoading(true);
      await axios.post("http://localhost:5000/api/employees/add", formData);
      showToast("success", `Employee ${formData.first_name} ${formData.last_name} added!`);
      setFormData(INITIAL);
      setValidated(false);
      if (onEmployeeAdded) onEmployeeAdded();
    } catch (err) {
      showToast("error", err.response?.data?.message || "Failed to save. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // Shared props passed down to every Field
  const fieldProps = { formData, handleChange };

  return (
    <div className="container py-5">

      {/* Toast notification */}
      {toast && (
        <div
          className={`alert alert-${toast.type === "success" ? "success" : "danger"} position-fixed top-0 end-0 m-3 shadow`}
          style={{ zIndex: 9999, minWidth: 300 }}
        >
          {toast.type === "success" ? "✅ " : "❌ "}
          {toast.msg}
        </div>
      )}

      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow border-0 rounded-4">

            <div className="card-header bg-primary text-white py-3 rounded-top-4">
              <h5 className="mb-0">👤 Add New Employee</h5>
              <small className="opacity-75">All starred fields are required</small>
            </div>

            <div className="card-body p-4">
              <form
                noValidate
                className={validated ? "was-validated" : ""}
                onSubmit={handleSubmit}
              >

                {/* Row 1 — ID, Age, Gender */}
                <div className="row">
                  <div className="col-md-6">
                    <Field label="Employee ID" name="emp_id" {...fieldProps} />
                  </div>
                  <div className="col-md-3">
                    <Field label="Age" name="age" type="number" min="18" max="65" {...fieldProps} />
                  </div>
                  <div className="col-md-3">
                    <Field label="Gender" name="gender" opts={["Male", "Female", "Non-Conforming"]} {...fieldProps} />
                  </div>
                </div>

                {/* Row 2 — Name */}
                <div className="row">
                  <div className="col-md-6">
                    <Field label="First Name" name="first_name" {...fieldProps} />
                  </div>
                  <div className="col-md-6">
                    <Field label="Last Name" name="last_name" {...fieldProps} />
                  </div>
                </div>

                {/* Row 3 — Birthdate, Race */}
                <div className="row">
                  <div className="col-md-6">
                    <Field label="Birthdate" name="birthdate" type="date" {...fieldProps} />
                  </div>
                  <div className="col-md-6">
                    <Field
                      label="Race / Ethnicity"
                      name="race"
                      opts={[
                        "White",
                        "Black or African American",
                        "Asian",
                        "Hispanic or Latino",
                        "American Indian or Alaska Native",
                        "Two or More Races",
                        "Native Hawaiian or Other Pacific Islander",
                      ]}
                      {...fieldProps}
                    />
                  </div>
                </div>

                {/* Row 4 — Department, Job Title */}
                <div className="row">
                  <div className="col-md-6">
                    <Field label="Department" name="department" {...fieldProps} />
                  </div>
                  <div className="col-md-6">
                    <Field label="Job Title" name="jobtitle" {...fieldProps} />
                  </div>
                </div>

                {/* Row 5 — Location */}
                <div className="row">
                  <div className="col-md-4">
                    <Field label="Location Type" name="location" opts={["Headquarters", "Remote"]} {...fieldProps} />
                  </div>
                  <div className="col-md-4">
                    <Field label="City" name="location_city" {...fieldProps} />
                  </div>
                  <div className="col-md-4">
                    <Field label="State" name="location_state" {...fieldProps} />
                  </div>
                </div>

                {/* Row 6 — Dates */}
                <div className="row">
                  <div className="col-md-6">
                    <Field label="Hire Date" name="hire_date" type="date" {...fieldProps} />
                  </div>
                  <div className="col-md-6">
                    <Field label="Termination Date" name="termdate" type="date" required={false} {...fieldProps} />
                  </div>
                </div>

                {/* Submit */}
                <div className="d-grid mt-3">
                  <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                    {loading ? (
                      <><span className="spinner-border spinner-border-sm me-2" />Saving…</>
                    ) : (
                      "💾 Save Employee"
                    )}
                  </button>
                </div>

              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Employee;