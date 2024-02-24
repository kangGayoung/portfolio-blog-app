import AuthContext from "context/AuthContext";
import { collection, deleteDoc, doc, getDocs, orderBy, query, where } from "firebase/firestore";
import { db } from "firebaseApp";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

//타입스크립트 타입 설정
interface PostListProps {
    hasNavigation ?: boolean;
    defaultTap?: TabType | CategoryType;
}

// 게시글 <전체/나의글> 불러오기
type TabType = "all" | "my";

// 코멘트 글 타입설정
export interface CommentsInterface {
    uid?: string;
    content: string;
    id: string;
    email: string;
    createdAt: string;
}


// 컬렉션 게시글 타입설정
export interface PostProps{
    id?: string;
    title: string;
    email: string;
    summary: string;
    content: string;
    createAt: string;
    createdAt: string;
    updatedAt?: string;
    uid: string;
    category?: CategoryType;
    comments?: CommentsInterface[];
}

//카테고리 셀렉트 만들기
export type CategoryType = "Frontend" | "Backend" | "web" | "Native";
export const CATEGORIES: CategoryType[] = [
    "Frontend",
    "Backend",
    "web",
    "Native",
];

export default function PostList({ hasNavigation = true, defaultTap = "all" } : PostListProps){
    const [activeTab, setActiveTab] = useState<TabType | CategoryType>(defaultTap);
    // 저장된 컬렉션 게시글 불러오기
    const [posts, setPosts] = useState<PostProps[]>([]);
    const {user} = useContext(AuthContext);

    const getPosts = async () =>{
        //const datas = await getDocs(collection(db, "posts"));
        
        //Posts 초기화 : 삭제 후 전체 리스트에서 게시글이 사라짐
        setPosts([]);
        // 게시글 쿼리로 정렬해서 가져오기
        let postsRef = collection(db, "posts");
        //let postsQuery = query(postsRef, orderBy("createdAt", "desc"));
        let postsQuery;
        
        if (activeTab === "my" && user){
            // 나의 글만 필터링
            postsQuery = query(postsRef, where("uid", "==", user.uid), orderBy("createdAt", "desc")); // where (필드명, 필드값)
        } else if(activeTab === "all" ){
            // 전체 글 보여주기
            postsQuery = query(postsRef, orderBy("createdAt", "desc"));
        } else {
            // 카테고리 보여주기
            postsQuery = query(postsRef, where("category", "==", activeTab), orderBy("createdAt", "desc"));
        }  
        
        const datas = await getDocs(postsQuery);

        datas?.forEach((doc) => {
            // console.log( doc.data(), docid); -> 데이터와 아이디 합치기
            const dataObj = {...doc.data(), id: doc.id};
            setPosts((prev) => [...prev, dataObj as PostProps]); //새로운 데이터 추가
          });
    }

    const handleDelete = async (id: string) => {
        const confirm = window.confirm("해당 게시글을 삭제하시겠습니까??");
        if (confirm && id){ 
            await deleteDoc(doc(db, "posts", id));
            toast.success("게시글을 삭제했습니다.");
            getPosts(); // 변경된 post 리스트를 다시 가져옴
        }
    };

    // getPosts 마운트
    useEffect(()=>{
        getPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeTab]); //액티브 탭이 변할때마다 마운트

    return (
        <>
        {/* 프로필페이지에서는 안보이도록 */}
        {hasNavigation && (
            <div className="post__navigation">
                <div role="presentation" onClick={()=> setActiveTab("all")} className={activeTab === "all" ? "post__navigation--active" : ""}>전체</div>
                <div role="presentation" onClick={()=> setActiveTab("my")} className={activeTab === "my" ? "post__navigation--active" : ""}>나의 글</div>
                {CATEGORIES?.map((category) => (
                    <div key={category} role="presentation" onClick={()=> setActiveTab(category)} className={activeTab === category ? "post__navigation--active" : ""}>{category}</div>
                ))}
            </div>
        )}
        
        <div className="post__list">
            {/* {[...Array(10)].map((e, index) => ( */}
            {posts?.length > 0 ? posts?.map((post, index) => (
                // <div key={index} className="post__box"> -> 키값 변경되었을때 정확하게 변경되게 하기위해 id값 줌
                <div key={post?.id} className="post__box">
                    <Link to={`/posts/${post?.id}`}>
                        <div className="post__profile-box">
                            <div className="post__profile" />
                            <div className="post__author-name">{post?.email}</div>
                            <div className="post__date">{post?.createdAt}</div>
                        </div>
                        <div className="post__title">{post?.title}</div>
                        <div className="post__text">
                        {post?.summary}
                        </div>
                    </Link>
                        {post?.email === user?.email && (
                        <div className="post__utils-box">
                            <p className="post__delete" role="presentation" onClick={()=> handleDelete(post.id as string)}>삭제</p>
                            <p className="post__edit">
                             <Link to={`/posts/edit/${post?.id}`} className="post_edit">수정</Link>
                            </p>
                        </div>
                        )}
                        
                    
                </div>
            )) :(<div className="post__no-post">게시글이 없습니다.</div>)}
        </div>
    </>
    )
}