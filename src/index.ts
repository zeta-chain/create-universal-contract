import { Command } from "commander";
import { cloneRepository } from "./cloneRepository";
import { getExampleDirectories } from "./getExampleDirectories";
import { promptForExample } from "./promptForExample";
import { copyExample } from "./copyExample";
import path from "path";
import os from "os";

const program = new Command();
const REPO_URL = "https://github.com/zeta-chain/example-contracts.git";
const TEMP_DIR = path.join(os.tmpdir(), "example-contracts");
const EXAMPLES_DIR = path.join(TEMP_DIR, "examples");
const BRANCH_NAME = "descriptions";

program
  .option("--no-cache", "Bypass cached repository and re-clone")
  .option("--verbose", "Enable verbose logging")
  .option(
    "--output <directory>",
    "Specify custom output directory or name",
    process.cwd()
  )
  .parse(process.argv);

const options = program.opts();
const isVerbose = options.verbose;
const outputDir = options.output;

const main = async () => {
  try {
    await cloneRepository(REPO_URL, TEMP_DIR, BRANCH_NAME, options, isVerbose);
    const directories = await getExampleDirectories(EXAMPLES_DIR);
    const chosenExample = await promptForExample(directories);
    await copyExample(chosenExample, EXAMPLES_DIR, outputDir, isVerbose);
  } catch (error: any) {
    if (isVerbose) {
      console.error("An error occurred:", error.message);
      console.error(error.stack);
    }
    process.exit(1);
  }
};

main();
