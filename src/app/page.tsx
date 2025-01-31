"use client";

import { useState } from "react";
import { auth } from "./lib/firebaseConfig";
import { sendSignInLinkToEmail } from "firebase/auth";
import { Box, Button, Input, Text, Image, Heading, useToast } from "@chakra-ui/react";

const actionCodeSettings = {
  url: "http://localhost:3000/", // Change to your actual domain
  handleCodeInApp: true,
};

export default function EmailConfirmationPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleSendEmail = async () => {
    if (!email) {
      toast({ title: "Please enter a valid email", status: "warning" });
      return;
    }
    setLoading(true);
    try {
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      localStorage.setItem("userEmail", email);
      toast({
        title: "Confirmation email sent",
        description: "Check your inbox to confirm your email.",
        status: "success",
      });
      setEmail("");
    } catch (error: any) {
      toast({
        title: "Error sending email",
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
      alignItems="center"
      gap={4}
      justifyContent="center"
      height="100vh"
      bg="black"
    >
      <Image src="/images/logo.png" alt="Logo"/>
      <Heading>Register</Heading>
      <Box textAlign="center" p={6} borderRadius="md" boxShadow="lg" maxW="sm">
        <Text fontSize="2xl" fontWeight="bold" mb={4}>
          Enter your email
        </Text>
        <Input
          placeholder="Enter your email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          mb={4}
        />
        <Button
          onClick={handleSendEmail}
          isLoading={loading}
          bg="#e30652"
          color="white"
          _hover={{ bg: "#c20546" }}
          width="full"
        >
          Send Confirmation Email
        </Button>
      </Box>
    </Box>
  );
}
