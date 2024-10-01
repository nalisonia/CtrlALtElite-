// AccountsList.js
import React, { useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const AccountsList = () => {
    useEffect(() => {
        const fetchAccounts = async () => {
            const { data, error } = await supabase.from('accounts').select('*');

            if (error) {
                console.error("Error fetching accounts:", error.message);
            } else {
                console.log("Accounts data:", data);
            }
        };

        fetchAccounts();
    }, []);

    return (
        <div>
            <h1>Accounts List</h1>
            {/* You can display data here if needed */}
        </div>
    );
};

export default AccountsList;
