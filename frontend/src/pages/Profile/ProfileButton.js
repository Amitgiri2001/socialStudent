import React from 'react';
import Button from '../../components/Button/Button';
import { withRouter } from 'react-router-dom';

const ProfileButton = ({ history, userId }) => {
    const openUserProfile = () => {
        // Navigate to the user's profile page
        history.push(`/profile/${userId}`);
    };
    return (
        <Button onClick={openUserProfile}>Profile</Button>
    )
}

export default withRouter(ProfileButton);
