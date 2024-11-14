import * as React from "react"
import Svg, {
  SvgProps,
  Rect,
  Path,
  Defs,
  LinearGradient,
  Stop,
} from "react-native-svg"
const SvgComponent = (props: SvgProps) => (
  <Svg xmlns="http://www.w3.org/2000/svg" fill="none" {...props}>
    <Rect width={32} height={32} fill="#fff" rx={16} />
    <Path
      stroke="url(#a)"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M17.905 19.388a15.901 15.901 0 0 0 3.636-.873A5.978 5.978 0 0 1 20 14.5V14a4 4 0 1 0-8 0v.5a5.978 5.978 0 0 1-1.541 4.015c1.155.426 2.373.723 3.636.873m3.81 0a16.163 16.163 0 0 1-3.81 0m3.81 0a2 2 0 1 1-3.81 0M10.084 13a5.98 5.98 0 0 1 1.445-3m8.944 0a5.98 5.98 0 0 1 1.445 3"
    />
    <Defs>
      <LinearGradient
        id="a"
        x1={10.083}
        x2={21.917}
        y1={16}
        y2={16}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#9068C1" />
        <Stop offset={1} stopColor="#1BA1E3" />
      </LinearGradient>
    </Defs>
  </Svg>
)
export default SvgComponent
