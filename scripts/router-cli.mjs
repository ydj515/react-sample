// The upstream tsr executable loads CJS and triggers a router-core cycle.
// Its public ESM entry preserves the same generate/watch commands and exit codes.
import "@tanstack/router-cli";
