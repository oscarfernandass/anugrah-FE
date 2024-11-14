import React, { useState, useEffect } from 'react';
import { View, Text, Image, BackHandler, StyleSheet, Pressable, TouchableOpacity, ScrollView } from 'react-native';
// import { ProgressBar } from '@react-native-community/progress-bar-android';
import { useNavigation } from '@react-navigation/native';
import profile from '../../assets/images/profile.png';
import CustomProgressBar from '../../components/CustomProgressBar';
const questions = [
  {
    question: "I am a",
    options: ["Male", "Female", "Other"],
  },
  {
    question: "I fall into",
    options: ["Below 18", "18 to 22", "23 to 30", "31 to 40","40+"],
  },
  {
    question: "I like",
    options: ["Football", "Basketball", "Cricket","Hockey","Baseball","Poker"],
  },
];

const Personalisation = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const navigation = useNavigation(); 

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);

    return () => backHandler.remove();
  }, [currentQuestionIndex]);

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null); // Reset selected option for the next question
    } else {
      // When all questions are done, navigate to the next screen
      navigation.navigate('PersonaliseComplete'); // Replace 'NextScreen' with your target screen name
    }
  };

  const handleBackPress = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedOption(null);
      return true;
    }
    return false;
  };

  const handleOptionPress = (option) => {
    setSelectedOption(option);
    handleNextQuestion(); 
  };

  
  const progress = (currentQuestionIndex + 1) / questions.length;
  const[b,setB]=useState(false);

  return (
    <View style={styles.container}>
      <View className="mt-[10px] ml-[16px]" style={styles.header}>
        <Image
          source={profile} 
          className="h-[32px] w-[32px] rounded-[32px]"
        />
      </View>
        <View className="h-[28px] w-[203px] rounded-[16px] mt-[18px]" style={styles.welcomeBadge}>
          <Text className="text-[10px] italic font-[400] text-[#1A2233]" style={styles.font}>Welcome to TechLearn personalisation.</Text>
        </View>

      <View style={styles.mainContent}>
        <Text className="text-[24px] font-[700] text-[#1A2233] mt-[16px]" style={styles.font}>Let’s talk about you.</Text>
        <Text className="text-[12px] font-[400] text-[#737780] mt-[8px]" style={styles.font}>So we can enhance your learning experience.</Text>
         </View>

        <View className="mt-[40px] rounded-tl-[40px] rounded-tr-[40px]" style={{backgroundColor:'white',width:'100%',flex:1,alignItems:'center'}}>

    <CustomProgressBar progress={progress} 
        />
          <ScrollView contentContainerStyle={{alignItems:'center'}}>

        <Text className="mt-[40px] text-[24px] font-[400] text-[#1A2233] mb-[16px]" style={styles.font}>{questions[currentQuestionIndex].question}</Text>

        {questions[currentQuestionIndex].options.map((option, index) => (
            <Pressable
            key={index}
          style={({ pressed }) => [
              styles.optionButton,
              selectedOption === option && styles.selectedOptionButton,
              pressed && styles.selectedOptionButton, 
            ]}
            onPress={() => handleOptionPress(option)}
            >
            <Text
            className="text-[10px] font-[400] text-[#737780]"
            style={({ pressed }) => [
                styles.optionText,
                  selectedOption === option && styles.selectedOptionText,
                  pressed && styles.color
                ]}
                >
              {option}
            </Text>
          </Pressable>
        ))}
        <TouchableOpacity
          style={styles.skipButton}
          onPress={handleNextQuestion}
          >
          <Text className="mt-[25px] text-[10px] font-[400] text-[#737780] underline" style={[styles.font]}>Skip</Text>
        </TouchableOpacity>
              </ScrollView>
    </View>
    </View>
  );
};

const styles = StyleSheet.create({
    font:{
        fontFamily: 'Helvetica Neue',
      },
  container: {
    flex: 1,
    backgroundColor: '#F0F5FF',
  },
  welcomeBadge: {
    backgroundColor: '#FFAFDE',
    justifyContent:'center',
    alignItems:'center',
    alignSelf:'center'
  
  },
  welcomeText: {
    fontSize: 12,
    color: '#FFF',
  },
  mainContent: {
    alignItems:'center',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#2D2D2D',
  },
  subheading: {
    fontSize: 14,
    textAlign: 'center',
    color: '#6B6B6B',
  },
  progressBar: {
    width: '100%',
    borderRadius:50,
  },
  questionText: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#2D2D2D',
  },
  color:{
    color:'#2E6BE5'
  },
  optionButton: {
    backgroundColor: '#F2F2F2',
    // padding: 15,
    borderRadius: 32,
    marginBottom: 8,
    width:312,
    height:48,
    // marginLeft:24,
    // marginRight:24,
    alignItems: 'center',
    justifyContent:'center'
  },
  selectedOptionButton: {
    backgroundColor: '#F0F5FF',
    borderWidth: 1,
    borderColor: '#1BA1E3',
    color:'#2E6BE5'
  },
  optionText: {
    fontSize: 18,
    color: '#737780',
  },
  selectedOptionText: {
    color: '#2E6BE5',
  },

});

export default Personalisation;
