/* 
    1. 리액트는 함수부분이 다시 호출 되더라도 return 부분이 바뀌지 않으면 시렞로 화면을 다시 그리진 않는다.(virtual DOM의 역활)
    2. 하이라이트를 키면 번쩍 거리는 건 함수가 다시 호출돼서 그렇다.
*/
import axios from 'axios';

const fetcher = (url: string) => axios.get(url, { withCredentials: true }).then((response) => response.data);

export default fetcher;
