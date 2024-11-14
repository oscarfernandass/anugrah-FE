import { Image, Text, View, ImageBackground, TouchableOpacity, ScrollView } from "react-native";
import profile from '../../assets/images/prof.png'
import congratulationMotion from '../../assets/CongratilationAnimation.gif'
import CheckBadge from '../../assets/icons/CheckBadge.svg'
import GradientBadge from '../../assets/icons/GradientBadge.svg'
export default function PersonaliseComplete({navigation}){


    return (
        <View className = "flex-1 bg-[#F0F5FF]">
            <View className="py-[10px] px-4 w-full  ">
                <Image source = {profile} className="w-8 h-8 rounded-full "/>
            </View>
            <ScrollView className = "bg-white rounded-t-[40px]">
            <View className = "w-full rounded-3xl h-[350px]">
                <ImageBackground source={congratulationMotion} className= "w-full h-full items-center justify-center " >
                        <CheckBadge/>
                </ImageBackground>
            </View>
            <View className="px-6 py-6 flex-col gap-8 ">
                <Text className="text-[#1A2233] font-helvetica-neue font-bold text-2xl">
                Your personal education is ready now!
                </Text>
                <View className = "">
                    <Text className="text-[#1A2233] font-helvetica-neue font-bold text-[14px] leading-[18px] ">What you got?</Text>
                    <View className="flex-col py-3 gap-1">
                    <View className= "flex-row gap-3 items-center ">
                        <GradientBadge/>
                        <Text className="text-[#737780] font-helvetica-neue font-normal text-[14px] leading-[20px] " >Examples based on your favourite sport</Text>
                    </View>
                    <View className= "flex-row gap-3 items-center ">
                        <GradientBadge/>
                        <Text className="text-[#737780] font-helvetica-neue font-normal text-[14px] leading-[20px] " >AI avatar of your favourite character</Text>
                    </View>
                    <View className= "flex-row gap-3 items-center ">
                        <GradientBadge/>
                        <Text className="text-[#737780] font-helvetica-neue font-normal text-[14px] leading-[20px] " >Learning based on your likes/dislikes</Text>
                    </View>
                    <View className= "flex-row gap-3 items-center ">
                        <GradientBadge/>
                        <Text className="text-[#737780] font-helvetica-neue font-normal text-[14px] leading-[20px] " >Examples based on your favourite sport</Text>
                    </View>
                    </View>
                </View>
                    <TouchableOpacity className = "flex items-center justify-center px-[14px] py-3 rounded-[8px] bg-[#1A2233] " onPress={()=>{
                        navigation.navigate('Home');
                    }}>
                        <Text className="text-[#FFF] font-helvetica-neue font-normal text-[14px] leading-[20px]">Take Me Home </Text>
                    </TouchableOpacity>
            </View>
            </ScrollView>
        </View>
    )
}