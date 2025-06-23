import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  addDoc,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import { getAuth } from "firebase/auth";
import "../src/app/styles/main.scss";

const ProspectFormDetails = ({ id }) => {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const subcollectionRef = collection(db, "Prospects", id, "prospectform");
        const snapshot = await getDocs(subcollectionRef);

        const auth = getAuth();
        const user = auth.currentUser;

     const prospectDocRef = doc(db, "Prospects", id);
const prospectSnap = await getDoc(prospectDocRef);

const prospectData = prospectSnap.exists() ? prospectSnap.data() : {};

const defaultMentor = {
  mentorName: prospectData.orbiterName || "",
  mentorPhone: prospectData.orbiterContact || "",
  mentorEmail: prospectData.orbiterEmail || "",
};

const defaultProspect = {
  fullName: prospectData.prospectName || "",
  email: prospectData.email || "",
  phoneNumber: prospectData.prospectPhone || "",
};

        if (snapshot.empty) {
          setForms([
            {
               ...defaultMentor,
    ...defaultProspect,
    assessmentDate: "", // You can autofill this too if needed
    country: "",
    city: "",
    profession: prospectData.occupation || "",
    companyName: "",
    industry: "",
    socialProfile: "",
    howFound: "",
    interestLevel: "",
    interestAreas: prospectData.hobbies ? [prospectData.hobbies] : [],
    contributionWays: [],
    informedStatus: "",
    alignmentLevel: "",
    recommendation: "",
    additionalComments: "",
            },
          ]);
          setEditMode(true);
        } else {
          const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          setForms(data);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching prospect forms:", error);
      }
    };

    fetchForms();
  }, [id]);

  const handleChange = (formIndex, field, value) => {
    const updatedForms = [...forms];
    updatedForms[formIndex][field] = value;
    setForms(updatedForms);
  };

  const handleSave = async () => {
    try {
      for (const form of forms) {
        const formCopy = { ...form };

        if (form.id) {
          const docRef = doc(db, "Prospects", id, "prospectform", form.id);
          delete formCopy.id;
          await updateDoc(docRef, formCopy);
        } else {
          await addDoc(collection(db, "Prospects", id, "prospectform"), formCopy);
        }
      }
      alert("Forms saved successfully!");
      setEditMode(false);
    } catch (err) {
      console.error("Error saving forms:", err);
      alert("Failed to save changes.");
    }
  };

  const handleAddForm = () => {
    // You may want to re-fetch mentor and prospect data again if needed
    setEditMode(true);
  };

  if (loading) return <p>Loading...</p>;

  if (forms.length === 0) {
    return (
      <div>
        <h2>Prospects Assessment Form</h2>
        <p>No prospect forms found.</p>
        <button className="save-button" onClick={handleAddForm}>
          Add New Form
        </button>
      </div>
    );
  }

  return (
    <div>
      <h2>Prospects Assessment Form</h2>

      {forms.map((form, index) => (
        <div key={form.id || index}>
          <ul>
            {[
              { label: "Mentor Name", key: "mentorName" },
              { label: "Mentor Phone", key: "mentorPhone" },
              { label: "Mentor Email", key: "mentorEmail" },
              { label: "Assessment Date", key: "assessmentDate" },
              { label: "Prospect Name", key: "fullName" },
              { label: "Phone", key: "phoneNumber" },
              { label: "Email", key: "email" },
              { label: "Country", key: "country" },
              { label: "City", key: "city" },
              { label: "Profession", key: "profession" },
              { label: "Company", key: "companyName" },
              { label: "Industry", key: "industry" },
              { label: "Social Profile", key: "socialProfile" },
              { label: "Found How", key: "howFound" },
              { label: "Interest Level", key: "interestLevel" },
              {
                label: "Interest Areas",
                key: "interestAreas",
                isArray: true,
              },
              {
                label: "Contribution Ways",
                key: "contributionWays",
                isArray: true,
              },
              { label: "Informed Status", key: "informedStatus" },
              { label: "Alignment Level", key: "alignmentLevel" },
              { label: "Recommendation", key: "recommendation" },
              { label: "Comments", key: "additionalComments" },
            ].map(({ label, key, isArray }) => (
              <li className="form-row" key={key}>
                <h4>
                  {label}:<sup>*</sup>
                </h4>
                <div className="multipleitem">
                  <input
                    type="text"
                    value={
                      isArray
                        ? (form[key] || []).join(", ")
                        : form[key] || ""
                    }
                    disabled={!editMode}
                    onChange={(e) =>
                      handleChange(
                        index,
                        key,
                        isArray
                          ? e.target.value.split(",").map((item) => item.trim())
                          : e.target.value
                      )
                    }
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}

      <div style={{ marginTop: "20px" }}>
    

        {!editMode ? (
          <button className="save-button" onClick={() => setEditMode(true)}>
            Edit
          </button>
        ) : (
          <button className="save-button" onClick={handleSave}>
            Save
          </button>
        )}
      </div>
    </div>
  );
};

export default ProspectFormDetails;
