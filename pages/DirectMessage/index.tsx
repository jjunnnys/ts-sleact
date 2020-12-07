import React, { useCallback } from 'react';
import gravatar from 'gravatar';
import useSWR, { useSWRInfinite } from 'swr';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import { Header } from '@pages/DirectMessage/styles'; // 단순 ui 작업이면 styles
import ChatList from '@components/ChatList'; // 기능이 들어가면 component
import ChatBox from '@components/ChatBox';
import fetcher from '@utils/fetcher';
import { IDM, IUser } from '@typings/db';
import useInput from '@hooks/useInput';

const PAGE_SIZE = 20;

const DirectMessage = () => {
    const { workspace, id } = useParams<{ workspace: string; id: string }>();

    const { data: myData } = useSWR<IUser>('/api/user', fetcher);
    const { data: userData } = useSWR<IUser>(`/api/workspace/${workspace}/user/${id}`, fetcher);
    // 인피니트 스크롤 적용해야 해서 useSWRInfinite 사용
    const { data: chatData, revalidate: revalidateChat, mutate: mutateChat, setSize } = useSWRInfinite<IDM[]>(
        (index: number) => `/api/workspace/${workspace}/dm/${id}/chats?perPage=${PAGE_SIZE}&page=${index + 1}`,
        fetcher,
    );
    const [chat, onChangeChat, setChat] = useInput('');

    const onSubmitForm = useCallback(
        (e: React.ChangeEvent<HTMLFormElement>) => {
            e.preventDefault();
            if (myData && userData && chat?.trim() && chatData) {
                // 채팅을 첬을 때
                // 클라이언트에서 변조
                const savedChat = chat;
                mutateChat((prevChatData) => {
                    // 불변성 지켜줘야 함
                    prevChatData[0].unshift({
                        id: (chatData[0][0]?.id || 0) + 1,
                        content: savedChat,
                        SenderId: myData.id,
                        Sender: myData,
                        ReceiverId: userData.id,
                        Receiver: userData,
                        createdAt: new Date(),
                    });
                    return prevChatData;
                }).then(() => {
                    setChat(() => '');
                });
                axios
                    .post(
                        `/api/workspace/${workspace}/dm/${id}/chat`,
                        {
                            content: chat,
                        },
                        {
                            withCredentials: true,
                        },
                    )
                    .catch(console.error);
            }
        },
        [chat, workspace, myData, userData, id, chatData],
    );

    return (
        <div>
            <Header>
                {userData && (
                    <>
                        <img src={gravatar.url(userData.email, { s: '24px' })} alt={userData.nickname} />
                        <span>{userData.nickname}</span>
                    </>
                )}
            </Header>
            <ChatList />
            {userData && (
                <ChatBox
                    placeholder={`Message ${userData.nickname}`}
                    data={[]} // 멘션할 때 씀, 1대1일 경우 없어서 빈칸으로
                    onChangeChat={onChangeChat}
                    onSubmitForm={onSubmitForm}
                    chat={chat}
                />
            )}
        </div>
    );
};

export default DirectMessage;
