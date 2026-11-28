import { messages } from "$src/i18n/messages";
import { ArrowBack } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { useRouter } from "next/navigation";

type BackButtonProps = {
  handleGoBack?: VoidFunction;
};

// Navigates to the previous page unless a custom function is passed to it.
export default function BackButton({ handleGoBack }: BackButtonProps) {
  const router = useRouter();
  if (handleGoBack == undefined) {
    handleGoBack = () => router.back();
  }
  return (
    <IconButton
      aria-label={messages.Components.backButton}
      size="medium"
      className="h-12 w-12 rounded-lg bg-teal-400/5 text-white"
      onClick={handleGoBack}
    >
      <ArrowBack />
    </IconButton>
  );
}
