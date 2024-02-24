import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { PostProps } from "./PostList";
import { deleteDoc, doc, getDoc } from "firebase/firestore";
import { db } from "firebaseApp";
import Loader from "./Loader";
import { toast } from "react-toastify";
import Comments from "./Comments";

export default function PostDetail(){
    const [post, setPost] = useState<PostProps | null>(null);
    const params = useParams();
    //console.log(params?.id);
    const navigate = useNavigate();

    const getPost = async(id: string)=>{
        if(id){
            const docRef = doc(db, "posts", id);
            const docSnap = await getDoc(docRef);
            //console.log(docSnap?.data());

            setPost({id:docSnap.id, ...(docSnap.data() as PostProps)});
        }
    };

    //console.log(post);
    const handleDelete = async () =>{
        //console.log("delete!");
        const confirm = window.confirm("해당 게시글을 삭제하시겠습니까??");
        if (confirm && post && post.id){ // 게시글 삭제확인 & 게시글 확인 & 게시글 아이디 확인
            await deleteDoc(doc(db, "posts", post.id));
            toast.success("게시글을 삭제했습니다.");
            navigate("/");
        }
    }

    useEffect(()=>{
        if(params?.id) getPost(params?.id);
    }, [params?.id]);

    return (
        <>
        <div className="post__list">
            <div className="post__detail">
                {post ? (
                <>
                    <div className="post__box">
                        <div className="post__title">
                        {post?.title}
                        </div>
                        <div className="post__profile-box">
                            <div className="post__profile" />
                            <div className="post__author-name">{post?.email}</div>
                            <div className="post__date">{post?.createAt || "자유주제"}</div>
                        </div>
                        <div className="post__utils-box">
                            {post?.category && ( //카테고리 설정이 있을때만 카테고리 보여주기
                                <p className="post__category">{post?.category}</p>
                            )}                        
                            <p className="post__delete" role="presentation" onClick={handleDelete}>삭제</p>
                            <p className="post__edit">
                                <Link to={`/posts/edit/${post?.id}`} >수정</Link>
                            </p>
                        </div>
                        <div className="post__text post__text--pre--wrap">
                        {post?.content}
                        </div>
                    </div>
                    <Comments post={post} getPost={getPost} />
                </>
                ):(<Loader />)}
            </div> 
        </div>
        </>
    );
}