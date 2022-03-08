/** @param {import(".").NS} ns **/

/**
 * Helper function to get the direct path to a particular server. Useful for
 * navigating the tree without having to search manually.
 * 
 * @param ns Netscript object provider by Bitburner.
 * @returns Object with the results and a status (true if found, false if not)
 */
export async function main(ns: any) {
    let startServer = ns.getHostname();
    let target = ns.args[0];
    if (target === undefined) {
        ns.alert("Please provide target server");
        return;
    }
    let [results, isFound] = findPath(ns, target, startServer, [], [], false);
    if (!isFound) {
        ns.alert("Server not found!");
    } else {
        ns.tprint(results.join(" --> "));
    }
}


function findPath(ns: any, target: string, serverName: string, serverList: string[], ignore: string[], isFound: boolean): any[] {
    ignore.push(serverName);
    let scanResults = ns.scan(serverName);
    for (let server of scanResults) {
        if (ignore.includes(server)) {
            continue;
        }
        if (server === target) {
            serverList.push(server);
            return [serverList, true];
        }
        serverList.push(server);
        [serverList, isFound] = findPath(
            ns,
            target,
            server,
            serverList,
            ignore,
            isFound
        );
        if (isFound) {
            return [serverList, isFound];
        }
        serverList.pop();
    }
    return [serverList, false];
};