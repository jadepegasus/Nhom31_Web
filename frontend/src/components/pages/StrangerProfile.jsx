import Cover from "./myprofile/Cover";
import Info from "./myprofile/Info";
import { useState, useEffect } from "react";
import Poster from "../homePage/Poster";
import { host } from "../../env";

const StrangerProfile = ({ user_id, user_two_id }) => {
  const [user, setUser] = useState();
  const [posts, setPosts] = useState([]);
  const [numberOfPost, setNumberOfPost] = useState(10);

  useEffect(() => {
    fetch(host + "/api/users/" + user_id, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") setUser(data.data);
      });
  }, [user_id]);

  useEffect(() => {
    fetch(host + "/api/posts/user/" + user_id, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success")
          setPosts(
            data?.data?.sort((a, b) => {
              return a.time < b.time ? 1 : -1;
            })
          );
      });
  }, [user_id]);

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

  if (user)
    return (
      <div className="bg-gray-500/10">
        <Cover
          user={user}
          user_one_id={user_two_id}
          user_two_id={user_id}
          readonly={true}
        />
        <Info user={user}></Info>
        {posts.map((post, index) => {
          if (index < numberOfPost)
            return (
              <Poster key={post?._id} post={post} user={user} readonly={true} />
            );
        })}
        <div>{user?._id}</div>
      </div>
    );
  return <div className="text-center mt-5 fw-bold">Không tìm được user</div>;
};

export default StrangerProfile;
