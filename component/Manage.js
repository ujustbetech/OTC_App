import { useEffect, useState } from 'react';
import { db } from '../firebaseConfig';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { format } from 'date-fns';
import { useRouter } from 'next/router';

const ManageEvents = () => {
    const router = useRouter();
    const [prospects, setProspects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProspects = async () => {
            try {
                const prospectCollection = collection(db, 'Prospects');
                const snapshot = await getDocs(prospectCollection);

             const prospectList = await Promise.all(
  snapshot.docs.map(async (docSnap) => {
    const data = docSnap.data();

    // Fetch engagement subcollection
    const engagementCol = collection(db, `Prospects/${docSnap.id}/engagementform`);
    const engagementSnap = await getDocs(engagementCol);

    let lastEngagementDate = null;

    if (!engagementSnap.empty) {
      const engagements = engagementSnap.docs.map(e => e.data());

      // Sort by updatedAt or createdAt
      engagements.sort((a, b) => {
        const dateA = a.updatedAt?.seconds || a.createdAt?.seconds || 0;
        const dateB = b.updatedAt?.seconds || b.createdAt?.seconds || 0;
        return dateB - dateA;
      });

      const latest = engagements[0];
      // Prefer callDate if exists, otherwise fallback to updatedAt
    if (latest.callDate) {
  lastEngagementDate = latest.callDate; // string
} else if (latest.updatedAt) {
  lastEngagementDate = latest.updatedAt; // Firestore timestamp
} else if (latest.createdAt) {
  lastEngagementDate = latest.createdAt; // Firestore timestamp
}

    }

    return {
      id: docSnap.id,
      ...data,
      lastEngagementDate, // attach resolved last engagement
    };
  })
);


                setProspects(prospectList);
                console.log("prospect with engagement:", prospectList);

            } catch (err) {
                console.error('Error fetching prospects:', err);
                setError('Error fetching prospects. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchProspects();
    }, []);

    const handleEdit = (id) => {
        router.push(`/admin/event/edit/${id}`);
    };
const formatDate = (dateValue) => {
  if (!dateValue) return "-";

  // If callDate string
  if (typeof dateValue === "string") {
    const d = new Date(dateValue);
    return isNaN(d) ? "-" : format(d, "dd/MM/yyyy HH:mm");
  }

  // If Firestore timestamp
  if (dateValue?.seconds) {
    return format(new Date(dateValue.seconds * 1000), "dd/MM/yyyy HH:mm");
  }

  // If already JS Date
  if (dateValue instanceof Date) {
    return format(dateValue, "dd/MM/yyyy HH:mm");
  }

  return "-";
};


    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this prospect?");
        if (!confirmDelete) return;

        try {
            await deleteDoc(doc(db, "Prospects", id));
            setProspects(prev => prev.filter(p => p.id !== id));
            alert("Prospect deleted successfully.");
        } catch (error) {
            console.error("Error deleting prospect:", error);
            alert("Failed to delete prospect. Please try again.");
        }
    };

    return (
        <>
            {loading && <div className='loader'><span className="loader2"></span></div>}
            <section className='c-userslist box'>
                <h2>Prospects Listing</h2>
                <button className="m-button-5" onClick={() => window.history.back()}>
                    Back
                </button>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <table className='table-class'>
                    <thead>
                        <tr>
                            <th>Sr no</th>
                            <th>Prospect Name</th>
                            <th>Occupation</th>
                            <th>Orbiter Name</th>
                            <th>Last Engagement</th>
                            <th>Type</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                 <tbody>
    {prospects.length > 0 ? (
        [...prospects]
            .sort((a, b) => {
                const dateA = a.lastEngagementDate?.seconds || new Date(a.lastEngagementDate).getTime() || 0;
                const dateB = b.lastEngagementDate?.seconds || new Date(b.lastEngagementDate).getTime() || 0;
                return dateB - dateA; // Newest first
            })
            .map((item, index) => (
                <tr key={item.id}>
                    <td>{index + 1}</td>
                    <td>{item.prospectName}</td>
                    <td>{item.occupation}</td>
                    <td>{item.orbiterName}</td>
                    <td>{formatDate(item.lastEngagementDate)}</td>
                    <td>{item.userType === 'orbiter' ? 'ETU' : 'NTU'}</td>
                    <td>
                        <div className='twobtn'>
                            <button className="btn-edit" onClick={() => handleEdit(item.id)}>✎ Edit</button>
                            <button className="btn-delete" onClick={() => handleDelete(item.id)}>🗑 Delete</button>
                        </div>
                    </td>
                </tr>
            ))
    ) : (
        <tr>
            <td colSpan="10" style={{ textAlign: 'center' }}>No prospects found.</td>
        </tr>
    )}
</tbody>

                </table>
            </section>
        </>
    );
};

export default ManageEvents;
