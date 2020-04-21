import Command from "../command";
import RandomNumber from "./randomNumber";
import DadJoke from "./dadjoke";
import Say from "./say";
import MilujiSvojiPraci from "./milujiSvojiPraci";

const CommandsList: Record<string, typeof Command> = {
  randomNumber: RandomNumber,
  dadJoke: DadJoke,
  say: Say,
  msp: MilujiSvojiPraci,
};

export default CommandsList;
