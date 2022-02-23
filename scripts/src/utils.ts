/** @param {import(".").NS} ns */

/**
 * Get a list of all servers currently accessible (but not necessarily hackable).
 * @param ns Netscript object provider by Bitburner.
 */
export function getAllServers(ns: any) {

    let servers: string[] = []
    let queue: string[] = []
    let excluded = ["home", "darkweb"]

    // Initial scan to set up first queue.
    queue = ns.scan("home")

    // Iterate through initial queue, adding new servers as it finds them.
    // By ignoring duplicates, this is not an infinite loop.
    while (queue.length > 0) {
        let scanQueue = queue
        for (let s in scanQueue) {
            servers.push(scanQueue[s])
            queue = queue.filter(value => value !== scanQueue[s])
            let newServers = ns.scan(scanQueue[s])
            newServers.forEach((newServer: string) => {
                if (excluded.includes(newServer) == false && servers.includes(newServer) == false) {
                    queue.push(newServer)
                }
            })
        }
    }

    return servers
}
