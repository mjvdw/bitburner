/** @param {import(".").NS} ns **/

/**
 * This function pulls data hosted on a local server by the player.
 * 
 * @param ns Netscript object provider by Bitburner
 */
export async function main(ns: any) {

    // wget function prints a lot - turn it off for convenience.
    ns.disableLog("wget");

    // Optional argument to just run the script once, rather than
    // continuously, which makes debuging easier/
    let debug = ns.args[0] || false;

    // Run the sync loop.
    if (debug) {
        await sync(ns = ns);
    } else {
        while (true) {
            await sync(ns = ns);
            await ns.sleep(500);
        }
    }
}


/**
 * Sync function. Downloads scripts hosted on a local server by the player.
 * 
 * @param ns Netscript object provider by Bitburner
 */
async function sync(ns: any) {
    await ns.wget("http://127.0.0.1:5000", "scripts.txt", "home");

    let scriptsList = await ns.read("scripts.txt");
    let scripts = scriptsList.split(",");
    for (let s in scripts) {
        let saveLocation = "/scripts/" + scripts[s];
        let url = "http://127.0.0.1:5000/" + scripts[s];
        await ns.wget(url, saveLocation, "home");
    }

    let pservs = ns.getPurchasedServers();
    for (let p in pservs) {
        const scripts = ns.ls("home", "/scripts/");
        await ns.scp(scripts, pservs[p]);
    }
}