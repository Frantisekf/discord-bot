import Command from "../command";
import RandomNumber from "./randomNumber";
import DadJoke from "./dadjoke";

const CommandsList: Record<string, typeof Command> = {
  randomNumber: RandomNumber,
  dadJoke: DadJoke,
};

export default CommandsList;
