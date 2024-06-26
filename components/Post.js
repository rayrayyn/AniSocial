/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";
import { ChatIcon } from "@heroicons/react/solid";
import toast from "react-hot-toast";
import Link from "next/link";

import { supabase } from "../utils/supabaseClient";
import { useUserContext } from "../contexts/state";
import { ROUTES } from "../constants/routes";

export default function Post({ post, showUsername = true, single }) {
  const { id, user, image, comments = [] } = post;
  const { session } = useUserContext();

  const [clicked, setClicked] = useState(false);
  const [text, setText] = useState("");
  const [postComments, setPostComments] = useState(comments);

  function getImage(url) {
    const { publicURL } = supabase.storage.from("media").getPublicUrl(url);
    return publicURL;
  }

  async function addComment(e) {
    if (text === "") {
      return;
    }

    if (!session) {
      return;
    }

    if (e) {
      e.preventDefault();
    }

    const newComment = {
      user: session.user.id,
      text: text,
      post_id: id,
    };

    let { data, error } = await supabase.from("comments").upsert(newComment);

    if (error) {
      return toast.error(error.message);
    }

    setText("");
    setPostComments([
      ...postComments,
      {
        id: data[0].id,
        text: data[0].text,
        user: {
          username: session.user.user_metadata.username,
        },
      },
    ]);
  }

  return (
    <div
      className={`rounded-md mx-auto ${
        single ? "max-w-screen-sm" : "max-w-sm"
      } p-2 mt-4 border-2 bg-white`}
    >
      {showUsername && (
        <div className="flex justify-between h-6">
          <Link href={`${ROUTES.profile}/${user.username}`}>
            <a className="font-medium ml-1 hover:underline">{user.username}</a>
          </Link>
        </div>
      )}

      <Link href={`${ROUTES.post}/${id}`}>
        <img
          className="rounded-md w-full h-full my-2 border-2 cursor-pointer"
          src={getImage(image)}
          alt="Image"
        />
      </Link>

      <div className="ml-1">
        {postComments.length != 0 && !clicked && (
          <div className="cursor-pointer" onClick={() => setClicked(true)}>
            View {postComments.length} comment{postComments.length > 1 && "s"}
          </div>
        )}
        {clicked && (
          <div>
            {postComments.map((comment, index) => (
              <p key={index}>
                <span className="font-medium">{comment.user.username} </span>
                {comment.text}
              </p>
            ))}
            <div
              className="cursor-pointer text-neutral-400"
              onClick={() => setClicked(false)}
            >
              Hide
            </div>
          </div>
        )}
      </div>
      <form onSubmit={addComment} className="flex h-8 mt-2">
        <input
          className="w-full rounded-md border-2 p-2"
          type="text"
          placeholder={session ? `Add a comment` : "Sign In To Comment"}
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={!session}
        />
        {session && (
          <ChatIcon className={"ml-2 cursor-pointer"} onClick={addComment} />
        )}
      </form>
    </div>
  );
}
