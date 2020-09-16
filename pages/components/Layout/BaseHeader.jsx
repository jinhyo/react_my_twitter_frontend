import React, { useCallback } from "react";
import { Menu, Icon, Image, Header, Dropdown, Input } from "semantic-ui-react";
import Link from "next/link";

import { useSelector, useDispatch } from "react-redux";
import { userSelector } from "../../../features/userSlice";

function BaseHeader() {
  const dispatch = useDispatch();
  const currentUser = useSelector(userSelector.currentUser);

  return (
    <Menu
      className="baseHeader"
      style={
        {
          // marginTop: "10px",
        }
      }
    >
      <Menu.Item>
        <Link href="/">
          <a>
            <Icon name="home" color="teal" />
          </a>
        </Link>
      </Menu.Item>
      <Menu.Item>
        <Link href="/profile" className="item">
          <a>
            <Icon name="user circle" color="teal" />
            프로필
          </a>
        </Link>
      </Menu.Item>
      <Menu.Item>
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
      </Menu.Item>

      <Menu.Menu position="right">
        {currentUser ? (
          <Menu.Item>
            <Input
              icon={{ name: "search", circular: true, link: true }}
              placeholder="Search..."
            />
          </Menu.Item>
        ) : (
          <>
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
