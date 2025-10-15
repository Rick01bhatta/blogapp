import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Service from "../appwrite/databseConfig";
import { Button, Container } from "../components";
import parse from "html-react-parser";
import { useSelector } from "react-redux";

export default function Post() {
  const [post, setPost] = useState(null);
  const { slug } = useParams();
  const navigate = useNavigate();

  const userData = useSelector((state) => state.auth.userData);
  const isAuthor = post && userData ? post.userId === userData.$id : false;

  // Fetch post on component mount
  useEffect(() => {
    if (slug) {
      Service.getPost(slug).then((data) => {
        if (data) setPost(data);
        else navigate("/");
      });
    } else {
      navigate("/");
    }
  }, [slug, navigate]);

  const deletePost = () => {
    if (!post) return;
    Service.deletePost(post.$id).then((status) => {
      if (status) {
        Service.deleteFile(post.featuredImage);
        navigate("/");
      }
    });
  };

  // Function to get direct image URL
  const getImageUrl = (fileId) => {
    if (!fileId) return "";
    return Service.getFilePreview(fileId); // Should return a full URL
  };

  if (!post) return null;

  return (
    <div className="py-8">
      <Container>
        <div className="w-full flex justify-center mb-4 relative border rounded-xl p-2">
          {post.featuredImage && (
            <img
              src={getImageUrl(post.featuredImage)}
              alt={post.title}
              className="rounded-xl max-h-96 object-cover"
            />
          )}

          {isAuthor && (
            <div className="absolute right-6 top-6 flex space-x-2">
              <Link to={`/edit-post/${post.$id}`}>
                <Button bgColor="bg-green-500">Edit</Button>
              </Link>
              <Button bgColor="bg-red-500" onClick={deletePost}>
                Delete
              </Button>
            </div>
          )}
        </div>

        <div className="w-full mb-6">
          <h1 className="text-2xl font-bold">{post.title}</h1>
        </div>

        <div className="browser-css">{parse(post.content)}</div>
      </Container>
    </div>
  );
}
