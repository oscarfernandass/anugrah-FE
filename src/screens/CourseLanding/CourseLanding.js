import React, { useState, useEffect,useRef } from 'react';
import { ScrollView, StyleSheet, Text, View, ImageBackground, Image, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AiText from '../../components/AiText';
import Playbut from '../../assets/icons/Playbut.svg';
import Cl1 from '../../assets/icons/Cl1.svg';
import Cl2 from '../../assets/icons/Cl2.svg';
import Cl3 from '../../assets/icons/Cl3.svg';
import Cl4 from '../../assets/icons/Cl4.svg';
import Play from '../../assets/icons/Play.svg';
import Read from '../../assets/icons/Read.svg';
import Lock from '../../assets/icons/Lock.svg';
import Cr2 from '../../assets/icons/Cr2.svg';
import certis from '../../assets/images/certis.png';
import Cert from '../../assets/icons/Cert.svg';
import { enrollPaid, enrollVerify, getCoursePage } from '../../api/api';
import Pluss from '../../assets/icons/Pluss.svg';
import Minus from '../../assets/icons/Minus.svg';
import VideoCard from '../../components/VideoCard';
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder'
import LinearGradient from 'react-native-linear-gradient';
const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient)
import Loader from '../../components/Loader';
import { useAccountContext, useAuthContext } from '../../hooks/Context';
import RegisterPopUpScreen from '../../components/modal/ModalRegistration';
import RazorpayCheckout from 'react-native-razorpay';
import { useRoute } from '@react-navigation/native';
import { joinGroup } from '../../api/api';
const CourseLanding = () => {
  const route=useRoute();
  const { authState } = useAuthContext()
  const navigation = useNavigation();
  const [expandedSection, setExpandedSection] = useState(null);
  const [expandedFAQ, setExpandedFAQ] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [transId, setTransId] = useState(null);
  const [orderId, setOrderId] = useState(null);
  const [razorId,setRazorId]=useState('');
  const [razorSig,setRazorSig]=useState('');
  const registerPopUpRef = useRef(null) ;
  const {account} = useAccountContext();
  const token=authState.accessToken;
  console.log("the account details",account);
  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true); // Start loading before fetching
        console.log("the token is ", authState.accessToken);
        console.log(route?.params?.id);
        const response = await getCoursePage(route?.params?.id, account.id);
        setData(response.msg);
        console.log(data.faq);
      } catch (error) {
        Alert.alert('Error', error.message || 'Something went wrong');
      } finally {
        setLoading(false); // Ensure loading is stopped in all cases
      }
    };
    fetch();
  }, []);
  

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };
  const toggleFAQ = (faq) => {
    setExpandedFAQ(expandedFAQ === faq ? null : faq);
  };
  handelCloseRegistrationModal = () => {
   registerPopUpRef.current.dismiss() ;
  }
  const getContentIcon = (type) => {
    switch (type) {
      case 'video':
        return <Play />;
      case 'assessment_link':
        return <Lock/>;
      case 'reading_material':
        return <Read/>;
      default:
        return null;
    }
  };
  const level=(number)=>{
    switch(number){
      case 0:
        return 'Beginner';
      case 1:
        return 'Intermediate';
      case 2:
      return 'Advanced';
      default:
      return 'loading';
    }
  }
  function convertTime(timeString) {
    if (!timeString) return ''; // Handle case where timeString is undefined or null
    
    // Split the time string by ":" to get hours, minutes, and seconds
    const [hours, minutes, seconds] = timeString.split(":").map(Number);
    
    // Handle case where hours is 0 or the format is incorrect
    if (isNaN(hours)) return '';
    
    // Return the formatted string
    return `${hours}+ Hours`;
  }
  
  const handelEnroll =async () => {
    console.log("Cliked On Enroll Now");
    if(account.accountIs === 'guest'){
      registerPopUpRef.current.present() ;
    }
    else {
      if(data?.is_enrolled===false){
        try{
          console.log(route?.params?.id," ",account?.id);
          const response = await enrollPaid(route?.params?.id,account?.id,"Beginner");
          console.log(response);
          console.log("Transaction ID:", response?.transaction_id, "Order ID:", response?.order_id);
          setTransId(response?.transaction_id);
          setOrderId(response?.order_id);
        }catch(error){
          console.log(error);
          navigation.navigate('PaymentFailed');
        }finally{
        try{
          var options = {
            description: 'Credits towards consultation',
            image: 'https://play-lh.googleusercontent.com/7jE8m2fGwULMJjMKJPsuoClFdtuiM-ve41ZtilKAVjfRgzyOcLEVXsmn7Gu9s74b5VXN=w240-h480-rw',
            currency: 'INR',
            key: 'rzp_live_zh4QBf0yeyafhP',
            amount: data.base_price*100,
            name: 'ATG World',
            order_id:orderId,
            prefill: {
              email: 'gaurav.kumar@example.com',
              contact: '9191919191',
              name: 'oscar fernandas'
            },
            theme: {color: '#2E6BE5'}
          }
          RazorpayCheckout.open(options).then(async(data) => {
            // handle success
            console.log("payment details ********",data)
            // alert(`Success: ${data}`);
            setRazorId(data?.razorpay_payment_id);
            console.log("enroll verify details",route?.params?.id," ",transId," ",razorId," ",orderId)
            const response= await enrollVerify(route?.params?.id,transId,razorId,orderId)
            console.log("enroll Verify",response);
            navigation.navigate('PaymentSuccess')
          }).catch((error) => {
            navigation.navigate('PaymentFailed');
            // handle failure
            alert(`Payment failed: ${error.code} | ${error.description}`);
          });
  
        }catch(error){
          console.log(error);
          navigation.navigate('PaymentFailed');
        }
      }
      }
      else{
        navigation.navigate('PostCourse');
      }
  }
  } 

  return (
    <>
    {loading && (
      <View style={styles.loaderContainer}>
        <Loader /> 
      </View>
    )}
      {/* ADD Register Pop Up Modal when it's a Guest User */
      account.accountIs === 'guest' && 
      <RegisterPopUpScreen ref={registerPopUpRef}
          onRequestClose={handelCloseRegistrationModal} /> 
      }
      {
        data.is_enrolled===false &&

      <View
  className="h-[56px]"
  style={{
    width: '100%',
    position: 'absolute',
    bottom: 0,
    zIndex: 5000000000,
    shadowColor: 'black',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    shadowOffset: { width: 0, height: 50 }, // Increase negative height to make the shadow appear more at the top
    shadowOpacity: 0.99, // Increase opacity to make the shadow darker
    shadowRadius: 10, // Increase the radius for a more blurred and spread-out shadow
    elevation: 10, // Increase elevation for a more pronounced shadow on Android
    alignItems: 'center',
  }}
>    
        <View style={{flexDirection:'column',padding:10,paddingLeft:16,alignSelf:'flex-start'}}>
        <View style={{flexDirection:'row',alignItems:'center'}}>
          <Text style={[{color:'#169462'},styles.font]} className="text-left text-[20px] leading-[24px] font-[700]">₹{data.base_price}</Text>
          <Text style={{color:'#737780',textDecorationLine:'line-through',marginBottom:8}} className="ml-[8px] text-left font-helvetica-neue text-[12px] leading-[16px] font-[500]">₹1500</Text>
        </View>
        <Text style={[{color:'#999999'},styles.font]} className="text-left text-[12px] leading-[16px] font-[400]">2 Days and 12:48 left</Text>
        </View>
        <View className="h-[40px]" style={{width:'40%',justifyContent:'center',paddingRight:16}}>
        <TouchableOpacity className="h-[40px] rounded-[8px]" style={{justifyContent:'center',alignItems:'center',backgroundColor:'#1A2233'}} onPress={handelEnroll}>
          <Text style={[{color:'white'},styles.font]} className="pt-[10px] pb-[10px] text-left text-[14px] leading-[20px] font-[400]">Enroll now</Text>
        </TouchableOpacity>
        </View>

      </View>
      }

      <ScrollView className="pl-[16px] pr-[16px]" style={styles.container} contentContainerStyle={styles.con}>
        <View className="mt-[12px]" style={styles.box1}>
          <View className='h-[187px] mb-[16px]' style={{alignItems:'center',overflow:'hidden',borderBottomLeftRadius:10,borderBottomRightRadius:10}}>
          <ImageBackground className="h-[179px]" source={{ uri: data?.course_image }} style={styles.vid} >
            <Playbut style={styles.play} />
          </ImageBackground>
          </View>
          <AiText title='Generated by AI ' />
          <Text style={[styles.head,styles.font]} className="mt-[12px] text-[24px] leading-[30px] font-[400]">{data?.course_name}</Text>

          <View className="mt-[4px]" style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Cl1 style={styles.icon} />
              <Text style={[styles.small,styles.font]} className="ml-[8px] text-left text-[14px] leading-[20px] font-[400]">{level(data.course_level)}</Text>
            </View>
            <View className="ml-[12px]" style={styles.infoItem}>
              <Cl2 style={styles.icon} />
              <Text style={[styles.small,styles.font]} className="ml-[8px] text-left text-[14px] leading-[20px] font-[400]">37 Resources</Text>
            </View>
            <View className="ml-[12px]" style={styles.infoItem}>
              <Cl3 style={styles.icon} />
              <Text style={[styles.small,styles.font]} className=" ml-[8px] text-left text-[14px] leading-[20px] font-[400]">{convertTime(data.duration)}</Text>
            </View>
            <View className="mt-[12px]" style={styles.infoItem}>
              <Cl4 style={styles.icon} />
              <Text style={[styles.small,styles.font]} className="ml-[8px] text-left text-[14px] leading-[20px] font-[400]">{data.enroll_count} Learners</Text>
            </View>
          </View>

          <TouchableOpacity className="rounded-[8px] mt-[18px] h-[48px]" style={styles.but} onPress={handelEnroll}>
            {
              data?.is_enrolled===false?(
                <Text style={[styles.butText,styles.font]} className="text-left text-[14px] leading-[20px] font-[400]">Enroll now</Text>
              ):(
                <Text style={[styles.butText,styles.font]} className="text-left text-[14px] leading-[20px] font-[400]">Start Learning</Text>
              )
            }
          </TouchableOpacity>
          <TouchableOpacity className="rounded-[8px] mt-[8px] h-[48px]" style={styles.but1} onPress={() => { }}>
            <Text style={[styles.butText, { color: '#192233' },styles.font]} className="text-left text-[14px] leading-[20px] font-[400]">View Curriculum</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.box2}>
          <Text style={[styles.p1,styles.font]} className="mt-[40px] mb-[12px] text-left text-[20px] leading-[24px] font-[400]">What will you learn?</Text>
          {data.sections?.map((section, index) => (
            <Section
              key={index}
              title={section.section_name}
              isExpanded={expandedSection === section.section_name}
              onToggle={() => toggleSection(section.section_name)}
              contents={section.content}
              getContentIcon={getContentIcon}
            />
          ))}
        </View>

        <View className="mt-[8px] mb-[24px]" style={styles.border}></View>

        <View style={styles.box3}>
          <Text style={[styles.p1,styles.font]} className="mb-[12px] text-left text-[20px] leading-[24px] font-[400]">COURSE OVERVIEW</Text>
          <Text style={[styles.para,styles.font]} className="text-left text-[14px] leading-[20px] font-[400]">
            {data.overview}
          {/* This course is designed to provide students with a compre-hensive understanding of the nods js framework for the be apple’s most flexible desktop computer. Sure, most people go for the traditional experience and plug in a display, mouse, and keyboard — but you can also have it serve as a home theatre PC, or put it to work with professional photo or audio editing, or turn a group of minis into a server farm. Apple opened new possibilities for the mini with the big upgrade it got in 2018, and two years later, it’s one of the first three Macs to transition away from Intel processors and showcase the potential of Apple silicon and the M1 chip.  */}
            </Text>
        </View>

        <View style={styles.box3}>
          <Text style={[styles.p1,styles.font]} className="mt-[40px] mb-[12px] text-left text-[20px] leading-[24px] font-[400]">
          Why Node JS
            </Text>
          <Text style={[styles.para,styles.font]} className="text-left text-[14px] leading-[20px] font-[400]">
            {data.why_learn}
          {/* This course is designed to provide students with a compre-hensive understanding of the nods js framework for the be apple’s most flexible desktop computer. Sure, most people go for the traditional experience and plug in a display, mouse, and keyboard — but you can also have it serve as a home theatre PC, or put it to work with professional photo or audio editing, or turn a group of minis into a server farm. Apple opened new possibilities for the mini with the big upgrade it got in 2018, and two years later, it’s one of the first three Macs to transition away from Intel processors and showcase the potential of Apple silicon and the M1 chip.  */}
            </Text>
        </View>

        <View style={styles.box3}>
          <Text style={[styles.p1,styles.font]} className="mt-[40px] mb-[12px] text-left text-[20px] leading-[24px] font-[400]">
          Who is this for?
            </Text>
          <Text style={[styles.para,styles.font]} className="text-left text-[14px] leading-[20px] font-[400]">
            {data.course_learners}
          {/* This course is designed to provide students with a compre-hensive understanding of the nods js framework for the be apple’s most flexible desktop computer. Sure, most people go for the traditional experience and plug in a display, mouse, and keyboard — but you can also have it serve as a home theatre PC, or put it to work with professional photo or audio editing, or turn a group of minis into a server farm. Apple opened new possibilities for the mini with the big upgrade it got in 2018, and two years later, it’s one of the first three Macs to transition away from Intel processors and showcase the potential of Apple silicon and the M1 chip. */}
          </Text>
        </View>

        <View style={styles.box3}>
          <Text style={[styles.p1,styles.font]} className="mt-[40px] mb-[12px] text-left text-[20px] leading-[24px] font-[400]">
          Industry Recognized Photography Certificate
            </Text>
          <Text style={[styles.para,styles.font]} className="mb-[12px] text-left text-[14px] leading-[20px] font-[400]">
          Every year, TechLearn facilitates hiring for over 1,000 businesses. A certificate from TechLearn is therefore accepted worldwide.
          </Text>
          <View className=" w-full flex-grow" style={{justifyContent:'center',alignItems:'center'}}>
            {/* <Rock style={{}} /> */}
          <ImageBackground className=" aspect-[1.3058] " source={certis} style={{width:'100%'}}/>
          </View>
        </View>

        <View style={styles.box3}>
          <Text style={[styles.p1,styles.font]} className="mt-[27px] text-left text-[20px] leading-[24px] font-[400]">
            Frequently asked questions
          </Text>
          {data.faq?.map((faq, index) => (
          <View className="mt-[12px] rounded-[8px]" key={index} style={{ alignItems: 'center', flexDirection: 'column', alignSelf: 'center', width: '100%', borderWidth: 2, borderColor: '#F8F9FA', padding: 10, paddingVertical: 10}}>
            <View style={{alignItems: 'center', flexDirection: 'row', alignSelf: 'center',justifyContent: 'space-between',width:'100%',paddingVertical:5 }}>
            <Text style={[{ color: expandedFAQ === faq.question ? '#2E6BE5' : '#737780',},styles.font]} className="text-left text-[14px] leading-[20px] font-[500]">{faq.question}</Text>
            <TouchableOpacity style={{ marginRight: 0 }} onPress={() => toggleFAQ(faq.question)}>
              {expandedFAQ === faq.question ? <Minus  /> : <Pluss  />}
            </TouchableOpacity>
            </View>
          {expandedFAQ === faq.question && (
            <Text style={[{ color: '#939CA3',width:'95%',alignSelf:'flex-start' },styles.font]} className="mt-[3px] text-left text-[14px] leading-[20px] font-[400]">{faq.answer}</Text>
          )}
          </View>
          ))}
        </View>

        <View style={styles.box3}>
        <Text style={[{color:'#737780'},styles.font]} className=" mt-[53px] text-[20px] font-[400] leading-[24px] text-left">More recommended classes.</Text>
        <View className="mt-[24px]" style={{ flexDirection: 'column'}}>
              <VideoCard title={'Learn Node.js after Javascript, Beginner class'} source={data?.course_image} />
              <VideoCard title={'Learn Node.js after Javascript, Beginner class'} source={data?.course_image} />
              <VideoCard title={'Learn Node.js after Javascript, Beginner class'} source={data?.course_image} />
            </View>
        </View>

      </ScrollView>
    </>
  );
};

const Section = ({ title, isExpanded, onToggle, contents, getContentIcon }) => (
  <View className="mb-[16px]">
    <TouchableOpacity
      style={{ width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
      onPress={onToggle}
    >
      <Text style={[styles.mark,styles.font]} className="text-left text-[16px] leading-[22px] font-[500]">{title}</Text>
      <Cr2 style={styles.down} />
    </TouchableOpacity>
    {isExpanded && (
      <View className="mt-[18px] pl-[12px]" style={styles.open}>
        {contents.map((content, index) => (
          <View className="mb-[12px]" key={index} style={{ flexDirection: 'row', alignItems: 'center'}}>
            {getContentIcon(content.type)}
            <Text style={[styles.subs,styles.font]} className="ml-[12px] text-left text-[14px] leading-[20px] font-[400]">{content.title}</Text>
          </View>
        ))}
      </View>
    )}
  </View>
);

export default CourseLanding;

const styles = StyleSheet.create({
  font:{
    fontFamily: 'Helvetica Neue',
  },
  loaderContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  container: {
    // paddingHorizontal: 16,
    backgroundColor: 'white',
  },
  con: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100,
  },
  vid: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf:'center',
    // height: 200,
    width: '100%',
  },
  box1: {
    flexDirection: 'column',
    // gap: 10,
    width: '100%',
  },
  box2: {
    // marginTop: 15,
    flexDirection: 'column',
    // gap: 10,
    width: '100%',
  },
  box3: {
    flexDirection: 'column',
    // gap: 10,
    width: '100%',
    // marginBottom:20,
  },
  head: {
    // fontSize: 23,
    color: 'black',
    // fontWeight: '400',
  },
  infoRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginRight: 8,
    // marginBottom: 4,
  },
  small: {
    color: '#6D747A',
    // fontSize: 15,
    marginTop:3,
  },
  icon: {
    // marginRight: 4,
  },
  but: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#192233',
    alignSelf: 'flex-start',
    // borderRadius: 12,
    width: '100%',
  },
  but1: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    alignSelf: 'flex-start',
    borderWidth: 1.2,
    borderColor: '#192233',
    borderRadius: 12,
    width: '100%',
  },
  butText: {
    color: 'white',
    padding: 10,
    paddingVertical: 14,
    // fontSize: 18,
  },
  p1: {
    // fontSize: 21,
    color: '#737780',
    // fontWeight: '500',

  },
  mark: {
    // fontSize: 17,
    color: 'black',
    // fontWeight: '500',
    alignSelf: 'flex-start',
  },
  open: {
    borderLeftWidth: 1.5,
    borderLeftColor: '#F2F2F2',
    // paddingLeft: 10,
    // marginTop: 10,
    // gap: 10,
  },
  subs: {
    color: 'grey',
  },
  down: {},
  para: {
    color: '#939CA3',
    // fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    zIndex: 200000000,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
    opacity: 0.5,
  },
  border: {
    alignSelf: 'center',
    backgroundColor: '#F2F2F2',
    // borderWidth: 1,
    height:1,
    width: '100%',
    // marginVertical: '6%',
  },
});
