import { InsideHeartz } from "#database/init";
import { CommentDB } from "./Comment";
import { SessionDB } from "./Session";
async function initialize() {
    await InsideHeartz.sync({alter: true});
}
export { initialize, InsideHeartz, CommentDB, SessionDB };