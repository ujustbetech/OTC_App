import { useEffect, useState } from 'react';
import { db } from '../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { format } from 'date-fns';
import { CiEdit } from "react-icons/ci";
import { useRouter } from 'next/router';

const ManageEvents = () => {
    const router = useRouter();
    const [prospects, setProspects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProspects = async () => {
            try {
                const prospectCollection = collection(db, 'Prospects'); // Ensure 'Prospects' is the correct collection name
                const snapshot = await getDocs(prospectCollection);
                const prospectList = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setProspects(prospectList);
                console.log("prospect", prospectList);  // This will log the fetched prospects data
                
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

    const formatDate = (timestamp) => {
        if (timestamp && timestamp.seconds) {
            return format(new Date(timestamp.seconds * 1000), 'dd/MM/yyyy');
        }
        return 'N/A';  // Return 'N/A' if there's no valid timestamp
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
                            <th>Prospect Contact</th>
                            <th>Occupation</th>
                            <th>Orbiter Name</th>
                            <th>Orbiter Contact</th>
                            <th>Type</th>
                            <th>Date</th>
                            <th>Registered At</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {prospects.length > 0 ? (
                            prospects.map((item, index) => (
                                <tr key={item.id}>
                                    <td>{index + 1}</td>
                                    <td>{item.prospectName}</td>
                                    <td>{item.prospectPhone}</td>
                                    <td>{item.occupation}</td>
                                    <td>{item.orbiterName}</td>
                                    <td>{item.orbiterContact}</td>
                                    <td>{item.type}</td>
                                    <td>{item.date}</td>
                                    <td>{formatDate(item.registeredAt)}</td>
                                    <td>
                                        <button
                                            className="m-button-7"
                                            onClick={() => handleEdit(item.id)}
                                            style={{ backgroundColor: '#f16f06', color: 'white' }}
                                        >
                                            <CiEdit /> Edit
                                        </button>
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
