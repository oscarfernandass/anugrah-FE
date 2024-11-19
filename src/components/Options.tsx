import React from 'react';
import {StyleProp, Text, TouchableOpacity, View, ViewStyle} from 'react-native';
import {SvgProps} from 'react-native-svg';
import ArrowRightIcon from '../assets/icons/chevron-right.svg';

type Props = {
  text?: string;
  textStyle?: StyleProp<ViewStyle>;
  textClassName?: string;
  svgIcon?: React.JSX.Element;
  children?: string | JSX.Element | JSX.Element[];
  style?: StyleProp<ViewStyle>;
  className?: string;
  hideArrow?: boolean;
  onPress?: (() => void) | undefined;
  value?: number;
};

const Options = ({
  text,
  textStyle,
  textClassName,
  svgIcon,
  children,
  style,
  className,
  hideArrow,
  onPress,
  value,
}: Props) => {
  return (
    <View style={style}>
      <TouchableOpacity
        className={`flex-row justify-between ${className}`}
        onPress={onPress}>
        <View className="content-center flex-row">
          <View>{svgIcon}</View>
          <Text
            className={`ml-3 font-[Lato] font-[400] text-[#08090A] text-[16px] ${textClassName}`}
            style={[textStyle]}>
            {text}
          </Text>
          {value !== undefined && value > 0 && (
            <View className="bg-[#0D69D7] w-[24px] h-[24px] ml-2 rounded-full p-[3px]">
              <Text className="font-[Lato-Bold] font-[600] text-[14px] text-center text-[#fff]">
                {value}
              </Text>
            </View>
          )}
          {children}
        </View>
        {hideArrow ? null : <ArrowRightIcon className="justify-self-end" />}
      </TouchableOpacity>
    </View>
  );
}

export default React.memo(Options);
