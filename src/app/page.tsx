"use client";

import { useEffect, useState } from "react";
import { auth } from "./lib/firebaseConfig";
import { sendSignInLinkToEmail } from "firebase/auth";
import { Box, Button, Input, Text, Image, useToast } from "@chakra-ui/react";
import { useRouter, useSearchParams } from "next/navigation";

const actionCodeSettings = {
  url: "http://localhost:3000/",
  handleCodeInApp: true,
};

export default function EmailConfirmationPage() {
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const router = useRouter();

  const search = useSearchParams();
  const apiKey = search?.get("apiKey");

  useEffect(() => {
    if (typeof window !== "undefined" && apiKey) {
      localStorage.setItem("apiKey", apiKey);
      router.push("/analytics");
    }
  }, [apiKey]);

  const handleSendEmail = async () => {
    if (!email) {
      toast({ title: "Please enter a valid email", status: "warning" });
      return;
    }
    setLoading(true);
    try {
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      if (typeof window !== "undefined") {
        localStorage.setItem("userEmail", email);
      }
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
      flexDir="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      bg="black"
      color="white"
    >
      <Image src="/images/logo.png" alt="Logo" w="40" h="40" />
      <Box p={6} borderRadius="md" boxShadow="lg" maxW="sm">
        <Text fontSize="md" fontWeight="bold" mb={4}>
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
          Send confirmation email
        </Button>
      </Box>
    </Box>
  );
}
