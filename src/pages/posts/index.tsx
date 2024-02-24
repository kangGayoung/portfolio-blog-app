import Footer from "components/Footer";
import Header from "components/Header";
import PostList from "components/PostList";
import Profile from "components/Profile";

export default function PostPage(){
    return (
        <>
            <Header />
            <Profile />
            <PostList hasNavigation={false} defaultTap="my" />
            <Footer />
        </>
    )
}