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
   <div>
    <div >
      <h2>Prospects Assesment Form</h2>
      {forms.map((form, index) => (
        <div key={form.id} >
       
          <ul>
          <li className='form-row'>
                    <h4>Mentor Name:<sup>*</sup></h4>
                    <div className='multipleitem'>
                      <input type="text" value={form.mentorName} disabled />
          <p> </p>
          </div>
          </li>
       
          <li className='form-row'>
                    <h4>Mentor Phone:<sup>*</sup></h4>
                    <div className='multipleitem'>
                    <input type="text" value={form.mentorPhone} disabled />

          </div>
          </li>
        
          <li className='form-row'>
                    <h4>Mentor Emaile:<sup>*</sup></h4>
                    <div className='multipleitem'>
                    <input type="text" value={form.mentorEmail} disabled />
  
          </div>
          </li>
          
          <li className='form-row'>
                    <h4>Assessment Date:<sup>*</sup></h4>
                    <div className='multipleitem'>
                    <input type="text" value={form.assessmentDate} disabled />
 
          </div>
          </li>
         
          
         
       
          <li className='form-row'>
                    <h4>Prospect Name:<sup>*</sup></h4>
                    <div className='multipleitem'>
                    <input type="text" value={form.fullName} disabled />
          
          </div>
          </li>
     
          <li className='form-row'>
                    <h4>Phone:<sup>*</sup></h4>
                    <div className='multipleitem'>
                    <input type="text" value={form.phoneNumber} disabled />

          </div>
          </li>
        
          <li className='form-row'>
                    <h4>Email:<sup>*</sup></h4>
                    <div className='multipleitem'>
                    <input type="text" value={form.email} disabled />

          </div>
          </li>
         
          <li className='form-row'>
                    <h4>City & Country:<sup>*</sup></h4>
                    <div className='multipleitem'>
                    <input type="text" value={form.cityCountry} disabled />
      
          </div>
          </li>
         
          <li className='form-row'>
                    <h4>Profession:<sup>*</sup></h4>
                    <div className='multipleitem'>
                    <input type="text" value={form.profession} disabled />
   
          </div>
          </li>
        
          <li className='form-row'>
                    <h4>Company:<sup>*</sup></h4>
                    <div className='multipleitem'>
                    <input type="text" value={form.companyName} disabled />
 
          </div>
          </li>
        
          <li className='form-row'>
                    <h4>Industry:<sup>*</sup></h4>
                    <div className='multipleitem'>
                    <input type="text" value={form.industry} disabled />

          </div>
          </li>
       
          <li className='form-row'>
                    <h4>Social Profile:<sup>*</sup></h4>
                    <div className='multipleitem'>
                    <input type="text" value={form.socialProfile} disabled />
 
          </div>
          </li>
          
      
         
          <li className='form-row'>
                    <h4>Found How:<sup>*</sup></h4>
                    <div className='multipleitem'>
                    <input type="text" value={form.howFound} disabled />
        
          </div>
          </li>
       
          <li className='form-row'>
                    <h4>Interest Level:<sup>*</sup></h4>
                    <div className='multipleitem'>
                    <input type="text" value={form.interestLevel} disabled />
        
          </div>
          </li>
          
          <li className='form-row'>
                    <h4>Interest Areas:<sup>*</sup></h4>
                    <div className='multipleitem'>
                    <input type="text" value={form.interestAreas?.join(", ")} disabled />
       
          </div>
          </li>
        
          <li className='form-row'>
                    <h4>Contribution Ways:<sup>*</sup></h4>
                    <div className='multipleitem'>
                    <input type="text" value={form.contributionWays?.join(", ")} disabled />
    
          </div>
          </li>
        
          <li className='form-row'>
                    <h4>Informed Status:<sup>*</sup></h4>
                    <div className='multipleitem'>
                    <input type="text" value={form.informedStatus} disabled />
    
          </div>
          </li>
        
        

        
         
          <li className='form-row'>
                    <h4>Alignment Level:<sup>*</sup></h4>
                    <div className='multipleitem'>
                    <input type="text" value={form.alignmentLevel} disabled />
   
          </div>
          </li>
        
          <li className='form-row'>
                    <h4>Recommendation:<sup>*</sup></h4>
                    <div className='multipleitem'>
                    <input type="text" value={form.recommendation} disabled />
       
          </div>
          </li>
       
          <li className='form-row'>
                    <h4>Comments:<sup>*</sup></h4>
                    <div className='multipleitem'>
                    <input type="text" value={form.additionalComments} disabled />
      
          </div>
          </li>
          </ul>
        
        </div>
      ))}
    </div>
    </div>
  );
};

export default ProspectFormDetails;
