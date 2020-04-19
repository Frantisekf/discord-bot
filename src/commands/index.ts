import Command from "../command";
import RandomNumber from "./randomNumber";
import DadJoke from "./dadjoke";

const CommandsList: Record<string, typeof Command> = {
  // command names must be lowercase
  random: RandomNumber,
  joke: DadJoke,
};

export default CommandsList;
