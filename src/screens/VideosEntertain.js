import React from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

const VideosEntertain = () => {
  const widgetHTML = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
        <style>
          body {
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            // height: 100%;
            background-color: #f5f5f5;
          }
        //   .elfsight-app {
        //     width: 100%;
        //     height: 100%;
        //   }
        </style>
        <script src="https://static.elfsight.com/platform/platform.js" async></script>
      </head>
      <body>
        <div class="elfsight-app-e17e399b-70ae-484d-a29b-2756ee501d3f" data-elfsight-app-lazy></div>
      </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      <WebView
        originWhitelist={['*']}
        source={{ html: widgetHTML }}
        style={styles.webView}
      />
    </View>
  );
};

export default VideosEntertain;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  webView: {
    // flex: 1, // Occupies the full height and width of the container
  },
});
