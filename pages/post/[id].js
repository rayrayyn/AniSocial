import React from "react";
import Post from "../../components/Post";
import { supabase } from "../../utils/supabaseClient";

export default function PostPage({ post, error }) {
  if (error) {
    return (
      <div className="my-4">
        <div className="bg-white p-4 border-2 rounded-md text-center shadow-md w-64 m-auto">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div>
      <Post post={post} showUsername single />
    </div>
  );
}

export async function getServerSideProps(context) {
  const { id } = context.query;

  const { data, error } = await supabase
    .from("posts")
    .select(
      `
      id,
      user ( id, username ),
      image,
      comments( id, text, user ( id, username ) )
      `
    )
    .eq("id", id)
    .single();

  if (!data) {
    return { props: { error: "Post does not exist" } };
  }

  if (error) {
    return { props: { error: error.message } };
  }

  return { props: { post: data } };
}
