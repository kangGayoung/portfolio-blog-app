import { User, getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "firebaseApp";
import { ReactNode, createContext, useEffect, useState } from "react"

//타입설정
interface AuthProps {
    children: ReactNode;
}

const AuthContext = createContext({
    user: null as User | null,
});

// 인증 상태관리
export const AuthContextProvider = ({children}: AuthProps) => {
    const auth = getAuth(app);
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
            //현재 사용자 저장
            setCurrentUser(user);
            } else {
            setCurrentUser(user);
            }
        });
    },[auth]);

    return(
        <AuthContext.Provider value={{user: currentUser}}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;