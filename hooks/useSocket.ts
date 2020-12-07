import io from 'socket.io-client';

// http랑 공유를 할 수 있음 -> 웹 소켓은 cors가 안 걸려서 바로 백엔드 주소를 넣었음
const backUrl = process.env.NODE_ENV === 'production' ? 'https://sleact.nodebird.com' : 'http://localhost:3095';

const sockets: { [key: string]: SocketIOClient.Socket } = {};
const useSocket = (workspace?: string): [SocketIOClient.Socket | undefined, () => void] => {
    if (!workspace) {
        return [undefined, disconnect];
    }
    if (!sockets[workspace]) {
        // namespace(workspace) 가 일치하는 사람들 끼리 실시간 소통을 할 수 있다.
        sockets[workspace] = io(`${backUrl}/ws-${workspace}`, {
            transports: ['websocket'],
        });
        console.info('create socket', workspace, sockets[workspace].id);
    }

    function disconnect() {
        if (workspace && sockets[workspace]) {
            sockets[workspace].disconnect();
            delete sockets[workspace];
        }
    }
    return [sockets[workspace], disconnect];
};

export default useSocket;
