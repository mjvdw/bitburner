var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/** @param {import(".").NS} ns **/
export function main(ns) {
    return __awaiter(this, void 0, void 0, function* () {
        let target = ns.args[0];
        let maxThreads = ns.args[1];
        let preparingServer = ns.args[2] || false;
        let times = getTimes(ns, target);
        let threads = getThreads(ns, target, maxThreads);
        let validThreads = Object.keys(threads).every((n) => threads[n] >= 1);
        // ns.tprint(validThreads);
        if (validThreads) {
            yield runBatch(ns, target, times, threads, preparingServer);
        }
    });
}
function getTimes(ns, target) {
    // Get run times for server.
    let wTime = ns.getWeakenTime(target);
    let gTime = ns.getGrowTime(target);
    let hTime = ns.getHackTime(target);
    let times = {
        w: wTime,
        g: gTime,
        h: hTime,
        offset: 200,
    };
    return times;
}
function getThreads(ns, target, maxThreads) {
    // TODO: Handle situation when this multiplier to too large and
    // causes the "round up to 1" functionality at the end to mean
    // the server drains continuously - ie, the grow action doesn't
    // sufficiently compensate for the hack. This is more of a problem
    // early on when you're hacking large servers with low ram.
    let multiplier = 2;
    // Get ideal number of threads for preferred hack amount.
    let maxHackAmount = ns.getServerMaxMoney(target) / multiplier;
    let hackThreads = ns.hackAnalyzeThreads(target, maxHackAmount);
    let hackSecurityEffect = ns.hackAnalyzeSecurity(hackThreads);
    // First weaken reduces security after hack. Calculate threads needed.
    let firstWeakenEffect = 0;
    let firstWeakenThreads = hackThreads;
    while (firstWeakenEffect < hackSecurityEffect) {
        firstWeakenEffect = ns.weakenAnalyze(firstWeakenThreads);
        firstWeakenThreads++;
    }
    // Get grow threads needed to bring back up to full.
    let growThreads = ns.growthAnalyze(target, multiplier);
    let growSecurityEffect = ns.growthAnalyzeSecurity(growThreads);
    // Second weaken reduces security after growth. Calculate threads needed.
    let secondWeakenEffect = 0;
    let secondWeakenThreads = growThreads;
    while (secondWeakenEffect < growSecurityEffect) {
        secondWeakenEffect = ns.weakenAnalyze(secondWeakenThreads);
        secondWeakenThreads++;
    }
    // Scale down if this would use more threads than the maximum allowed.
    let totalThreads = hackThreads + growThreads + firstWeakenThreads + secondWeakenThreads;
    if (totalThreads > maxThreads) {
        let ratio = (maxThreads / totalThreads) * 0.8;
        hackThreads = hackThreads * ratio;
        growThreads = growThreads * ratio;
        firstWeakenThreads = firstWeakenThreads * ratio;
        secondWeakenThreads = secondWeakenThreads * ratio;
    }
    if (hackThreads < 1) {
        hackThreads = 1;
    }
    if (growThreads < 1) {
        growThreads = 1;
    }
    if (firstWeakenThreads < 1) {
        firstWeakenThreads = 1;
    }
    if (secondWeakenThreads < 1) {
        secondWeakenThreads = 1;
    }
    let threads = {
        w1: firstWeakenThreads,
        w2: secondWeakenThreads,
        g: growThreads,
        h: hackThreads,
    };
    return threads;
}
function runBatch(ns, target, times, threads, preparingServer) {
    return __awaiter(this, void 0, void 0, function* () {
        let server = ns.getServer();
        // Finish order:
        // 1. Hack
        // 2. Weaken
        // 3. Grow
        // 4. Weaken
        let w1Sleep = times.offset;
        let w2Sleep = 3 * times.offset;
        let gSleep = times.w - times.g + times.offset * 2 - w2Sleep;
        let hSleep = times.w - times.h - (w2Sleep + gSleep);
        yield ns.sleep(w1Sleep);
        ns.exec("scripts/113-weaken.js", server.hostname, threads.w1, target);
        yield ns.sleep(w2Sleep);
        ns.exec("scripts/113-weaken.js", server.hostname, threads.w2, target);
        yield ns.sleep(gSleep);
        ns.exec("scripts/112-grow.js", server.hostname, threads.g, target);
        if (!preparingServer) {
            yield ns.sleep(hSleep);
            ns.exec("scripts/111-hack.js", server.hostname, threads.h, target);
        }
    });
}
//# sourceMappingURL=110-batch.js.map