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
          <script src="https://polyfill.io/v3/polyfill.min.js?features=default%2Ces2015%2Ces2016%2Ces2017%2Ces2018%2Ces2019" />

          {/* <NextScript /> 보다 script가 위에 있어야함 */}
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
