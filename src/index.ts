import { readFileSync } from "fs";

// read and parse input.txt
const lines = readFileSync("input.txt", { encoding: "utf-8" })
  .replace(/\r/g, "")
  .trim()
  .split("\n");

const program = lines.map((prg) => {
  const input: string[] = prg.split(" ");

  const res: { op?: string; value?: number } = {};

  res.op = input[0];

  if (res.op === "addx") {
    res.value = parseInt(input[1]);
  }

  return res;
});

class CPUCathode {
  program: {
    op?: string | undefined;
    value?: number | undefined;
  }[];
  currentLine: number;
  cycle: number;
  wait: number;
  registers: {
    X: number;
  };

  constructor(program: any) {
    this.program = program;
    this.currentLine = 0;
    this.cycle = 0;
    this.wait = 0;
    this.registers = {
      X: 1,
    };
  }

  runCycle() {
    if (this.currentLine >= this.program.length) {
      return false;
    }
    this.cycle++;

    const line = this.program[this.currentLine];

    switch (line.op) {
      case "noop":
        // Do nothing here
        this.currentLine++;
        break;

      case "addx":
        if (this.wait === 0) {
          this.wait = 1;
        } else {
          this.wait--;
          if (this.wait === 0 && line.value) {
            this.registers.X += line.value;
            this.currentLine++;
          }
        }
        break;

      default:
        throw new Error("unkown op: " + line.op);
    }

    return true;
  }
}

function partOne() {
  const cpu = new CPUCathode(program);
  let sum = 0;

  while (true) {
    // cyle run
    if (!cpu.runCycle()) {
      break;
    }
    if (cpu.cycle % 40 === 20) {
      sum += cpu.cycle * cpu.registers.X;

      console.log(
        cpu.cycle,
        "th",
        "  ",
        cpu.cycle,
        "*",
        cpu.registers.X,
        "  ",
        sum,
        "  ",
        cpu.cycle * cpu.registers.X
      );
    }
  }
}

// During the 20th cycle, register X has the value 21, so the signal strength is 20 * 21 = 420. (The 20th cycle occurs in the middle of the second addx -1, so the value of register X is the starting value, 1, plus all of the other addx values up to that point: 1 + 15 - 11 + 6 - 3 + 5 - 1 - 8 + 13 + 4 = 21.)
// During the 60th cycle, register X has the value 19, so the signal strength is 60 * 19 = 1140.
// During the 100th cycle, register X has the value 18, so the signal strength is 100 * 18 = 1800.
// During the 140th cycle, register X has the value 21, so the signal strength is 140 * 21 = 2940.
// During the 180th cycle, register X has the value 16, so the signal strength is 180 * 16 = 2880.
// During the 220th cycle, register X has the value 18, so the signal strength is 220 * 18 = 3960.

partOne();
