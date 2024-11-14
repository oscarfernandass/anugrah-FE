import {styled} from 'nativewind';
import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import DropDownInput from '../components/DropDownInput';
import UsersIcon from '../assets/icons/UserIcon.svg';
import RevenueIcon from '../assets/icons/RevenueIcon.svg';
import BookingIcon from '../assets/icons/BookingIcon.svg';
import ChevronUp from '../assets/icons/chevron-up-bold.svg';
import { getAnalytics } from '../api/api';

const StyledView = styled(View);
const StyledText = styled(Text);

type GeneralAnalyticsProps = {};

interface IGeneralAnalytics {
  newUsers: number;
  incrementOfNewUsers?: number;
  incrementOfNewUsersPercentage?: string;
  newAmount?: number;
  incrementOfNewAmount?: number;
  incrementOfNewAmountPercentage?: string;
  newAppointments?: number;
  incrementOfNewAppointments?: number;
  incrementOfNewAppointmentsPercentage?: string;
}

const formatNumber = (num: number) => {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1) + 'B';
  } else if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k';
  } else {
    return num.toString();
  }
};

const GeneralAnalytics: React.FC<GeneralAnalyticsProps> = () => {
  const [selectedOption, setSelectedOption] = useState('Last 30 days');
  const options = ['Last 30 days', 'Last 50 days', 'Last 90 days'];
  const[val1,setVal1]=useState(0);
  const[val2,setVal2]=useState(0);
  const[val3,setVal3]=useState(0);
useEffect(()=>{
  const fetch=async()=>{
    try{
      const response = await getAnalytics();
      if(response){
        setVal1(response.number_of_documents);
        setVal2(response.number_of_users);
        // setVal3(response.number_of_queries);
      }
    }catch(error){
      console.error(error);
    }
  }
  fetch()
},[])

  const mockData: {[key: string]: IGeneralAnalytics} = {
    'Last 30 days': {
      newUsers: val2,
      incrementOfNewUsers: 20,
      incrementOfNewUsersPercentage: '',
      newAmount: val1,
      incrementOfNewAmount: 5000,
      incrementOfNewAmountPercentage: '3.5',
      newAppointments: val3,
      incrementOfNewAppointments: 10,
      incrementOfNewAppointmentsPercentage: '1.8',
    },
    'Last 50 days': {
      newUsers: 3000,
      incrementOfNewUsers: 70,
      incrementOfNewUsersPercentage: '2.3',
      newAmount: 180000,
      incrementOfNewAmount: 6000,
      incrementOfNewAmountPercentage: '3.2',
      newAppointments: 140,
      incrementOfNewAppointments: 15,
      incrementOfNewAppointmentsPercentage: '2.0',
    },
    'Last 90 days': {
      newUsers: 5000,
      incrementOfNewUsers: 150,
      incrementOfNewUsersPercentage: '3.0',
      newAmount: 250000,
      incrementOfNewAmount: 10000,
      incrementOfNewAmountPercentage: '4.0',
      newAppointments: 200,
      incrementOfNewAppointments: 20,
      incrementOfNewAppointmentsPercentage: '2.5',
    },
  };

  const generalAnalytics = mockData[selectedOption];

  return (
    <StyledView>
      <StyledView className="flex-row justify-evenly mt-6">
        <StyledView className="bg-[#FFDFA2] rounded-md px-3 py-4 w-[30%]">
          <StyledView className="flex-row justify-center items-center mb-1">
            <UsersIcon />
            <StyledText className="font-[Lato-Bold] text-[#08090A] font-[600] text-[16px] ml-1">
              {generalAnalytics.newUsers}
            </StyledText>
          </StyledView>
          <StyledView className="flex-row justify-center items-center">
            <ChevronUp />
            <Text style={{color:'black',fontFamily:'Lato'}}>users</Text>
            <StyledText className="font-[Lato] text-[#08090A] font-[400] text-[12px]">
            </StyledText>
          </StyledView>
        </StyledView>
        <StyledView className="bg-[#BDE7FF] rounded-md px-3 py-4 w-[36%]">
          <StyledView className="flex-row justify-center items-center mb-1">
            <RevenueIcon />
            
            <StyledText className="font-[Lato-Bold] text-[#08090A] font-[600] text-[16px] ml-1">
              {generalAnalytics.newAmount}
            </StyledText>
          </StyledView>
          <StyledView className="flex-row justify-center items-center">
            <ChevronUp />
            <Text style={{color:'black',fontFamily:'Lato'}}>Documents</Text>
            <StyledText className="font-[Lato] text-[#08090A] font-[400] text-[12px]">
            </StyledText>
          </StyledView>
        </StyledView>
        {/* <StyledView className="bg-[#FFD0F8] rounded-md px-3 py-4 w-[30%]"> */}
          {/* <StyledView className="flex-row justify-center items-center mb-1">
            <BookingIcon />
            <StyledText className="font-[Lato-Bold] text-[#08090A] font-[600] text-[16px] ml-1">
              {generalAnalytics.newAppointments}
            </StyledText>
          </StyledView> */}
          {/* <StyledView className="flex-row justify-center items-center"> */}
            {/* <ChevronUp /> */}
            {/* <StyledText className="font-[Lato] text-[#08090A] font-[400] text-[12px]"> */}
            {/* </StyledText> */}
          {/* </StyledView> */}
        {/* </StyledView> */}
      </StyledView>
    </StyledView>
  );
};

export default GeneralAnalytics;

const styles = StyleSheet.create({
  dropdown: {
    marginTop: 16,
  },
  dropdownInput: {
    height: 40,
    borderWidth: 0,
    width: 150,
  },
  dropdownValue: {
    color: '#08090A',
    paddingRight: 10,
    fontFamily: 'Lato-Bold',
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 14,
    textAlign: 'left',
  },
});
