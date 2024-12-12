import { ImageProps } from 'react-native';

export const BACKGROUND_COLOR = '#F1F1F1';

export interface PageInterface extends Pick<ImageProps, 'source'> {
  title: string;
  description: string;
}

export const PAGES: PageInterface[] = [
  {
    title: 'Inclusive Communication',
    description: 
        'Anugrah provides real-time voice-to-text and text-to-voice translation in 20+ Indian languages.',
    source: require('./assets/skates/01.png'),
},
{
    title: 'BlockChain Secure Integration',
    description: 
        'The app integrates with communication platforms for multi-platform conversations ensuring user privacy.',
    source: require('./assets/skates/02.png'),
},
// {
//     title: 'Sign-Language Videos and Online Video Calls',
//     description: 
//         'Real-time sign-language video integration and video call support with multimodal assistance.',
//     source: require('./assets/skates/03.png'),
// },
// {
//     title: 'Voice to Augmented ISL',
//     description: 
//         'Transforms spoken words into augmented Indian Sign Language visuals, enhancing inclusivity.',
//     source: require('./assets/skates/01.png'),
// },
// {
//     title: 'Emotion-Based Audio and Emergency Features',
//     description: 
//         'Emotion-adaptive audio conversion paired with critical emergency support like vibration feedback and alerts.',
//     source: require('./assets/skates/02.png'),
// },
{
    title: 'On-Call Transcription and Speech Features',
    description: 
        'Provides live transcription and speech assistance during calls for seamless communication.',
    source: require('./assets/skates/03.png'),
}
,
];