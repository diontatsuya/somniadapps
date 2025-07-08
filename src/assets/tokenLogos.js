import goldIcon from "./gold.png";
import gemIcon from "./gem.png";
import sttIcon from "./stt.png";

export default {
  GOLD: {
    name: "GOLD",
    address: import.meta.env.VITE_TOKEN_GOLD,
    icon: goldIcon,
  },
  GEM: {
    name: "GEM",
    address: import.meta.env.VITE_TOKEN_GEM,
    icon: gemIcon,
  },
  STT: {
    name: "STT",
    address: import.meta.env.VITE_TOKEN_STT,
    icon: sttIcon,
  },
};
