import React, { useState, useEffect } from "react";
import { Container, PostCard } from "../components";
import Service from "../appwrite/databseConfig";

function AllPosts() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function fetchPosts() {
      const data = await Service.getPosts([]);
      if (data && data.documents) setPosts(data.documents);
    }
    fetchPosts();
  }, []);

  return (
    <div className="w-full py-8">
      <Container>
        <div className="flex flex-wrap">
          {posts.map((post) => (
            <div key={post.$id} className="p-2 w-1/4">
              <PostCard {...post} />
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}

export default AllPosts;
