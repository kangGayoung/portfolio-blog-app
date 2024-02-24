import { useContext, useEffect, useState } from "react"
import { collection, addDoc, doc, getDoc, updateDoc } from "firebase/firestore"; 
import AuthContext from "context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "firebaseApp";
import { toast } from "react-toastify";
import { PostProps } from "./PostList";

export type CategoryType = "Frontend" | "Backend" | "web" | "Native";
export const CATEGORIES: CategoryType[] = [
    "Frontend",
    "Backend",
    "web",
    "Native",
];

export default function PostForm (){
    const params = useParams(); // 어느 폼인지 확인을 위해서 파람 사용
    const [post, setPost] = useState<PostProps | null>(null); // 이전 게시글이 있는지 없는지 확인
    const [title, setTitle] = useState<string>("");
    const [summary, setSummary] = useState<string>("");
    const [content, setContent] = useState<string>("");
    const [category, setCategory] = useState<CategoryType >("Frontend");
    const {user} = useContext(AuthContext);
    const navigate = useNavigate();
    //console.log(post);

    const onSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try{
            //post id가 있는 경우에만 글작성
            if(post && post.id){
                //만약 post 데이터가 있다면, firestore로 데이터 수정
                const postRef = doc(db, "posts", post?.id);
                await updateDoc(postRef,{
                    title: title,
                    summary: summary,
                    content: content,
                    updatedAt: new Date()?.toLocaleDateString("ko",{ //게시글 작성시간 순서 정렬
                        hour:"2-digit",
                        minute:"2-digit",
                        second:"2-digit",
                    }),
                    category: category,
                });

                toast?.success("게시글을 수정했습니다.");
                navigate(`/posts/${post.id}`);
            }else{
                // 만약 post 데이터가 없다면,
                // firestore로 데이터 생성    
                await addDoc(collection(db, "posts"), {
                    title: title,
                    summary: summary,
                    content: content,
                    createdAt: new Date()?.toLocaleDateString("ko",{ //게시글 작성시간 순서 정렬
                        hour:"2-digit",
                        minute:"2-digit",
                        second:"2-digit",
                    }),
                    email: user?.email,
                    uid: user?.uid,
                    category: category,
                });

                toast?.success("게시글을 생성했습니다.");
                navigate("/");
            }
            
        }catch(e:any){
            console.log(e);
            toast?.error(e?.error);
        }
    }

    const onChange = (
        e:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement |HTMLSelectElement>
    ) => {
        const {
            target: {name, value},
        }=e;

        if(name === "title"){
            setTitle(value);
        }
        
        if(name === "summary"){
            setSummary(value);
        }
        
        if(name === "content"){
            setContent(value);
        }

        if(name === "category"){
            setCategory(value as CategoryType);
        }
    }

    const getPost = async(id: string)=>{
        if(id){
            const docRef = doc(db, "posts", id);
            const docSnap = await getDoc(docRef);
            //console.log(docSnap?.data());

            setPost({id:docSnap.id, ...(docSnap.data() as PostProps)});
        }
    };

    useEffect(()=>{
        if(params?.id) getPost(params?.id);
    }, [params?.id]);

    // 수정할 데이터가 있으면 폼필드로 데이터 셋팅
    useEffect(() => {
        if(post){
            setTitle(post?.title);
            setSummary(post?.summary);
            setContent(post?.content);
            setCategory(post?.category as CategoryType);
        }
    },[post]);

    return (
    <form onSubmit={onSubmit} className="form">
        <div className="form__block">
            <label htmlFor="title">제목</label>
            <input type="text" name="title" id="title" required onChange={onChange} value={title}/>
        </div>
        <div className="form__block">
            <label htmlFor="category">카테고리</label>
            <select  name="category" id="category" required onChange={onChange} defaultValue={category}>
                <option value="">카테고리를 선택해주세요</option>
                {CATEGORIES?.map((category) => (
                    <option value={category} key={category}>{category}</option>
                ))}
            </select>
        </div>
        <div className="form__block">
            <label htmlFor="summary">요약</label>
            <input type="text" name="summary" id="summary" required onChange={onChange} value={summary} />
        </div>
        <div className="form__block">
            <label htmlFor="content">내용</label>
            <textarea name="content" id="content" required onChange={onChange} value={content} />
        </div>
        <div className="form__block">
            <input type="submit" value={post ? '수정' : '제출'} className="form__btn-submit" />
        </div>
    </form>
    )
}