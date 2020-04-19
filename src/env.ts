import { config } from "dotenv";

const env = config({ path: `${process.cwd()}/.local.env` });

export default env;
