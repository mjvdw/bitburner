import { NS } from "@ns";

/**
 * This function pulls data hosted on a local server by the player.
 * 
 * @param ns Netscript object provider by Bitburner
 */
export async function main(ns: NS): Promise<void> {

    // wget function prints a lot - turn it off for convenience.
    ns.disableLog("wget");

    let address = ns.args[0].toString() || "127.0.0.1:5000"

    // Run the sync loop.
    while (true) {
        await sync(ns, address);
        await ns.sleep(500);
    }
}


/**
 * Sync function. Downloads scripts hosted on a local server by the player.
 * 
 * @param ns Netscript object provider by Bitburner
 */
async function sync(ns: NS, address: string) {
    let url = "http://" + address
    await ns.wget(url, "scripts.txt", "home");

    let scriptsList = await ns.read("scripts.txt");

    // Remove trailing comma if there is one.
    if (scriptsList[scriptsList.length - 1] === ",") {
        scriptsList = scriptsList.slice(0, -1);
    }

    let scripts = scriptsList.split(",");
    for (let s in scripts) {
        let saveLocation = "/scripts/" + scripts[s];
        let script_url = url + "/" + scripts[s];
        await ns.wget(script_url, saveLocation, "home");
    }

    let pservs = ns.getPurchasedServers();
    for (let p in pservs) {
        const scripts = ns.ls("home", "/scripts/");
        await ns.scp(scripts, pservs[p]);
    }
}