/** @param {NS} ns **/
export async function main(ns) {
	let target = ns.args[0];
	let server = ns.getServer();

	let maxThreads = Math.trunc(ns.getServerMaxRam(server.hostname) / 2);
	let offset = 200;

	// Prepare server.
	unlockServer(ns, target);

	let serverReady = false
	while (!serverReady) {
		startBatch(ns, target, maxThreads, true);
		if (!serverReady) {
			await ns.sleep(offset);
		}
	}

	// Set up and run batches.
	while (true) {
        let freeRam = ns.getServerMaxRam(server.hostname) - ns.getServerUsedRam(server.hostname);
        if (freeRam >= 20) {
            startBatch(ns, target, maxThreads, false);
            await ns.sleep(1000);
        } else {
            await ns.sleep(2000);
        }
	}
}

function unlockServer(ns, target) {
    try {
        ns.brutessh(target);
    } catch (error) {
        ns.print(error)
    }

    try {
        ns.ftpcrack(target);
    } catch (error) {
        ns.print(error)
    }

    try {
        ns.relaysmtp(target);
    } catch (error) {
        ns.print(error)
    }

    try {
        ns.httpworm(target);
    } catch (error) {
        ns.print(error)
    }

    try {
        ns.sqlinject(target);
    } catch (error) {
        ns.print(error)
    }

    ns.nuke(target);
}

function startBatch(ns, target, threads, preparingServer) {
	let server = ns.getServer();
	ns.exec("scripts/110-batch.js", server.hostname, 1, target, threads, preparingServer);
}