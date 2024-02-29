import http from "http"
import SocketService from "./service/socket";

async function init() {
    const sockerService = new SocketService();
    console.log("Init Socket listeners...");

    const httpServer = http.createServer();
    const PORT = process.env.PORT ? process.env.port : 8000;

    sockerService.io.attach(httpServer);

    httpServer.listen(PORT, () => 
        console.log(`http server started ${PORT}`)
    )

    sockerService.initListeners();
}

init();