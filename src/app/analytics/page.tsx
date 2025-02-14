"use client";

import { useEffect, useState } from "react";
import { Box, Button, Input, Text, useToast } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { BlinkingOverlay } from "../components/BlinkingOverlay";

export default function AnalyticsPage() {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [containSharpObject, setContainSharpObject] = useState("none");
  const toast = useToast();
  const router = useRouter();

  useEffect(() => {
    const apiKey = localStorage.getItem("apiKey");
    if (!apiKey) {
      toast({ title: "Please register your email", status: "error" });
      router.push("/");
    }
  }, [router, toast]);  

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setVideoFile(file);
    }
  };

  const sendEmail = async (images: string[]) => {
    const email = localStorage.getItem("userEmail");
  
    const response = await fetch("/api/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, images }),
    });

    if (response.ok) {
      setContainSharpObject("block");
    }
  
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Erro ao enviar email:", errorData);
    }
  };  

  const handleProcessVideo = async () => {
    if (!videoFile) {
      toast({ title: "Please select a video file", status: "warning" });
      return;
    }
  
    setLoading(true);
    const formData = new FormData();
    formData.append("video", videoFile);
  
    try {
      const response = await fetch("http://127.0.0.1:5001/process-video", {
        method: "POST",
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error("Failed to process video");
      }
  
      const result = await response.json();
      toast({
        title: "Video processed successfully",
        description: result.message,
        status: "success",
      });
    
      sendEmail(result.images);
  
    } catch (error: any) {
      toast({
        title: "Error processing video",
        description: error.message,
        status: "error",
      });
    } finally {
      setLoading(false);
    }
  };  

  return (
    <Box
      display="flex"
      flexDir="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      bg="black"
      color="white"
      position="relative"
    >
      <BlinkingOverlay display={containSharpObject}/>

      <Box
        p={6}
        borderRadius="md"
        boxShadow="lg"
        maxW="sm"
        position="relative"
        zIndex={12}
      >
        <Text fontSize="md" fontWeight="bold" mb={4}>
          Upload a video for analysis
        </Text>
        <Input
          type="file"
          accept="video/*"
          onChange={handleFileChange}
          mb={4}
        />
        <Button
          onClick={handleProcessVideo}
          isLoading={loading}
          bg="#e30652"
          color="white"
          _hover={{ bg: "#c20546" }}
          width="full"
        >
          Process video
        </Button>
      </Box>
    </Box>
  );
}
