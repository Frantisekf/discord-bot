import Command from "../command";
import fetch from "node-fetch";

const API_URL = "https://icanhazdadjoke.com/";

export default class DadJoke extends Command {
  async execute() {
    fetch(API_URL, {
      headers: {
        Accept: "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        this.message.reply(data.joke);
      })
      .catch(() => {
        this.message.reply("error fetching joke");
      });
  }
}
