import Command from "../command";
import TextToSpeech from "@google-cloud/text-to-speech";
import * as fs from "fs";
import * as util from "util";
import { google } from "@google-cloud/text-to-speech/build/protos/protos";
import { v4 as uuidv4 } from "uuid";

// Creates a client
const client = new TextToSpeech.TextToSpeechClient();

export default class Say extends Command {
  async execute() {
    // we want the bot to say something in the triggering users voice channel
    // only works if the command is executed in a text channel, not in a PM to the bot
    if (this.message.member && this.message.member.voice.channel) {
      const connection = await this.message.member.voice.channel.join();

      // Join the words to a sentence
      const text = this.args.join(" ");

      // Build a request for Google Text-To-Speech API
      const request = {
        input: { text: text },
        // Select the language and SSML voice gender (optional)
        voice: {
          languageCode: "en-US",
          ssmlGender: google.cloud.texttospeech.v1.SsmlVoiceGender.NEUTRAL,
        },
        // select the type of audio encoding
        audioConfig: {
          audioEncoding: google.cloud.texttospeech.v1.AudioEncoding.MP3,
        },
      };

      // Request the audio
      const [response] = await client.synthesizeSpeech(request);

      // save the audio to a file with a random name just in case it gets called more than once at the same time
      const fileName = `${uuidv4()}.mp3`;
      fs.writeFileSync(fileName, response.audioContent, "binary");

      // Play the audio
      const dispatcher = connection.play(fileName);

      // Add a handler which is colled when audio playback is finished
      dispatcher.on("finish", () => {
        // cleanup
        dispatcher.destroy();
        fs.unlinkSync(fileName);
      });
    } else {
      this.message.reply("You need to join a voice channel first!");
    }
  }
}
