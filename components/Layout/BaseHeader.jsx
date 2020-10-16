import React from "react";
import { Menu, Icon } from "semantic-ui-react";
import Link from "next/link";
import { useSelector } from "react-redux";

import { userSelector } from "../../features/userSlice";
import SearchBar from "./SearchBar";
import DropDownMenu from "./DropDownMenu";

function BaseHeader() {
  const currentUserId = useSelector(userSelector.currentUserId);

  return (
    <Menu className="baseHeader">
      <Menu.Item>
        <Link href="/">
          <a>
            <Icon name="home" color="teal" />
          </a>
        </Link>
      </Menu.Item>
      {currentUserId && (
        <>
          <Menu.Item>
            <Link
              href={`/users/[userId]`}
              as={`/users/${currentUserId}`}
              className="item"
            >
              <a>
                <Icon name="user circle" color="teal" />
                프로필
              </a>
            </Link>
          </Menu.Item>
          {/* <Menu.Item>
            <Link href="/notification" className="item">
              <a>
                <Icon name="bell outline" color="teal" /> 알림
              </a>
            </Link>
          </Menu.Item>
          <Menu.Item>
            <Link href="/message" className="item">
              <a>
                <Icon name="mail outline" color="teal" />
                메시지
              </a>
            </Link>
          </Menu.Item> */}
        </>
      )}

      <Menu.Menu position="right">
        {currentUserId ? (
          <>
            <Menu.Item>
              {/* 검색창 */}
              <SearchBar />
            </Menu.Item>
            <Menu.Item>
              {/* 유저 드랍다운 매뉴 */}
              <DropDownMenu />
            </Menu.Item>
          </>
        ) : (
          <>
            <Menu.Item>
              {/* 검색창 */}
              <SearchBar />
            </Menu.Item>
            <Menu.Item>
              <Link href="/register" className="item">
                <a>회원가입</a>
              </Link>
            </Menu.Item>
            <Menu.Item>
              <Link href="/login" className="item">
                <a>로그인</a>
              </Link>
            </Menu.Item>
          </>
        )}
      </Menu.Menu>
    </Menu>
  );
}

export default BaseHeader;
