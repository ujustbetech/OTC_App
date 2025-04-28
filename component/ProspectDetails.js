import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig"; // adjust path based on your config
import "../src/app/styles/main.scss";

const ProspectFormDetails = ({ id }) => {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const subcollectionRef = collection(db, "Prospects", id, "prospectform");
        const snapshot = await getDocs(subcollectionRef);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setForms(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching prospect forms:", error);
      }
    };

    fetchForms();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (forms.length === 0) return <p>No prospect forms found.</p>;

  return (
    <section className='c-form box'>
    <div >
      <h2>Prospect Form Details</h2>
      {forms.map((form, index) => (
        <div key={form.id} >
       
          <ul>
          <li className='form-row'>
                    <h4>Mentor Name:<sup>*</sup></h4>
                    <div className='multipleitem'>
          <p> {form.mentorName}</p>
          </div>
          </li>
       
          <li className='form-row'>
                    <h4>Mentor Phone:<sup>*</sup></h4>
                    <div className='multipleitem'>
          <p> {form.mentorPhone}</p>
          </div>
          </li>
        
          <li className='form-row'>
                    <h4>Mentor Emaile:<sup>*</sup></h4>
                    <div className='multipleitem'>
          <p> {form.mentorEmail}</p>
          </div>
          </li>
          
          <li className='form-row'>
                    <h4>Assessment Date:<sup>*</sup></h4>
                    <div className='multipleitem'>
          <p> {form.assessmentDate}</p>
          </div>
          </li>
         
          

          <hr />
       
          <li className='form-row'>
                    <h4>Prospect Name:<sup>*</sup></h4>
                    <div className='multipleitem'>
          <p> {form.fullName}</p>
          </div>
          </li>
     
          <li className='form-row'>
                    <h4>Phone:<sup>*</sup></h4>
                    <div className='multipleitem'>
          <p> {form.phoneNumber}</p>
          </div>
          </li>
        
          <li className='form-row'>
                    <h4>Email:<sup>*</sup></h4>
                    <div className='multipleitem'>
          <p> {form.email}</p>
          </div>
          </li>
         
          <li className='form-row'>
                    <h4>City & Country:<sup>*</sup></h4>
                    <div className='multipleitem'>
          <p> {form.cityCountry}</p>
          </div>
          </li>
         
          <li className='form-row'>
                    <h4>Profession:<sup>*</sup></h4>
                    <div className='multipleitem'>
          <p> {form.profession}</p>
          </div>
          </li>
        
          <li className='form-row'>
                    <h4>Company:<sup>*</sup></h4>
                    <div className='multipleitem'>
          <p> {form.companyName}</p>
          </div>
          </li>
        
          <li className='form-row'>
                    <h4>Industry:<sup>*</sup></h4>
                    <div className='multipleitem'>
          <p> {form.industry}</p>
          </div>
          </li>
       
          <li className='form-row'>
                    <h4>Social Profile:<sup>*</sup></h4>
                    <div className='multipleitem'>
          <p> {form.socialProfile}</p>
          </div>
          </li>
          
       
          <hr />
         
          <li className='form-row'>
                    <h4>Found How:<sup>*</sup></h4>
                    <div className='multipleitem'>
          <p> {form.howFound}</p>
          </div>
          </li>
       
          <li className='form-row'>
                    <h4>Interest Level:<sup>*</sup></h4>
                    <div className='multipleitem'>
          <p> {form.interestLevel}</p>
          </div>
          </li>
          
          <li className='form-row'>
                    <h4>Interest Areas:<sup>*</sup></h4>
                    <div className='multipleitem'>
          <p> {form.interestAreas?.join(", ")}</p>
          </div>
          </li>
        
          <li className='form-row'>
                    <h4>Contribution Ways:<sup>*</sup></h4>
                    <div className='multipleitem'>
          <p> {form.contributionWays?.join(", ")}</p>
          </div>
          </li>
        
          <li className='form-row'>
                    <h4>Informed Status:<sup>*</sup></h4>
                    <div className='multipleitem'>
          <p> {form.informedStatus}</p>
          </div>
          </li>
        
        

          <hr />
         
          <li className='form-row'>
                    <h4>Alignment Level:<sup>*</sup></h4>
                    <div className='multipleitem'>
          <p> {form.alignmentLevel}</p>
          </div>
          </li>
        
          <li className='form-row'>
                    <h4>Recommendation:<sup>*</sup></h4>
                    <div className='multipleitem'>
          <p> {form.recommendation}</p>
          </div>
          </li>
       
          <li className='form-row'>
                    <h4>Comments:<sup>*</sup></h4>
                    <div className='multipleitem'>
          <p> {form.additionalComments}</p>
          </div>
          </li>
          </ul>
        
        </div>
      ))}
    </div>
    </section>
  );
};

export default ProspectFormDetails;
