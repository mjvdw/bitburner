import { NS } from "@ns";
import { buyServer, deleteServer } from "/library/utils.js";


/**
 * Tool for purchasing or deleting servers manually. Optionally provide 
 * servers desired hostname and RAM. The script will check whether these are
 * possible and available and alert the user if they aren't.
 * 
 * User must specify an "action" - either buying or deleting a server.
 * 
 * @param ns Netscript object provided by Bitburner.
 */
export async function main(ns: NS): Promise<void> {
    let action = ns.args[0].toString();
    let hostname = ns.args[1].toString();
    let ram = Number(ns.args[2]);

    if (action == "buy") { await buyServer(ns, ram, hostname) }
    else if (action == "delete") { deleteServer(ns, hostname) }
    else { ns.tprint("Please specify a valid action. Valid actions are 'buy' and 'delete'.") }
}