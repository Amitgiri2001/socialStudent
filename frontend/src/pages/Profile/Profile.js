import React, { useState } from 'react';
import Model from '../../components/Modal/Modal'

const ProfileForm = () => {
    const [collegeName, setCollegeName] = useState('');
    const [departmentName, setDepartmentName] = useState('');
    const [currentYear, setCurrentYear] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [imageUrl, setImageUrl] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();

        // Do something with the form data
        const formData = {
            collegeName,
            departmentName,
            currentYear,
            dateOfBirth,
            imageUrl
        };

        console.log(formData);
        // You can use this data to send to your server or perform any required actions
    };

    return (
        <Model>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>College Name:</label>
                    <input
                        type="text"
                        value={collegeName}
                        onChange={(event) => setCollegeName(event.target.value)}
                    />
                </div>
                <div>
                    <label>Department Name:</label>
                    <input
                        type="text"
                        value={departmentName}
                        onChange={(event) => setDepartmentName(event.target.value)}
                    />
                </div>
                <div>
                    <label>Current Year:</label>
                    <input
                        type="text"
                        value={currentYear}
                        onChange={(event) => setCurrentYear(event.target.value)}
                    />
                </div>
                <div>
                    <label>Date of Birth:</label>
                    <input
                        type="text"
                        value={dateOfBirth}
                        onChange={(event) => setDateOfBirth(event.target.value)}
                    />
                </div>
                <div>
                    <label>Image URL:</label>
                    <input
                        type="text"
                        value={imageUrl}
                        onChange={(event) => setImageUrl(event.target.value)}
                    />
                </div>
                <button type="submit">Submit</button>
            </form>
        </Model>
    );
};

export default ProfileForm;
