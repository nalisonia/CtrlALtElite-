import React, { useEffect, useState } from 'react';
import supabase from '../config/supabaseClient';
import '../Styles/InquiryHistory.css';

function InquiryHistory() {
    const [inquiries, setInquiries] = useState([]);
    const [userEmail, setUserEmail] = useState(null);
    const [searchInput, setSearchInput] = useState('');
    const [searchMode, setSearchMode] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);

    useEffect(() => {
        // Fetch the current user's session to get the email
        const fetchUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                console.log("User email:", session.user.email);
                setUserEmail(session.user.email);
                fetchInquiries(session.user.email);
            } else {
                console.log("No user session found.");
            }
        };
        fetchUser();
    }, []);

    // Function to fetch inquiries based on email or phone number
    const fetchInquiries = async (identifier) => {
        try {
            setErrorMessage(null); // Reset error message on each fetch attempt

            // Step 1: Find all clients by email or phone in the clients_dev table
            const { data: clientData, error: clientError } = await supabase
                .from('clients_dev')
                .select('id')
                .or(`email.eq.${identifier},phone.eq.${identifier}`);

            if (clientError) {
                console.error('Error fetching client:', clientError);
                setErrorMessage('An error occurred while fetching the client information.');
                return;
            }
            if (!clientData || clientData.length === 0) {
                setErrorMessage('No account found with the provided email or phone number.');
                return;
            }

            // Collect all client IDs to fetch related bookings
            const clientIds = clientData.map(client => client.id);
            console.log("Client IDs found:", clientIds);

            // Step 2: Fetch all bookings related to each client_id in clientIds
            const { data: bookingsData, error: bookingsError } = await supabase
                .from('bookings_dev')
                .select('*')
                .in('client_id', clientIds);

            if (bookingsError) {
                console.error('Error fetching bookings:', bookingsError);
                setErrorMessage('An error occurred while fetching bookings.');
                return;
            }
            if (!bookingsData || bookingsData.length === 0) {
                setErrorMessage('No inquiries found for this account.');
            } else {
                setInquiries(bookingsData);
            }
        } catch (error) {
            console.error('Error fetching inquiries:', error);
            setErrorMessage('An unexpected error occurred. Please try again.');
        }
    };

    // Handle search form submission
    const handleSearchSubmit = (event) => {
        event.preventDefault();
        setSearchMode(true); // Enable search mode to differentiate from automatic fetch
        setInquiries([]); // Reset inquiries
        fetchInquiries(searchInput);
    };

    return (
        <div className="inquiry-history">
            <h2>Your Inquiry History</h2>
            
            <form onSubmit={handleSearchSubmit} className="search-form">
                <label>
                    Don’t see your previous booking? Search by email or phone:
                    <input
                        type="text"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        placeholder="Enter email or phone number"
                    />
                </label>
                <button type="submit">Search</button>
            </form>

            {errorMessage ? (
                <p className="error-message">{errorMessage}</p>
            ) : (
                inquiries.length > 0 ? (
                    <table>
                        <thead>
                            <tr>
                                <th>Event Date</th>
                                <th>Event Type</th>
                                <th>Status</th>
                                <th>Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {inquiries.map((inquiry) => (
                                <tr key={inquiry.id}>
                                    <td>{inquiry.event_date}</td>
                                    <td>{inquiry.event_type}</td>
                                    <td>{inquiry.status}</td>
                                    <td>{inquiry.additional_notes}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>{searchMode ? "No inquiries found for the search criteria." : "No inquiries found for your account."}</p>
                )
            )}
        </div>
    );
}

export default InquiryHistory;
