import { NS } from "@ns";

/**
 * 
 * @param ns Netscript object provided by Bitburner.
 */
export async function main(ns: NS): Promise<void> {

    while (true) {
        await ns.share()
    }
}