import React, { useState, useEffect } from 'react';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import emailjs from '@emailjs/browser';
import "../src/app/styles/main.scss";
import axios from 'axios';

const Assessment = ({ id, fetchData }) => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const WHATSAPP_API_URL = 'https://graph.facebook.com/v22.0/527476310441806/messages';
const WHATSAPP_API_TOKEN = 'Bearer EAAHwbR1fvgsBOwUInBvR1SGmVLSZCpDZAkn9aZCDJYaT0h5cwyiLyIq7BnKmXAgNs0ZCC8C33UzhGWTlwhUarfbcVoBdkc1bhuxZBXvroCHiXNwZCZBVxXlZBdinVoVnTB7IC1OYS4lhNEQprXm5l0XZAICVYISvkfwTEju6kV4Aqzt4lPpN8D3FD7eIWXDhnA4SG6QZDZD';

  // Fetch the status from Firestore
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const docRef = doc(db, 'Prospects', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setStatus(docSnap.data().status || 'No status yet');
        }
      } catch (error) {
        console.error('Error fetching status:', error);
      }
    };

    // Get the current date
    const today = new Date().toLocaleDateString("en-IN", {
      day: 'numeric', month: 'long', year: 'numeric'
    });
    setCurrentDate(today);

    fetchStatus();
  }, [id]);

  const sendAssessmentEmail = async (prospectName, prospectEmail, orbiterName, selectedstatus, formattedDate) => {
    if (!prospectEmail) {
      console.error("🚫 Prospect email is missing");
      return;
    }

    let body = '';

    // Create the email body based on the status
    if (selectedstatus === "Choose to enroll") {
      body = `
        Dear ${prospectName}, 

        Subject: 🌟 Welcome to UJustBe Universe – Ready to Make Your Authentic Choice? 

        We are happy to inform you that your enrollment into UJustBe has been approved as we find you are aligned with the basic criteria of UJustBe Universe of being Contributor.

        You have taken the first step toward becoming part of a universe built on authenticity, contribution, and conscious connection. It’s a space where like-minded individuals come together to create meaningful impact — and your presence truly matters.

        Now, we invite you to make your authentic choice:
        To say Yes to this journey.
        To say Yes to discovering, contributing, and growing.
        To say Yes to being part of a community where you just be — and that’s more than enough.

        If this resonates with you, simply reply to this email with your confirmation as Yes. Once we receive your approval, we’ll share the details of the next steps in the enrollment process.
      `;
    } else if (selectedstatus === "Declined") {
      body = `
        Dear ${prospectName}, 

        Subject: UJustBe Enrollment Update – Non-Alignment with Our Culture and Values 

        Thank you for your interest in becoming a part of the UJustBe Universe. After assessment from our team, we want to inform you that, at this time, we do not find that your values and alignment fully match culture and values of the UJustBe Universe. 

        At UJustBe, we place a strong emphasis on authenticity, contribution, and conscious connection, and these values are the foundation of everything we do. While we recognize the effort you’ve put forth in your journey, we believe that a deep connection to our values is essential in this space.

        We appreciate your understanding and wish you all the best on your path ahead.
      `;
    }

    const templateParams = {
      prospect_name: prospectName,
      to_email: prospectEmail,
      body,
      orbiter_name: orbiterName,
    };

    try {
      await emailjs.send(
        'service_acyimrs',
        'template_cdm3n5x',
        templateParams,
        'w7YI9DEqR9sdiWX9h'
      );
      console.log("📧 Assessment email sent successfully.");
    } catch (error) {
      console.error("❌ Failed to send assessment email:", error);
    }
  };


const sanitizeText = (text) => {
  return text?.replace(/[^a-zA-Z0-9 .,!?'"@#&()\-]/g, ' ') || '';
};

const sendAssesmentMessage = async (orbiterName, prospectName, bodyText, phone) => {
  const payload = {
    messaging_product: 'whatsapp',
    to: `91${phone}`,
    type: 'template',
    template: {
      name: 'enrollment_journey', // Make sure this is correct!
      language: { code: 'en' },
      components: [
        {
          type: 'body',
          parameters: [
      
            { type: 'text', text: sanitizeText(bodyText) },
            { type: 'text', text: sanitizeText(orbiterName) }
          ]
        }
      ]
    }
  };

  try {
    await axios.post(WHATSAPP_API_URL, payload, {
      headers: {
        Authorization: WHATSAPP_API_TOKEN,
        'Content-Type': 'application/json',
      },
    });
    console.log(`✅ WhatsApp message sent to ${prospectName}`);
  } catch (error) {
    console.error(`❌ Failed to send WhatsApp to ${prospectName}`, error.response?.data || error.message);
  }
};

// Helper function to format line breaks
// Helper function to format line breaks for WhatsApp
const formatMessage = (message) => {
  return message.replace(/\\n/g, '\n'); // Replace '\\n' with real newlines
};

const handleSaveStatus = async (selectedstatus) => {
  setLoading(true);
  try {
    const docRef = doc(db, 'Prospects', id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      const prospectEmail = data.email;
      const prospectPhone = data.prospectPhone; // 📱 phone field
      const prospectName = data.prospectName;
      const orbiterName = data.orbiterName;

      await updateDoc(docRef, { status: selectedstatus });

      // Build body text for WhatsApp with formatMessage function
      let bodyText = '';
      if (selectedstatus === "Choose to enroll") {
        bodyText = formatMessage(`Congratulations ${prospectName}! We are Happy to inform you that, your enrollment into UJustBe has been approved! ✨\n\nWe now invite you to make your authentic choice to say Yes to this journey.\n\nKindly check your email for full details and next steps.\n\nLooking forward to your confirmation!`);
      } else if (selectedstatus === "Declined") {
        bodyText = formatMessage(`Hello ${prospectName}, Thank you for your interest in joining UJustBe!\n\nAfter assessment from our team, we want to inform you that we don’t currently find alignment with UJustBe's core culture and values.\n\nWe wish you the best in your future endeavors and appreciate your understanding.`);
      } else {
        bodyText = formatMessage(`Hello ${prospectName}, your current enrollment status is: ${selectedstatus}.`);
      }
      

      // Send Email (only for "Choose to enroll" or "Declined")
      if (selectedstatus === "Choose to enroll" || selectedstatus === "Declined") {
        const formattedDate = new Date().toLocaleDateString("en-IN", { day: 'numeric', month: 'long', year: 'numeric' });
        await sendAssessmentEmail(prospectName, prospectEmail, orbiterName, selectedstatus, formattedDate);
      }

      // Send WhatsApp
      await sendAssesmentMessage(orbiterName, prospectName, bodyText, prospectPhone);

      // Refresh UI
      fetchData?.();
    } else {
      console.error("❌ No such document!");
    }
  } catch (error) {
    console.error("❌ Error saving status or sending email/whatsapp:", error);
  }
  setLoading(false);
};



  return (
    <div className="status-container">
  <h3>Status: {status || 'No status yet'}</h3>
  <p>Date: {currentDate}</p>
  <div className="twobtns">
    <button className="m-button-9" onClick={() => handleSaveStatus('Choose to enroll')} disabled={loading}>
      Choose to enroll
    </button>
    <button className="m-button-9" onClick={() => handleSaveStatus('Declined')} disabled={loading}>
      Decline
    </button>
    <button className="m-button-9" onClick={() => handleSaveStatus('Need some time')} disabled={loading}>
      Need some time
    </button>
    <button className="m-button-9" onClick={() => handleSaveStatus('Awaiting response')} disabled={loading}>
      Awaiting response
    </button>
  
  </div>
</div>

  );
};

export default Assessment;
