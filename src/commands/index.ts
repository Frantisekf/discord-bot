import Command from '../command';
import RandomNumber from './randomNumber'


const CommandsList: Record<string, typeof Command> = {
  // command names must be lowercase
  random: RandomNumber,

};

export default CommandsList;