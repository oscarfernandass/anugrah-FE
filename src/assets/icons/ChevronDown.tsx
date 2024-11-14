import * as React from "react";
import Svg, { NumberProp, Path } from "react-native-svg";

type ChevronDownProps = {
    strokeWidth?: NumberProp | undefined;
}

const ChevronDown:React.FC<ChevronDownProps> = (props) => {
    const {
        strokeWidth
    } = props;
    return (
        <Svg
            width={24}
            height={24}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <Path
            d="M18 9L12 15L6 9"
            stroke="#08090A"
            strokeWidth={ strokeWidth ? strokeWidth : 1}
            strokeLinecap="round"
            strokeLinejoin="round"
            />
        </Svg>
    )
};
export default ChevronDown;
