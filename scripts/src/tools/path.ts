/** @param {import(".").NS} ns **/

import {
    // getPathToServer
    // @ts-ignore
} from "/scripts/library/utils.js";

/**
 * Helper function to get the direct path to a particular server. Useful for
 * navigating the tree without having to search manually.
 * 
 * @param ns Netscript object provider by Bitburner.
 * @returns Object with the results and a status (true if found, false if not)
 */
export async function main(ns: any) {

    let server = ns.args[0]
    if (!server) { ns.tprint("Please specify a server."); return }
    let path = getPathToServer(ns, server)

    if (path[-1] === server) { ns.tprint(path.join(" --> ")) }
    else { ns.tprint("Server not found.") }

    // let startServer = ns.getHostname();
    // let target = ns.args[0];
    // if (target === undefined) {
    //     ns.alert("Please provide target server");
    //     return;
    // }
    // let [results, isFound] = findPath(ns, target, startServer, [], [], false);
    // if (!isFound) {
    //     ns.alert("Server not found!");
    // } else {
    //     ns.tprint(results.join(" --> "));
    // }
}


export function getPathToServer(ns: any, host: string): string[] {

    let searching = true
    let path: string[] = []

    // Safety valve to prevent infinite loop
    let i = 0
    while (searching) {


        // Safety valve to prevent infinite loop
        if (i == 20) { searching = false }
        i++
    }

    return path
}


// function findPath(ns: any, target: string, serverName: string, serverList: string[], ignore: string[], isFound: boolean): any[] {
//     ignore.push(serverName);
//     let scanResults = ns.scan(serverName);
//     for (let server of scanResults) {
//         if (ignore.includes(server)) {
//             continue;
//         }
//         if (server === target) {
//             serverList.push(server);
//             return [serverList, true];
//         }
//         serverList.push(server);
//         [serverList, isFound] = findPath(
//             ns,
//             target,
//             server,
//             serverList,
//             ignore,
//             isFound
//         );
//         if (isFound) {
//             return [serverList, isFound];
//         }
//         serverList.pop();
//     }
//     return [serverList, false];
// };