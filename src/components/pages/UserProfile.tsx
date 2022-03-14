import { useContext, useEffect, useState } from "react";

//material
import { LinearProgress } from "@material-ui/core";

// useContext
import { AuthContext } from "App";

// template
import { CommonLayout } from "components/templates/CommonLayout";
import { LoadLayout } from "components/templates/LoadLayout";

// organisms
import { UserProfileItem } from "components/organisms/UserProfile/UserProfileItem";
import { UserProfileSwichAction } from "components/organisms/UserProfile/UserProfileSwichAction";
import { UserProfilePosts } from "components/organisms/UserProfile/UserProfilePosts";

// api
import { userShowData } from "apis/user";

// intarface
import { UserData } from "interfaces/data/UserData";
import { FollowListModal } from "components/organisms/Modal/FollowListModal";

export const UserProfile = ({match}:any) => {

  const params = {name: match.params.userName}

  const { currentUser } = useContext(AuthContext)
  
  const [UserData, setUserData] = useState<UserData>()

  useEffect(() => {
    if (currentUser) {
      userShowData(params)
      .then((data) => {
        setUserData(data.user)
      })
      .catch((error) => {
        console.log(error)
      })
    }
  },[currentUser])

  const [action, setAction] = useState<"ALL" | "LIKE">("ALL")

  const [isOpen, setIsOpen] = useState<boolean>(false)

  return (
    <>
      {
        UserData && currentUser  ?

          <CommonLayout>

            <UserProfileItem
              UserData={UserData}
              setIsOpen={setIsOpen}
            />

            <UserProfileSwichAction
              action={action}
              setAction={setAction}
            />

            <UserProfilePosts
              UserData={UserData}
              action={action}
            />

            {/* モーダル */}
            <FollowListModal
              isOpen={isOpen}
              onClose={() => setIsOpen(false)}
              followings={UserData?.followings}
              followers={UserData?.followers}
            />

          </CommonLayout>


          
        :
          <LoadLayout>
            <div>ロード中・・・</div>
            <LinearProgress/>
          </LoadLayout>
      }
      
    </>
  )
}