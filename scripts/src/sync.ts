/** @param {import(".").NS} ns **/
export async function main(ns: any) {
    ns.disableLog("wget");

    let debug = ns.args[0] || false;

    if (debug) {
        await sync(ns = ns);
    } else {
        while (true) {
            await sync(ns = ns);
            await ns.sleep(500);
        }
    }
}

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
