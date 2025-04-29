import { useState, useEffect, useRef } from 'react';
import { db, storage } from '../../../../firebaseConfig';
import { collection, doc, setDocs, Timestamp, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { useRouter } from 'next/router';
import Layout from '../../../../component/Layout';
import "../../../../pages/feedback.css";
import "../../../../src/app/styles/main.scss";

import Edit from '../../../../component/EditForm';
import AditionalInfo from '../../../../component/AdditionalInfo';
import FollowUpInfo from '../../../../component/FollowUps';
import Assesment from '../../../../component/Assesment';
import EnrollmentStage from '../../../../component/EnrollmentStage';
import ProspectFormDetails from '../../../../component/ProspectDetails';
import EngagementForm from '../../../../component/Engagementform';



const EditAdminEvent = () => {
  const router = useRouter();
  const { id } = router.query;
  const [activeTab, setActiveTab] = useState(0);
  const [eventData, seteventData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [requirementSections, setRequirementSections] = useState([]);
  


  const tabs = [
    'Prospect Details', 'Assesment Form', 'Meeting Logs', 'Pre- Enrollment Form' ,'Authentic Choice','Enrollment Status','Engagement Logs'];

  const fetchEvent = async (index) => {
    try {
      const eventDoc = doc(db, 'Prospects', id);
      const eventSnapshot = await getDoc(eventDoc);
      if (eventSnapshot.exists()) {
        const data = eventSnapshot.data();
        console.log("entire data", data);
        seteventData(data);
         // setEventName(data.Eventname || '');
         setEventTime(new Date(data.time?.seconds * 1000).toISOString().slice(0, 16));
    
        setRequirementSections(data.requirements || []);
        handleTabClick(index);
      } else {
        setError('Event not found.');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch event data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!router.isReady) return;   
    fetchEvent(0);
  }, [router.isReady, id]);
  
  useEffect(() => {
    if (router.isReady) {
      setLoading(true);
      setError('');
      setSuccess('');
      seteventData([]);
    }
  }, [router.query.id]);
    
  
  

   const handleTabClick = (index) => {
    setActiveTab(index);
  };
  
  return (
    <Layout>
       <div className="step-form-container">
       <div className="step-progress-bar">
  {tabs.map((tab, index) => (
    <div key={index} className="step-container">
      <button
        className={`step ${activeTab === index ? "active" : ""}`}
        onClick={() => handleTabClick(index)}
      >
        {index + 1}
      </button>
      <div className="step-title">{tab}</div>
    </div>
  ))}
</div>

</div>
      <section className='c-form box'>
        {/* <h2>Edit Event</h2> */}
        
       
        {loading ? (
  <p>Loading...</p>
) : (
  <>
   {activeTab === 0 && <>
          <Edit data={eventData} id={id} />
        </>}
        {activeTab === 1 && <>
          <ProspectFormDetails data={eventData} id={id} />
        </>}
        {activeTab === 2 && <>
          <FollowUpInfo data={eventData} id={id} />
        </>}
        {activeTab === 3 && <>
          <AditionalInfo data={eventData} id={id} />
        </>}
        {activeTab === 4 && <>
          <Assesment data={eventData} id={id} />
        </>}
        {activeTab === 5 && <>
          <EnrollmentStage data={eventData} id={id} />
        </>}
        {activeTab === 6 && <>
          <EngagementForm data={eventData} id={id} />
        </>}
   </>
)}

       
     
      </section>
    </Layout>
  );

};

export default EditAdminEvent;