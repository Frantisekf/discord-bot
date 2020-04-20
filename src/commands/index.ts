import Command from "../command";
import RandomNumber from "./randomNumber";
import DadJoke from "./dadjoke";
import Say from "./say";

const CommandsList: Record<string, typeof Command> = {
  randomNumber: RandomNumber,
  dadJoke: DadJoke,
  say: Say,
};

export default CommandsList;
