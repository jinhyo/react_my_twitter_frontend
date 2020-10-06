import React, { useCallback } from "react";
import { Menu, Icon, Image, Header, Dropdown, Input } from "semantic-ui-react";
import Router from "next/router";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { userSelector, userActions } from "../../features/userSlice";
import authFunctions from "../../lib/authFunctions";
import { toast } from "react-toastify";

function BaseHeader() {
  const dispatch = useDispatch();
  const currentUserId = useSelector(userSelector.currentUserId);
  console.log("currentUserId", currentUserId);

  const handleLogout = useCallback(async () => {
    if (currentUserId) {
      try {
        await authFunctions.logout();
        dispatch(userActions.clearCurrentUser());
        Router.push("/");
      } catch (error) {
        console.error(error);
        toast.error(error.response.data);
      }
    }
  }, [currentUserId]);

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
        </>
      )}

      <Menu.Menu position="right">
        {currentUserId ? (
          <>
            <Menu.Item>
              <Input
                icon={{ name: "search", circular: true, link: true }}
                placeholder="Search..."
              />
            </Menu.Item>
            <Menu.Item>
              <Dropdown size="large" icon="cog" className="icon">
                <Dropdown.Menu>
                  <Dropdown.Item>
                    <Link
                      href={`/users/[userId]`}
                      as={`/users/${currentUserId}`}
                      className="item"
                    >
                      <a>
                        <span style={{ color: "black" }}>프로필</span>
                      </a>
                    </Link>
                  </Dropdown.Item>
                  <Dropdown.Item onClick={handleLogout}>로그아웃</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Menu.Item>
          </>
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
