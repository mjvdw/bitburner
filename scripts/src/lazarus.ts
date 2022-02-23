/** @param {import(".").NS} ns */

// @ts-ignore
import { getAllServers } from "/scripts/utils.js";

/**
 * This is the "master" script for hacking servers.
 * It controls:
 * - Deciding which server to hack.
 * - Purchasing new client servers to increase hacking power.
 * - Starting batch controllers for each server.
 * 
 * @param ns Netscript object provider by Bitburner
 */
export async function main(ns: any) {
    let servers = getAllServers(ns)
    ns.tprint(servers)
}
