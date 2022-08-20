import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Post from "../components/Post";
import Spinner from "../components/Spinner";
import Upload from "../components/Upload";
import { useUserContext } from "../contexts/state";
import { supabase } from "../utils/supabaseClient";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);

  const { session } = useUserContext();

  useEffect(() => {
    getPosts();
  }, []);

  async function getPosts() {
    try {
      setLoading(true);

      let { data, error, status } = await supabase
        .from("posts")
        .select(
          `
        id,
        user ( id, username ),
        image,
        comments( id, text, user ( id, username ) )
        `
        )
        .order("created_at", { ascending: false });

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setPosts(data);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="my-4">
      {loading ? (
        <Spinner />
      ) : (
        <>
          {session && <Upload posts={posts} setPosts={setPosts} />}
          {posts.map((post) => {
            return <Post key={post.id} post={post} />;
          })}
        </>
      )}
    </div>
  );
}
