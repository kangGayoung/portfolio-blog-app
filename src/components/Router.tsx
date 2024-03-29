import {Route, Routes, Navigate} from 'react-router-dom';
import Home from 'pages/home';
import PostList from 'pages/posts';
import PostDetail from 'pages/posts/detail';
import PostNew from 'pages/posts/new';
import PostEdit from 'pages/posts/edit';
import ProfilePage from 'pages/profile';
import LoginPage from 'pages/login';
import SignupPage from 'pages/signup';

interface RouterProps{
  isAuthenticated : boolean;
}

export default function Router({isAuthenticated}: RouterProps ) {
  /*
  // firebase Auth가 인증되었으면 true로 변경해주는 로직 추가
  const [isAuthenticated, setIsAuthedticated] = useState<boolean>(false);
  */
  return (
    <>      
      <Routes>
        {isAuthenticated ? (
          <>
            <Route path="/" element={<Home />} />
            <Route path="/posts" element={<PostList />} />
            <Route path="/posts/:id" element={<PostDetail />} />
            {/* 게시글 작성 페이지 */}
            <Route path="/posts/new" element={<PostNew />} />
            <Route path="/posts/edit/:id" element={<PostEdit />} />
            <Route path="/profile" element={<ProfilePage />} />
            {/* 정의 되지않은 페이지는 홈 으로 이동 */}
            <Route path="*" element={<Navigate replace to="/" />} />
          </>
        ): (
          <>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            {/* 정의 되지않은 페이지는 홈 으로 이동 */}
            <Route path="*" element={<LoginPage />} />
          </>
        )}
        
      </Routes>
    </>
  );
}

