import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig"; // Adjust if needed
import "../src/app/styles/main.scss";

const ProspectFeedback = ({ id }) => {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const subcollectionRef = collection(db, "Prospects", id, "prospectfeedbackform");
        const snapshot = await getDocs(subcollectionRef);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setForms(data);
      } catch (error) {
        console.error("Error fetching prospect forms:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchForms();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (forms.length === 0) return <p>No prospect forms found.</p>;

  return (
    <div className="form-container">
      <h2>Prospect Feedback Form</h2>
      {forms.map((form) => (
      <div key={form.id} className="form-card">
      <ul>
        {/* Mentor Info */}
        
    
        {/* Prospect Info */}
        <li className="form-row">
          <h4>Prospect Name:</h4>
          <div className="multipleitem">
          <input type="text" value={form.fullName || ""} disabled />
          </div>
        </li>
        <li className="form-row">
          <h4>Phone Number:</h4>
          <div className="multipleitem">
          <input type="text" value={form.phoneNumber || ""} disabled />
          </div>
        </li>
        <li className="form-row">
          <h4>Email:</h4>
          <div className="multipleitem">
          <input type="text" value={form.email || ""} disabled />
          </div>
        </li>
        <li className="form-row">
          <h4>Orbiter Name:</h4>
          <div className="multipleitem">
          <input type="text" value={form.mentorName || ""} disabled />
          </div>
        </li>
        {/* Feedback Questions */}
        <li className="form-row">
          <h4>Understanding of UJustBe:</h4>
          <div className="multipleitem">
          <input type="text" value={form.understandingLevel || ""} disabled />
          </div>
        </li>
        <li className="form-row">

          <h4>Clarity on Self-Growth Possibilities:</h4>
          <div className="multipleitem">
          <input type="text" value={form.selfGrowthUnderstanding || ""} disabled />
          </div>
        </li>
        <li className="form-row">
          <h4>Interest in Joining:</h4>
          <div className="multipleitem">
          <input type="text" value={form.joinInterest || ""} disabled />
          </div>
        </li>
       {/* Checkbox Options */}
       {Array.isArray(form.interestAreas) && (
          <li className="form-row">
            <h4>Most Interesting Aspects:</h4>
            <ul>
              {form.interestAreas.map((option, index) => (
                <li key={index}>
                  <input type="checkbox" checked disabled />
                  <label>{option}</label>
                </li>
              ))}
            </ul>
          </li>
        )}

    
        <li className="form-row">
          <h4>Questions or Suggestions:</h4>
          <textarea value={form.additionalComments || ""} disabled />
        </li>
    
        {Array.isArray(form.communicationOptions) && (
  <li className="form-row">
    <h4>Preferred Communication:<sup>*</sup></h4>
    <div className="multipleitem">
      <input
        type="text"
        value={form.communicationOptions.join(", ")}
        disabled
      />
    </div>
  </li>
)}

    
        {/* <li className="form-row">
          <h4>Submitted On:</h4>
          <input
            type="text"
            value={
              form.timestamp
                ? new Date(form.timestamp.seconds * 1000).toLocaleString()
                : ""
            }
            disabled
          />
        </li> */}
      </ul>
    </div>
    
      ))}
    </div>
  );
};

export default ProspectFeedback;
