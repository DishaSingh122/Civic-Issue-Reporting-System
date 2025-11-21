import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import telegramLogo from "@/assets/telegram-logo.png";

const TelegramFAB = () => {
  const handleClick = () => {
    window.open("https://t.me/civictrack_bot", "_blank", "noopener,noreferrer");
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={handleClick}
            className="fixed bottom-6 left-6 z-50 w-14 h-14 rounded-full shadow-strong hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center"
            style={{ backgroundColor: "#0088cc" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#0077b3";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#0088cc";
            }}
            aria-label="Open Telegram Bot"
          >
            <img src={telegramLogo} alt="Telegram" className="w-8 h-8" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="right" className="bg-white text-black border border-border shadow-md">
          <p>Report issue on Telegram</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default TelegramFAB;