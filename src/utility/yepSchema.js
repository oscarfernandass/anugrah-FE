import * as yup from 'yup';
import {validateLen,validateEmailOrPhoneNumber, validatePhoneNumber} from './validationFun';

export const LoginSchema = yup.object().shape({
    email: yup
    .string()
    .test('emailphone',function(value){
        const result = validateEmailOrPhoneNumber(value??'');
            if (result === true) {
                return true;
            } else {
                return this.createError({ message: result });
            }
        })
    .required('Email/phone is required'),
    password: yup
    .string()
    .required('Password is required')
    .test('len', 'Password must be at least 4 characters', validateLen),
});

// Register schema for validation
export const registerSchema = yup.object().shape({
    fullName: yup.string()
        .test('fullName', 'Full name must contain at least first and last name', function (value) {
            return value && value.trim().split(' ').length >= 2;
        })
        .required('Full name is required'),
    first_name: yup.string(),
    last_name: yup.string(),
    email: yup
    .string()
    .test('emailphone',function(value){
        const result = validateEmailOrPhoneNumber(value??'');
            if (result === true) {
                return true;
            } else {
                return this.createError({ message: result });
            }
        })
    .required('Email/phone is required'),
    password: yup.string()
       .min(4, 'Password must be at least 4 characters')
       .required('Password is required'), 
    device_name: yup.string()
       .equals(['1', '0'], 'Invalid device name')
       .required('Device name is required'),
    mob_no: yup.string()
        .nullable()
        .notRequired()
        .length(10, 'Mobile number must be 10 characters')
        .test('mobNo', 'Invalid phone number', function (value) {
        if (!value) return true; // If the field is empty, it's valid because it's optional
        const result = validatePhoneNumber(value);
        if (result === true) {
            return true;
        } else {
            return this.createError({ message: result });
        }}),
    user_country_code: yup.string()
        .when('$email', {
            is: (val) =>  val >= 0,
            then: (s)=>s.required('Country code is required'),
            otherwise: (s)=>s.notRequired(),
        }),
    user_type: yup.string()
       //.required('User type is required')
       .equals(['1', '0'], 'Invalid user type'),
})