import Header from "components/Header";
import Footer from "components/Footer";
import PostList from "components/PostList";
import Carousel from "components/Carousel";

export default function Home(){
    // 변하지 않는 헤더, 푸터 만들어주기
    return(
        <>
            <Header />
            <Carousel />
            <PostList />
            <Footer />
        </>
    );
}