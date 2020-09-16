import React from "react";
import Document, { Html, Head, Main, NextScript } from "next/document";

// _documnet.js가 _app.js보다 상위에 위치함
// _document.js는 HTML 문서로 커스텀 Document를 만들 때만 작성이 필요하며 생략된 경우 Next.js가 기본값을 사용한다.
// 최종적으로 _document가 _app을 감싸줌
class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head />
        <body>
          <Main />
          {/* 인터넷 익스플로러의 경우 Map, Set, Promise와 같은 것은 지원이 안되니 polyfill(polyfill.io)을 사용해서 문제를 해결 */}
          {/* 최신 문법은 babel인 변환해 주지만 Map, Set, Promise같은건 변환을 해주지 못함 */}
          <script src="https://polyfill.io/v3/polyfill.min.js?features=default%2Ces2015%2Ces2019%2Ces2018%2Ces2017%2Ces2016" />
          {/* <NextScript /> 보다 script가 위에 있어야함 */}
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;

// https://velog.io/@sbinha/next.js-styled-components-%EC%8A%A4%ED%83%80%EC%9D%BC%EC%9D%B4-%EC%A0%81%EC%9A%A9%EC%A0%84%EC%97%90-%EB%A0%8C%EB%8D%94%EA%B0%80-%EB%90%98%EB%8A%94-%EB%AC%B8%EC%A0%9C-%ED%95%B4%EA%B2%B0%EB%B2%95
