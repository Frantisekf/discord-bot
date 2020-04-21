import Command from "../command";
import TheBot from "../bot/theBot";

// Creates a client

export default class Say extends Command {
  async execute() {
    // we want the bot to say something in the triggering users voice channel
    // only works if the command is executed in a text channel, not in a PM to the bot
    if (this.message.member && this.message.member.voice.channel) {
      // Join the words to a sentence
      const text = this.args.join(" ");

      const theBot: TheBot = TheBot.getInstance();

      await theBot.joinVoice(this.message.member.voice.channel);
      await theBot.say(text);
    } else {
      this.message.reply("You need to join a voice channel first!");
    }
  }
}
