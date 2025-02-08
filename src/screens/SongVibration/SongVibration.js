import React from 'react';
import { Button, View, Vibration } from 'react-native';

const SongVibration = () => {
  const startVibration = () => {
    // Define the vibration pattern for "Twinkle Twinkle Little Star"
    // [vibration duration, pause duration, ...]
    const pattern = [
      400, 200, // Twinkle
      400, 200, // Twinkle
      600, 400, // Little star
      400, 200, // How I
      400, 200, // Wonder
      800, 400, // What you are
    ];

    // Repeat the pattern once
    Vibration.vibrate(pattern, false); // Pass true if you want it to repeat indefinitely
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="Play Twinkle Twinkle Vibration" onPress={startVibration} />
    </View>
  );
};

export default SongVibration;
