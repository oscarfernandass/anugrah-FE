import React, {FC, useEffect, useState, useCallback} from 'react';
import {View, Text, Dimensions, StyleSheet} from 'react-native';
import {LineChart, BarChart, Grid, XAxis, YAxis} from 'react-native-svg-charts';
import {Svg, Text as SvgText} from 'react-native-svg';
import Decorator from './Decorator';
import { useFocusEffect } from '@react-navigation/native';
import { getAnalytics } from '../../api/api';
interface DataPoint {
  name: string;
  price: number;
  cb: number;
  date: string;
}

const formatNumber = (num: number): string => {
  const floorNumber = (value: number) => Math.floor(value);

  if (num >= 1000000000) {
    return floorNumber(num / 1000000000).toFixed(0) + 'B';
  } else if (num >= 1000000) {
    return floorNumber(num / 1000000).toFixed(0) + 'M';
  } else if (num >= 1000) {
    return floorNumber(num / 1000).toFixed(0) + 'k';
  } else {
    return floorNumber(num).toString();
  }
};

const BarLabel = ({x, y, bandwidth, data}) => (
  <>
    {data.map((value, index) => (
      <SvgText
        key={index}
        x={x(index) + bandwidth / 2}
        y={y(value) - 10}
        fill="#383E44"
        fontSize={12}
        fontWeight="500"
        textAnchor="middle">
        {formatNumber(value)}
      </SvgText>
    ))}
  </>
);
const SalesTrend: FC = () => {

  const[val1,setVal1]=useState(0);
  const[val2,setVal2]=useState(0);
  const[val3,setVal3]=useState(0);
  useFocusEffect(
    useCallback(() => {
      const fetchAnalytics = async () => {
        try {
          const response = await getAnalytics();
          if (response) {
            setVal1(response.number_of_documents);
            setVal2(response.number_of_users);
          }
        } catch (error) {
          console.error('Error fetching analytics:', error);
        }
      };

      fetchAnalytics();

      // Optional cleanup function (if needed)
      return () => {
        // Clean up resources if necessary
      };
    }, []) // Empty dependency array to trigger only when screen is focused
  );
  const hardcodedData: DataPoint[] = [
    {name: '', price: 1200, cb: 20, date: ''},
    {name: '', price: 2400, cb: 25, date: ''},
    {name: '', price: 3000, cb: 20, date: ''},
    {name: '', price: 4500, cb: 25, date: ''},
    {name: '', price: 5000, cb: 30, date: ''},
    {name: '', price: 3200, cb: 18, date: ''},
    {name: '', price: val1, cb: val2, date: ''},
  ];

  const [data, setData] = useState<DataPoint[]>(hardcodedData);
  const {width: screenWidth} = Dimensions.get('window');
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null); // Track selected index

  const barData = data?.map(d => d.cb) || [];
  const lineData = data?.map(d => d.price) || [];
  const labels = data?.map(d => d.name) || [];
  const bookingDate = data?.map(d => d.date) || [];

  const axesSvg = {fontSize: 10, fill: '#6D747A'};
  const verticalContentInset = {top: 10, bottom: 10};
  const xAxisHeight = 30;

  return (
    <View style={styles.container}>
      <View style={styles.contsinerHeader}>
        <Text style={styles.title}>Reports</Text>
      </View>
      <View style={styles.chartContainer}>
        <View style={styles.chartWrapper}>
          <YAxis
            data={barData}
            style={styles.barChartYAxis}
            contentInset={verticalContentInset}
            numberOfTicks={barData.length}
            svg={axesSvg}
          />
          <View style={styles.chartsContainer}>
            <BarChart
              style={styles.barChart}
              data={barData}
              svg={{fill: '#FFB340'}}
              contentInset={{top: 20, bottom: 20}}
              spacing={0.2}
              animate
              fromZero={true}>
              <Grid direction={Grid.Direction.HORIZONTAL} />
              <BarLabel
                x={index => x(index)}
                y={value => y(value)}
                bandwidth={10} // Adjust if needed
                data={barData}
              />
            </BarChart>
            <XAxis
              style={{marginHorizontal: 8, height: xAxisHeight}}
              data={lineData}
              formatLabel={(value, index) => labels[index]}
              contentInset={{left: 10, right: 10}}
              svg={axesSvg}
            />
          </View>
        </View>
        <View style={styles.chartWrapper}>
          <YAxis
            data={lineData}
            style={styles.lineChartYAxis}
            contentInset={verticalContentInset}
            svg={axesSvg}
          />
          <View style={styles.chartsContainer}>
            <LineChart
              style={styles.lineChart}
              data={lineData}
              contentInset={verticalContentInset}
              svg={{stroke: '#52A2FF', strokeWidth: 4}}>
              <Grid />
              <Decorator
                x={undefined}
                y={undefined}
                data={lineData}
                selectedIndex={selectedIndex}
                setSelectedIndex={setSelectedIndex}
                bookingDate={bookingDate}
              />
            </LineChart>
            <XAxis
              style={{marginHorizontal: -10, height: xAxisHeight}}
              data={lineData}
              formatLabel={(value, index) => labels[index]}
              contentInset={{left: 10, right: 10}}
              svg={axesSvg}
            />
          </View>
        </View>
      </View>
      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, styles.salesLegend]} />
          <Text className="font-[Lato-Regular] text-[14px] text-[#2E3032]">
            Uploads
          </Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, styles.appointmentsLegend]} />
          <Text className="font-[Lato-Regular] text-[14px] text-[#2E3032]">
            Queries
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#CED4DA',
    borderRadius: 5,
    marginTop: 32,
  },
  contsinerHeader: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 20,
  },
  title: {
    fontSize: 16,
    textAlign: 'left',
    marginHorizontal: 10,
    fontFamily: 'Poppins-SemiBold',
    lineHeight: 24,
    color: '#383E44',
    paddingVertical: 10,
  },
  chartContainer: {
    paddingHorizontal: 10,
  },
  chartWrapper: {
    flexDirection: 'row',
    marginBottom: 30,
  },
  yAxisContainer: {
    width: 40,
    flexDirection: 'column',
  },
  chart: {
    flex: 1,
    marginLeft: 10,
  },
  barChart: {
    height: 300,
    borderRadius: 4,
  },
  lineChart: {
    height: 300,
    borderRadius: 5,
    flex: 1,
  },
  xAxis: {
    marginHorizontal: -10,
    height: 30,
  },
  yAxisLabel: {
    position: 'absolute',
    left: -40,
    top: 150,
    fontSize: 14,
    color: '#333',
    transform: [{rotate: '-90deg'}],
    transformOrigin: 'left top',
  },
  legendContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 28,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  legendColor: {
    width: 20,
    height: 20,
    borderRadius: 4,
    marginRight: 8,
  },
  error: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  salesLegend: {backgroundColor: '#52A2FF'},
  appointmentsLegend: {backgroundColor: '#FFB340'},
  barChartYAxis: {marginBottom: 36},
  lineChartYAxis: {marginBottom: 36},
  chartsContainer: {flex: 1, marginLeft: 10},
});

export default SalesTrend;
