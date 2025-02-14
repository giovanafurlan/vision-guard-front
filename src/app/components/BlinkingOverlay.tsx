import { Box, Text } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { useEffect } from "react";

const blink = keyframes`
  0% { opacity: 0.5; }
  50% { opacity: 0; }
  100% { opacity: 0.5; }
`;

interface BlinkingOverlayProps {
  display: string;
}

export const BlinkingOverlay = ({ display }: BlinkingOverlayProps) => {
  useEffect(() => {
    if (display !== "none") {
      const siren = new Audio("/sounds/siren.mp3");
      siren.loop = true;
      siren.play();

      return () => {
        siren.pause();
        siren.currentTime = 0;
      };
    }
  }, [display]);

  return (
    <Box
      position="absolute"
      top={0}
      left={0}
      width="100%"
      height="100%"
      bg="rgba(255, 0, 0, 0.5)"
      zIndex={11}
      animation={`${blink} 1s infinite`}
      display={display}
      alignItems="center"
      justifyContent="center"
    >
      <Box
        bg="red.600"
        color="white"
        padding={4}
        borderRadius="md"
        boxShadow="lg"
      >
        <Text fontSize="xl" fontWeight="bold" textAlign="center">
          Attention! Sharp objects detected
        </Text>
        <Text fontSize="md" textAlign="center">
          The images will be sent to your email
        </Text>
      </Box>
    </Box>
  );
};
