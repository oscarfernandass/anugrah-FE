export const validateLen=(val)=>{
    return (val?.length ?? 0) >=4;
}
export const validateEmailOrPhoneNumber = (value) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^\d{10}$/; // Adjust the pattern based on your requirements

    if (emailPattern.test(value)) {
        return true;
    } else if (phonePattern.test(value)) {
        return true;
    } else {
        if (value.includes('@')) {
            return 'Invalid email address';
        } else {
            return 'phone number should be 10 digit and number only'
        }
    }
};

//we a function for valide phone number
export const validatePhoneNumber = (value) => {
    const phonePattern = /^\d{10}$/; // Adjust the pattern based on your requirements
    if (phonePattern.test(value)) {
        return true;
    } else {
        return 'Invalid phone number';
    }
};