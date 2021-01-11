import "reflect-metadata";
import {startServer} from './app';

async function main() {
    const server = await startServer();
    const {url} = await server.listen();
    console.log(`🚀 Server ready at ${url}`);
}

main();