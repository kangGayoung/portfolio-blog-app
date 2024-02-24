import {useContext, useEffect, useState} from "react";
import {app} from "firebaseApp";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Router from './components/Router';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"
import Loader from "components/Loader";
import ThemeContext from "context/ThemeContext";

function App() {
  const context = useContext(ThemeContext);
  const auth = getAuth(app);
  //console.log(auth);

  // auth를 체크하기 전에 (initialize)에는 loader를 띄워주는 용도
  const [init, setInit] = useState<boolean>(false);
  // auth의 currentUser가 있으면 authenticated로 변경
  const [isAuthenticated, setIsAuthedticated] = useState<boolean>(
    //현재 사용자가 로그인 되었는지 확인
    !!auth?.currentUser
  );

  // 로그인 상태가 변경되면 로그인페이지 이후 업데이트해서 다음 페이지 보여주기
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthedticated(true);
      } else {
        setIsAuthedticated(false);
      }
      setInit(true);
    });
  },[auth]);

  return (
    <div className={context.theme === "light" ? "white" : "dark"}>
      <ToastContainer />
      {init ? <Router isAuthenticated={isAuthenticated} /> : <Loader />}
    </div>
  
  );
}

export default App;
