import React, { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Dropdown } from "semantic-ui-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

import authFunctions from "../../lib/authFunctions";
import { userActions, userSelector } from "../../features/userSlice";

// in <BaseHeader />
function DropDownMenu() {
  const dispatch = useDispatch();
  const router = useRouter();

  const currentUserNickname = useSelector(userSelector.currentUserNickname);

  const handleLogout = useCallback(async () => {
    try {
      await authFunctions.logout();
      dispatch(userActions.clearCurrentUser());
      router.push("/");
    } catch (error) {
      console.error(error);
      toast.error(error.response.data);
    }
  }, []);

  return (
    <Dropdown size="large" icon="cog" className="icon">
      <Dropdown.Menu>
        <Dropdown.Item>
          <Link
            href={`/users/[nickname]`}
            as={`/users/${currentUserNickname}`}
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
  );
}

export default DropDownMenu;
