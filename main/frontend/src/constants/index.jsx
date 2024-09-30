import { BotMessageSquare } from "lucide-react";
import { BatteryCharging } from "lucide-react";
import { Fingerprint } from "lucide-react";
import { ShieldHalf } from "lucide-react";
import { PlugZap } from "lucide-react";
import { GlobeLock } from "lucide-react";



export const testimonials = [
  {
    title: "CrossFi Wallet Integration",
    text: "The app needs to integrate with CrossFi-compatible wallets (such as MetaMask for EVM compatibility or a native CrossFi wallet) for users to securely send and receive XFI payments",
  },
  {
    title: "Smart Contract Interaction",
    text: " A simple smart contract could be deployed on the CrossFi Chain to handle the generation of unique payment requests. Each payment request could be stored on-chain as an open request, with details such as the requested amount, sender and receiver addresses, and expiration time",
  },
  {
    title: "CrossFi Scan API",
    text: " Leverage the CrossFi Scan API for querying the blockchain to track payment status. The app can periodically check the status of payments and update users when the transaction is complete",
  },
];

export const features = [
  {
    icon: <BotMessageSquare />,
    text: "User-Friendly Interface",
    description:
      "The app should have a clean, intuitive user interface (UI), allowing users to input basic information like the amount of XFI they want to receive, their wallet address, and a description.",
  },
  {
    icon: <Fingerprint />,
    text: "Payment Request Links",
    description:
      "Customizable Payment Links: After filling in payment details, users click a button to generate a unique payment URL.This URL can be shared with anyone through email, social media, or messaging platforms.",
  },
  {
    icon: <ShieldHalf />,
    text: "QR Code Generation",
    description:
      "Each payment link can also generate a scannable QR code. This makes it ideal for in-person transactions or situations where people don’t want to copy-paste links.",
  },
  {
    icon: <BatteryCharging />,
    text: "Transaction Tracking and Confirmation",
    description:
      "Once the payment is initiated, the app should provide real-time status updates of the transaction by integrating with CrossFi Scan (a block explorer for the CrossFi Chain).",
  },
  {
    icon: <PlugZap />,
    text: "Email/Push Notifications",
    description:
      "- To make the experience more seamless, users will receive notifications when A payment link is generated,a payment is completed and confirmed",
  },
  {
    icon: <GlobeLock />,
    text: "Fee Mechanism with XFI",
    description:
      "To incentivize the use of XFI and boost its liquidity, there can be a small fee for generating custom or advanced payment links.",
  },
];


export const checklistItems = [
  {
    title: "Create Payment Request",
    description:
      "Users input details like payment amount, wallet address, and a reference or description. Upon submission, the app generates a unique payment link and QR code that can be shared.",
  },
  {
    title: "Payment Execution",
    description:
      "The recipient clicks the link or scans the QR code, which directs them to the payment page. The user confirms the transaction in their CrossFi wallet, paying the requested XFI amount.",
  },
  {
    title: "Transaction Tracking",
    description:
      "The app integrates with CrossFi Scan to provide real-time status updates. Users can track payment progress, seeing if it is pending, confirmed, or completed.",
  },
  {
    title: "Notifications & Confirmation",
    description:
      "Once the payment is confirmed, both parties receive notifications via email or push notifications. Payment records are saved in the app dashboard for easy tracking and bookkeeping.",
  },
];


