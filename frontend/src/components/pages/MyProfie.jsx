import { useState, useEffect } from "react";
import Poster from "../homePage/Poster";
import Status from "../homePage/Status";
import Cover from "./myprofile/Cover";
import Info from "./myprofile/Info";
import EditInfo from "./myprofile/EditInfo";
import { host } from "../../env";
const MyProfile = () => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [numberOfPost, setNumberOfPost] = useState(10);

  useEffect(() => {
    fetch(host + "/api/users/myinfo", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setUser(data));
  }, []);

  const editUser = (newUser) => {
    setUser(newUser);
  };

  const addPosts = (post) => {
    setPosts([post, ...posts]);
  };

  const deletePost = (post) => {
    setPosts(posts.filter((value) => value._id !== post._id));
  };

  useEffect(() => {
    if (user?.data) {
      fetch(host + "/api/posts/user/" + user.data._id)
        .then((res) => res.json())
        .then((data) =>
          setPosts(
            data?.data?.sort((a, b) => {
              return a.time < b.time ? 1 : -1;
            })
          )
        );
    }
  }, [user]);
  const handleScroll = (container) => {
    const windowHeight = window.innerHeight;
    const scrollY = window.scrollY || window.pageYOffset;
    const bodyHeight = document.body.scrollHeight;

    // Kiểm tra xem đã cuộn xuống cuối cùng chưa
    const isBottom = windowHeight + scrollY >= bodyHeight;
    if (isBottom) setNumberOfPost((prev) => prev + 10);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    // Cleanup: loại bỏ sự kiện khi component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="bg-gray-500/10 pb-5">
      <Cover user={user?.data} />
      <Info user={user?.data}></Info>
      <EditInfo user={user?.data} editUser={editUser}></EditInfo>
      <Status user={user?.data} setPost={addPosts} />
      {posts.map((post, index) => {
        if (index < numberOfPost)
          return (
            <Poster
              key={post?._id}
              post={post}
              user={user?.data}
              delete={deletePost}
            />
          );
      })}
    </div>
  );
};

export default MyProfile;
