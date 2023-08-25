const User = require('../models/UserModel');

exports.addProfileData = async (req, res, next) => {
    const collegeName = req.body.collegeName;
    const departmentName = req.body.departmentName;
    const currentYear = req.body.currentYear;
    const dateOfBirth = req.body.dateOfBirth;
    const imageUrl = req.body.imageUrl;

    //get the userId from the localStorage
    const userId = req.body.userId;

    const user = await User.findById(userId);
    if (!user) {
        throw new Error(`User not found with id ${userId}`);
    }

    user.collegeName = collegeName;
    user.departmentName = departmentName;
    user.currentYear = currentYear;
    user.dateOfBirth = dateOfBirth;
    user.imageUrl = imageUrl;

    //save the user
    await user.save();
    res.status(200).json({
        message: "User Profile updated successfully",
        user: user,
    });

}