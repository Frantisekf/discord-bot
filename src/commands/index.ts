import Command from '../command';
import RandomNumber from './randomNumber'


const CommandsList: Record<string, typeof Command> = {
  randomNum: RandomNumber,

};

export default CommandsList;