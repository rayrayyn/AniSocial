import React, { useState } from "react";
import toast from "react-hot-toast";
import { PhotographIcon } from "@heroicons/react/outline";
import { useUserContext } from "../contexts/state";
import { supabase } from "../utils/supabaseClient";

export default function Upload({ posts, setPosts }) {
  const [uploading, setUploading] = useState(false);
  const { session } = useUserContext();

  async function uploadPost(event) {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("You must select an image to upload.");
      }

      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      let { error: uploadError } = await supabase.storage
        .from("media")
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const user = supabase.auth.user();

      const newPost = {
        user: user.id,
        image: filePath,
      };

      let { data, error } = await supabase.from("posts").upsert(newPost);

      if (error) {
        throw error;
      }

      setPosts([
        {
          id: data[0].id,
          user: {
            username: session.user.user_metadata.username,
          },
          image: data[0].image,
        },
        ...posts,
      ]);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="cursor-pointer bg-white w-96 border-2 flex justify-center flex-col">
      <div className="m-2">
        <label
          htmlFor="single"
          className="cursor-pointer flex h-8 items-center justify-center"
        >
          <PhotographIcon className="h-full mr-2" />
          <p className="font-medium">
            {uploading ? "Uploading ..." : "Upload"}
          </p>
        </label>

        <input
          style={{
            visibility: "hidden",
            position: "absolute",
          }}
          type="file"
          id="single"
          accept="image/*"
          onChange={uploadPost}
          disabled={uploading}
        />
      </div>
    </div>
  );
}
