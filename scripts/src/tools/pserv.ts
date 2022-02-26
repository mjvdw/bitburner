/** @param {import(".").NS} ns */

// @ts-ignore
import { buyServer, deleteServer } from "/scripts/utils.js";

export async function main(ns: any) {
    // User can optionally specify the server's hostname and RAM.
    // If RAM is not provided, script will determine the best option automatically.
    // If hostname is not provided, the buyServer() function will iterate through to the next
    // name from pserv-001, pserv-002, pserv-003, ... pserv-025.

    let action = ns.args[0]
    let hostname = ns.args[1]
    let ram = ns.args[2]

    if (action == "buy") { await buyServer(ns, ram, hostname) }
    else if (action == "delete") { deleteServer(ns, hostname) }
    else { ns.tprint("Please specify a valid action. Valid actions are 'buy' and 'delete'.") }
}