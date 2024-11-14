import { ImageProps } from 'react-native';

export const BACKGROUND_COLOR = '#F1F1F1';

export interface PageInterface extends Pick<ImageProps, 'source'> {
  title: string;
  description: string;
}

export const PAGES: PageInterface[] = [
  {
    title: 'Graph RAG',
    description:
      'Hybrid Model of vector embeddings and Graph RAG to generate precise and contextually rich responses',
    source: require('./assets/skates/01.png'),
  },
  {
    title: 'Llama 3.1',
    description:
      "Llama 3.1 to generate relationship triplets for generation of knowledge graph",
    source: require('./assets/skates/02.png'),
  },
  {
    title: 'MFA',
    description:
      'Increased Security with the use of QR code authentication as multi-factor authentication',
    source: require('./assets/skates/03.png'),
  },
];