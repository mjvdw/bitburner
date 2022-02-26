/** @param {import(".").NS} ns */
export async function main(ns: any) {
    let target = ns.args[0]
    let server = ns.getServer()
    // ns.tprint("Running batch controller on " + server.hostname + " against " + target)
    while (true) {
        await ns.sleep(10000)
    }
}