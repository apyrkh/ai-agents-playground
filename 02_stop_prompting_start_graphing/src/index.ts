import { graph } from "./graph.ts";
import { printWelcome, readUserBrief } from "./utils/io.ts";

printWelcome();
const rawRequirements = await readUserBrief();

await graph.invoke({ rawRequirements });

process.exit(0);
