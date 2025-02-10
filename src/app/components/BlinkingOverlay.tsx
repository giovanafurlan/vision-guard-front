import { Box } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";

// Definição da animação (pisca alternando entre 50% e 0% de opacidade)
const blink = keyframes`
  0% { opacity: 0.5; }
  50% { opacity: 0; }
  100% { opacity: 0.5; }
`;

interface BlinkingOverlayProps {
  display: string;
}

export const BlinkingOverlay = ({ display }: BlinkingOverlayProps) => {
  return (
    <Box
      display={display}
      position="absolute"
      top={0}
      left={0}
      width="100%"
      height="100%"
      bg="rgba(255, 0, 0, 0.5)" // Vermelho semi-transparente
      zIndex={11} // Acima do conteúdo
      animation={`${blink} 1s infinite`} // Aplica a animação
    />
  );
};
