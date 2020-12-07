import path from 'path';
import webpack from 'webpack';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'; // 타입, eslint, prettier 체크를 병렬처리

const isDevelopment = process.env.NODE_ENV !== 'production';

const config: webpack.Configuration = {
    name: 'sleact',
    mode: isDevelopment ? 'development' : 'production',
    devtool: isDevelopment ? 'inline-source-map' : 'hidden-source-map', // 소스코드 디버깅을 할 때 도움을 준다
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
        alias: {
            // 절대경로를 만들어 줌
            '@hooks': path.resolve(__dirname, 'hooks'),
            '@components': path.resolve(__dirname, 'components'),
            '@layouts': path.resolve(__dirname, 'layouts'),
            '@pages': path.resolve(__dirname, 'pages'),
            '@utils': path.resolve(__dirname, 'utils'),
            '@typings': path.resolve(__dirname, 'typings'),
        },
    },
    entry: {
        app: './client',
    },
    module: {
        // 핵심적인 변환과정, 모든 파일들을 하나의 js로 만든다.
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'babel-loader',
                options: {
                    presets: [
                        [
                            '@babel/preset-env', // IE 지원
                            {
                                targets: { browsers: ['last 2 chrome versions'] },
                                debug: isDevelopment,
                            },
                        ],
                        '@babel/preset-react', // js -> react
                        '@babel/preset-typescript', // ts -> js
                    ],
                    env: {
                        development: {
                            // 이렇게 등록하면 emotion으로 컴포넌트를 만들 때 개발자 도구에서 볼 수 있게 해준다.
                            plugins: [['@emotion', { sourceMap: true }], require.resolve('react-refresh/babel')],
                        },
                        // 배포할 떈 컴포넌트 이름을 제거 한다.
                        production: {
                            plugins: ['@emotion'],
                        },
                    },
                },
                exclude: path.join(__dirname, 'node_modules'),
            },
            {
                test: /\.css?$/,
                use: ['style-loader', 'css-loader'],
            },
            // {
            //     test: /\.css$/,
            //     use: ['style-loader', 'postcss-loader'],
            // },
            // {
            //     test: /\.jsx?$/,
            //     use: ['babel-loader', 'astroturf/loader'],
            // },
        ],
    },
    plugins: [
        new ForkTsCheckerWebpackPlugin(), // 개발용 서버 속도가 빨라짐
        // 새로고침 없이 자동으로 핫리로딩이 된다
        new webpack.HotModuleReplacementPlugin(),
        new ReactRefreshWebpackPlugin(),
    ],
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name].js', // entry의 결과물에 의해 생성 된다. [] 는 entry의 key의 값으로 가져온다.
        publicPath: '/dist/', // dist 폴더 안에 app.js
    },
    devServer: {
        historyApiFallback: true, // 개발용 서버가 BrowserRouter를 인식을 한다.
        port: 3090,
        publicPath: '/dist/',
        proxy: {
            '/api/': {
                changeOrigin: true,
                target: 'hppt://localhost:3095',
            },
        },
    },
};

export default config;

// 1시간 16분
