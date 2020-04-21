import { VoiceChannel, VoiceConnection } from "discord.js";
import * as fs from "fs";
import TextToSpeech from "@google-cloud/text-to-speech";
import { google } from "@google-cloud/text-to-speech/build/protos/protos";
import { v4 as uuidv4 } from "uuid";

import Logger from "../utils/logger";

export default class TheBot {
  private static instance: TheBot;

  private static INACTIVE_TIME = 10 * 1000;

  private client = new TextToSpeech.TextToSpeechClient();

  private voiceChannel: VoiceChannel;
  private voiceConnection: VoiceConnection;
  private voiceActivityTimer: NodeJS.Timeout;

  /**
   * The Singleton's constructor should always be private to prevent direct
   * construction calls with the `new` operator.
   */
  private constructor() {}

  /**
   * The static method that controls the access to the singleton instance.
   *
   * This implementation let you subclass the Singleton class while keeping
   * just one instance of each subclass around.
   */
  public static getInstance(): TheBot {
    if (!TheBot.instance) {
      TheBot.instance = new TheBot();
    }

    return TheBot.instance;
  }

  private onInactive() {
    this.leaveVoice();
  }

  private stopActivityTimer() {
    Logger.log("Stopping activity timer");
    clearTimeout(this.voiceActivityTimer);
  }

  private refreshActivityTimer() {
    Logger.log("Refreshing activity timer");
    this.voiceActivityTimer = setTimeout(
      () => this.onInactive(),
      TheBot.INACTIVE_TIME
    );
  }

  public async joinVoice(voiceChannel: VoiceChannel) {
    if (
      voiceChannel &&
      (!this.voiceChannel || this.voiceChannel.name !== voiceChannel.name)
    ) {
      this.voiceChannel = voiceChannel;
      this.voiceConnection = await voiceChannel.join();
      Logger.log(`Joining voice channel ${voiceChannel.name}`);
    }
  }

  public leaveVoice() {
    if (this.voiceChannel) {
      Logger.log(`Leaving voice channel ${this.voiceChannel.name}`);
      this.voiceChannel.leave();
      this.voiceChannel = undefined;
      this.voiceConnection = undefined;
    }
  }

  public async say(text: string) {
    if (this.voiceChannel && this.voiceConnection) {
      this.stopActivityTimer();
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
      const [response] = await this.client.synthesizeSpeech(request);

      // save the audio to a file with a random name just in case it gets called more than once at the same time
      const fileName = `${uuidv4()}.mp3`;
      fs.writeFileSync(fileName, response.audioContent, "binary");

      // Play the audio
      const dispatcher = this.voiceConnection.play(fileName);

      // Add a handler which is called when audio playback is finished
      dispatcher.on("finish", () => {
        // cleanup
        dispatcher.destroy();
        fs.unlinkSync(fileName);
        this.refreshActivityTimer();
      });
    }
  }

  public async playAudioFile(filePath: string) {
    if (this.voiceChannel && this.voiceConnection) {
      this.stopActivityTimer();

      const dispatcher = this.voiceConnection.play(filePath);

      dispatcher.on("finish", () => {
        dispatcher.destroy();
        this.refreshActivityTimer();
      });
    }
  }
}
