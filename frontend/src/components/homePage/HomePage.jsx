import Status from "./Status";
import Poster from "./Poster";
import { useEffect, useState } from "react";
import Header from "./Header";
import { socket } from "../../socket";
import { host } from "../../env";
import ProfileSide from "../profileSide/profileSide";
import ChatSide from "../chatSide/chatSide";
import "./HomePage.css";
const HomePage = () => {
  document.title = "Home Page";
  const [user, setUser] = useState();
  const [logined, setLogined] = useState(true);
  const [numberOfPost, setNumberOfPost] = useState(10);

  useEffect(() => {
    fetch(host + "/api/users/myinfo", { credentials: "include" })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setUser(data);
        if (data.status === "fail") setLogined(false);
      });
  }, []);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (user?.data?._id) {
      socket.emit("active", user.data._id);
    }
  }, [user]);

  useEffect(() => {
    if (user?.data) {
      fetch(host + "/api/posts", { credentials: "include" })
        .then((res) => res.json())
        .then((data) => {
          setPosts(
            data?.data?.sort((a, b) => {
              return a.time < b.time ? 1 : -1;
            })
          );
        });
    }
  }, [user]);

  const addPosts = (post) => {
    setPosts([post, ...posts]);
  };

  const deletePost = (post) => {
    setPosts(posts.filter((value) => value._id !== post._id));
  };

  const handleScroll = (container) => {
    const windowHeight = window.innerHeight;
    const scrollY = window.scrollY || window.pageYOffset;
    const bodyHeight = document.body.scrollHeight;
    
    // Kiểm tra xem đã cuộn xuống cuối cùng chưa
    const isBottom = windowHeight + scrollY >= bodyHeight;
    if (isBottom) setNumberOfPost(prev => prev+10)
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    // Cleanup: loại bỏ sự kiện khi component unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  if (logined)
    return (
      <>
        <Header></Header>
        <div className="main bg-gray-500/10">
          <div className="left">
            <ProfileSide></ProfileSide>
          </div>
          <div className="post">
            <Status user={user?.data} setPost={addPosts} />
            {posts.map((post, index) => {
              if (index < numberOfPost)
                return (
                  <Poster
                    key={post?._id}
                    post={post}
                    user={post.user}
                    readonly={user?.data?._id !== post.user?._id}
                    delete={deletePost}
                  />
                );
            })}
          </div>
          <div className="right">
            <ChatSide></ChatSide>
          </div>
        </div>
      </>
    );
  window.location.href = "/";
  return <></>;
};
export default HomePage;
