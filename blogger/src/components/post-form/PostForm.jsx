import React, {useCallback} from 'react'
import { useForm } from 'react-hook-form'
import {Button, Input, Select, RTE} from '../index'
import appwriteService from "../../appwrite/conf"
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'



export default function PostForm({post}) {
    const {register, handleSubmit, watch, setValue, control, getValues} = useForm({
        defaultValues: {
            title : post?.title || '',
            slug : post?.$id || '',
            content : post?.content || '',
            status : post?.status || 'active',

        },
    });

    const navigate = useNavigate()
    const userData = useSelector((state) => state.auth.userData);
    
    const submit = async (data) => {
      try {
          let fileId = null;
  
          // Check if an image file is uploaded
          if (data.image && data.image[0]) {
              const file = await appwriteService.uploadFile(data.image[0]);
              fileId = file ? file.$id : null;
          }
  
          if (post) {
              // Update existing post
              const updatedData = {
                  ...data,
                  featuredimage: fileId || post.featuredimage || "", // Ensure featuredimage has a valid value
              };
  
              const dbPost = await appwriteService.updatePost(post.$id, updatedData);
              if (dbPost) navigate(`/post/${dbPost.$id}`);
          } else {
              // Create new post
              const newData = {
                  ...data,
                  userid: userData.$id,
                  featuredimage: fileId || "", // Set default value for featuredimage if no file uploaded
              };
  
              const dbPost = await appwriteService.createPost(newData);
              if (dbPost) navigate(`/post/${dbPost.$id}`);
          }
      } catch (error) {
          console.error("Appwrite service :: createPost :: error", error);
      }
  };
  


  const slugTransform = useCallback((value) => {
      if(value && typeof value === 'string')
        return value
                .trim()
                .toLowerCase()
                .replace(/[^a-zA-Z\d\s]+/g, "-")
                .replace(/\s/g, "-");

      
      return "";
  },[]);

  React.useEffect(() => {
    const subscription = watch((value, { name }) => {
      if(name === 'title'){
        setValue("slug",slugTransform(value.title),{shouldValidate : true});
      }
    });

    return () => subscription.unsubscribe();
  },[watch, slugTransform, setValue])
  
  return (
    <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
            <div className="w-2/3 px-2">
                <Input
                    label="Title :"
                    placeholder="Title"
                    className="mb-4"
                    {...register("title", { required: true })}
                />
                <Input
                    label="Slug :"
                    placeholder="Slug"
                    className="mb-4"
                    {...register("slug", { required: true })}
                    onInput={(e) => {
                        setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true });
                    }}
                />
                <RTE label="Content :" name="content" control={control} defaultValue={getValues("content")} />
            </div>
            <div className="w-1/3 px-2">
                <Input
                    label="Featured Image :"
                    type="file"
                    className="mb-4"
                    accept="image/png, image/jpg, image/jpeg, image/gif"
                    {...register("image", { required: !post })}
                />
                {post && (
                    <div className="w-full mb-4">
                        <img
                            src={appwriteService.getFilePreview(post.featuredimage)}
                            alt={post.title}
                            className="rounded-lg"
                        />
                    </div>
                )}
                <Select
                    options={["active", "inactive"]}
                    label="Status"
                    className="mb-4"
                    {...register("status", { required: true })}
                />
                <Button type="submit" bgColor={post ? "bg-green-500" : undefined} className="w-full">
                    {post ? "Update" : "Submit"}
                </Button>
            </div>
        </form>
    );
}
