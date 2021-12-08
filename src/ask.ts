import readline from "readline";

export default function buildPrompt() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const ask = (text: string, defaultAnswer: string) =>
    new Promise((resolve, reject) =>
      rl.question(text, (answer) =>
        resolve(answer && answer !== "" ? answer : defaultAnswer)
      )
    );

  return ask;
}
