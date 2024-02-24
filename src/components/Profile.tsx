import AuthContext from "context/AuthContext";
import { getAuth, signOut } from "firebase/auth";
import { app } from "firebaseApp";
import { useContext } from "react";
import { toast } from "react-toastify";

const onSignOut = async () => {
    try{
        const auth = getAuth(app);
        await signOut(auth);
        toast.success("로그아웃 되었습니다.");
    }catch(error: any){
        console.log(error);
        toast.error(error?.code);
    }
}

export default function Profile(){
    // const auth = getAuth(app);
    // console.log(auth);

    const {user} = useContext(AuthContext);
    console.log(user);

    return (
    <div className="profile__box">
        <div className="flex__box-lg">
            <div className="profile_image" />
            <div>
                {/* <p className="profile__email">{auth?.currentUser?.email}</p>
                <p className="profile__name">{auth?.currentUser?.displayName || '사용자'}</p> */}
                <p className="profile__email">{user?.email}</p>
                <p className="profile__name">{user?.displayName || '사용자'}</p>
            </div>
        </div>
        <div role="presentation" className="profile__logout" onClick={onSignOut}>로그아웃</div>
    </div>
    )
}