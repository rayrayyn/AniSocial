import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Post from "../../components/Post";
import Spinner from "../../components/Spinner";
import { supabase } from "../../utils/supabaseClient";

export default function Profile({ error, id, username }) {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (id) getPosts(id);
  }, [id]);

  async function getPosts(id) {
    try {
      setLoading(true);
      let { data, error, status } = await supabase
        .from("posts")
        .select(
          `
        id,
        user ( username ),
        image,
        comments( id, text, user (username) )
        `
        )
        .eq("user", id)
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

  if (error) {
    return <div className="my-4">{error}</div>;
  }

  if (loading) {
    return (
      <div className="my-4">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="my-4">
      <div className="bg-white p-4 border-2 rounded-md text-center shadow-md w-64 m-auto">
        <p>{username}&apos;s Profile Page</p>
        <p>{posts.length > 0 ? `${posts.length} Posts` : `No Posts`}</p>
      </div>

      {posts.length > 0 &&
        posts.map((post) => {
          return <Post key={post.id} post={post} showUsername={false} />;
        })}
    </div>
  );
}

export async function getServerSideProps(context) {
  const { username } = context.query;
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .ilike("username", username)
    .single();

  if (!data) {
    return { props: { error: "User does not exist" } };
  }

  if (error) {
    return { props: { error: error.message } };
  }

  return { props: { id: data.id, username: data.username } };
}
