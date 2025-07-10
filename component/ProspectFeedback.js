import React, { useEffect, useState } from "react";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import "../src/app/styles/main.scss";

const interestOptions = [
  "Space for Personal Growth & Contribution",
  "Freedom to Express and Connect",
  "Business Promotion & Visibility",
  "Earning Through Referral",
  "Networking & Events",
];

const communicationOptions = ["Whatsapp", "Email", "Phone call"];

const ProspectFeedback = ({ id }) => {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    mentorName: "",
    understandingLevel: "",
    selfGrowthUnderstanding: "",
    joinInterest: "",
    interestAreas: [],
    communicationOptions: [],
    additionalComments: "",
  });

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const subcollectionRef = collection(db, "Prospects", id, "prospectfeedbackform");
        const snapshot = await getDocs(subcollectionRef);
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setForms(data);

        if (data.length > 0) {
          const latest = data[0];
          setFormData((prev) => ({
            ...prev,
            fullName: latest.fullName || "",
            phoneNumber: latest.phoneNumber || "",
            email: latest.email || "",
            mentorName: latest.mentorName || "",
          }));
        } else {
          setShowForm(true); // Show form if no feedback exists
        }
      } catch (error) {
        console.error("Error fetching prospect forms:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchForms();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e, key) => {
    const { value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [key]: checked ? [...prev[key], value] : prev[key].filter((v) => v !== value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const subcollectionRef = collection(db, "Prospects", id, "prospectfeedbackform");
      await addDoc(subcollectionRef, formData);
      alert("Form submitted successfully");
      setShowForm(false);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="form-container">
      <h2>Prospect Feedback Form</h2>

      {forms.length === 0 && showForm && (
        <form onSubmit={handleSubmit} className="form-card">
          <ul>
            <li className="form-row">
              <h4>Prospect Name:</h4>
              <div className="multipleitem">
                <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required />
              </div>
            </li>
            <li className="form-row">
              <h4>Phone Number:</h4>
              <div className="multipleitem">
                <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required />
              </div>
            </li>
            <li className="form-row">
              <h4>Email:</h4>
              <div className="multipleitem">
                <input type="email" name="email" value={formData.email} onChange={handleChange} required />
              </div>
            </li>
            <li className="form-row">
              <h4>Orbiter Name:</h4>
              <div className="multipleitem">
                <input type="text" name="mentorName" value={formData.mentorName} onChange={handleChange} required />
              </div>
            </li>
            <li className="form-row">
              <h4>Understanding of UJustBe:</h4>
              <select name="understandingLevel" value={formData.understandingLevel} onChange={handleChange} required>
                <option value="">Select</option>
                <option value="Excellent">Excellent</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
                <option value="Poor">Poor</option>
              </select>
            </li>
            <li className="form-row">
              <h4>Clarity on Self-Growth Possibilities:</h4>
              <select name="selfGrowthUnderstanding" value={formData.selfGrowthUnderstanding} onChange={handleChange} required>
                <option value="">Select</option>
                <option value="Yes, very clearly">Yes, very clearly</option>
                <option value="Somewhat">Somewhat</option>
                <option value="No, still unclear">No, still unclear</option>
              </select>
            </li>
            <li className="form-row">
              <h4>Interest in Joining:</h4>
              <select name="joinInterest" value={formData.joinInterest} onChange={handleChange} required>
                <option value="">Select</option>
                <option value="Yes, I am interested">Yes, I am interested</option>
                <option value="I would like to think about it">I would like to think about it</option>
                <option value="No, not interested at the moment">No, not interested at the moment</option>
              </select>
            </li>
            <li className="form-row">
              <h4>Most Interesting Aspects:</h4>
              <ul>
                {interestOptions.map((option, index) => (
                  <li key={index}>
                    <input
                      type="checkbox"
                      id={`interest-${index}`}
                      value={option}
                      checked={formData.interestAreas.includes(option)}
                      onChange={(e) => handleCheckboxChange(e, "interestAreas")}
                    />
                    <label htmlFor={`interest-${index}`}>{option}</label>
                  </li>
                ))}
              </ul>
            </li>
            <li className="form-row">
              <h4>Questions or Suggestions:</h4>
              <textarea name="additionalComments" value={formData.additionalComments} onChange={handleChange} />
            </li>
            <li className="form-row">
              <h4>Preferred Communication:</h4>
              {communicationOptions.map((option, index) => (
                <div key={index}>
                  <input
                    type="checkbox"
                    value={option}
                    checked={formData.communicationOptions.includes(option)}
                    onChange={(e) => handleCheckboxChange(e, "communicationOptions")}
                  />
                  <label>{option}</label>
                </div>
              ))}
            </li>
            <li className="form-row">
              <button type="submit">Submit</button>
            </li>
          </ul>
        </form>
      )}

      {forms.length > 0 && forms.map((form) => (
        <div key={form.id} className="form-card">
          <ul>
            <li className="form-row"><h4>Prospect Name:</h4><input type="text" value={form.fullName || ""} disabled /></li>
            <li className="form-row"><h4>Phone Number:</h4><input type="text" value={form.phoneNumber || ""} disabled /></li>
            <li className="form-row"><h4>Email:</h4><input type="text" value={form.email || ""} disabled /></li>
            <li className="form-row"><h4>Orbiter Name:</h4><input type="text" value={form.mentorName || ""} disabled /></li>
            <li className="form-row"><h4>Understanding of UJustBe:</h4><input type="text" value={form.understandingLevel || ""} disabled /></li>
            <li className="form-row"><h4>Clarity on Self-Growth Possibilities:</h4><input type="text" value={form.selfGrowthUnderstanding || ""} disabled /></li>
            <li className="form-row"><h4>Interest in Joining:</h4><input type="text" value={form.joinInterest || ""} disabled /></li>
            {Array.isArray(form.interestAreas) && (
              <li className="form-row">
                <h4>Most Interesting Aspects:</h4>
                <ul>
                  {form.interestAreas.map((option, index) => (
                    <li key={index}><input type="checkbox" checked disabled /><label>{option}</label></li>
                  ))}
                </ul>
              </li>
            )}
            <li className="form-row"><h4>Questions or Suggestions:</h4><textarea value={form.additionalComments || ""} disabled /></li>
            {Array.isArray(form.communicationOptions) && (
              <li className="form-row"><h4>Preferred Communication:</h4><input type="text" value={form.communicationOptions.join(", ")} disabled /></li>
            )}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default ProspectFeedback;
