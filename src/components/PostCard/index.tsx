import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { generateImageForPostThunk, savePostThunk, deleteSavedPostThunk, clearPostImage } from "../../store/features/posts/postsSlice";
import classes from "./styles.module.scss";
import SimpleButton from "../SimpleButton";
import { SvgIcon } from "../SvgIcon";
import React, { useEffect } from "react";
import { showNotification } from "../../store/features/notifications/notificationSlice";
import { showAuthBanner } from "../../store/features/authBanner/authBannerSlice";


export interface PostCardProps {
  isOnDash: boolean;
  post_id: string;
  text?: string;
  hashtags?: string;
  image?: string;
  alt?: string;
}

export const PostCard: React.FC<PostCardProps> = ({
  isOnDash = false,
  post_id,
  text = "React Native and @expo is the best option by far, and can’t even compare to Xamarin or Dart & Flutter.",
  hashtags = "#fyp #foryou #foryoupage #viral #trending #tiktok #tiktoktrend #explore #tiktokviral #funny #comedy #dance #music #relatable #tiktokchallenge #storytime #duet #glowup #aesthetic #lifestyle",
  image = "",
  alt
}) => {

  const dispatch = useAppDispatch();
  const imageLoadingForPostIds = useAppSelector(state => state.posts.imageLoadingForPostIds);
  const isImageLoading = imageLoadingForPostIds.includes(post_id);
  const auth = useAppSelector((state) => state.auth);

  const handleCopyText = (whatToCopy: string) => {
    if (!whatToCopy) return;

    navigator.clipboard.writeText(whatToCopy)
      .then(() => {
        dispatch(showNotification({ message: "Text copied!", type: "success" }));
      })
      .catch(() => {
        dispatch(showNotification({ message: "Failed to copy text.", type: "error" }));
      });
  };

  const handleDeletePost = () => {
    dispatch(deleteSavedPostThunk({
      post_id: post_id
    }))
      .unwrap()
      .then(() => {
        dispatch(showNotification({ message: "Post deleted!", type: "success" }));
      })
      .catch(() => {
        dispatch(showNotification({ message: "Failed to delete post.", type: "error" }));
      });
  }

  const handleSavePost = () => {

    if (!Boolean(auth.accessToken)) {
      dispatch(showAuthBanner("✨ Love what you created? Sign in or join free to save your post and build your collection!"));
      return; // 🚫 Don’t proceed to save
    }

    dispatch(savePostThunk({
      post: {
        post_id: post_id,
        caption: text,
        hashtags: hashtags,
        image_url: image
      }
    }))
      .unwrap()
      .then(() => {
        dispatch(showNotification({ message: "Post saved!", type: "success" }));
      })
      .catch(() => {
        dispatch(showNotification({ message: "Failed to save post.", type: "error" }));
      });
  }

  const handleImageGeneration = () => {

    if (!Boolean(auth.accessToken)) {
      dispatch(showAuthBanner("🚀 Want to see your post come alive? Create a free account or log in to start generating images instantly!"));
      //return; // 🚫 Don’t proceed to generate
    } else {

      dispatch(clearPostImage(post_id));
      dispatch(
        generateImageForPostThunk({
          post_id: post_id,
          caption: text,
          hashtags: hashtags
        })
      )
        .unwrap()
        .then(() => {
          dispatch(showNotification({ message: "Image Generated!", type: "success" }));
        })
        .catch(() => {
          dispatch(showNotification({ message: "Failed to generate image.", type: "error" }));
        });
    }
  }

  const handleImageDownload = async () => {
    try {
      const response = await fetch(image);
      if (!response.ok) throw new Error("Failed to fetch image");

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "generated_image_" + post_id + ".jpg";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url); // cleanup
    } catch (error) {
      console.error("Image download failed:", error);
    }
  };

  useEffect(() => {
    const discardImage = (e: any) => {
      if (e.detail?.post_id === post_id && image) {
        // If the event is for this post, discard the image
        if (typeof window !== 'undefined') {
          // @ts-ignore
          image = "";
        }
      }
    };
    window.addEventListener('discardPostImage', discardImage);
    return () => window.removeEventListener('discardPostImage', discardImage);
  }, [post_id, image]);

  return (
    <div className={classes.PostCard}>
      <div className={classes.cardWrapper}>
        <div className={classes.cardControls}>
          {isOnDash ? <SimpleButton icon="close" variant="secondary" onClick={handleDeletePost} /> : <SimpleButton title="Save" onClick={handleSavePost} />}
        </div>
        <div className={`${classes.postText} ${classes.contentButton}`} onClick={() => handleCopyText(text)}>
          {text}
          <div className={classes.iconWrapper}>
            <div className={classes.icon}>
              <SvgIcon name="copy" />
            </div>
          </div>
        </div>
        {hashtags !== "" && 
          <div className={`${classes.hashtagsText} ${classes.contentButton}`} onClick={() => handleCopyText(hashtags)}>
          {hashtags}
          <div className={classes.iconWrapper}>
            <div className={classes.icon}>
              <SvgIcon name="copy" />
            </div>
          </div>
        </div>
        }
        {isImageLoading && !image ? (
          <div className={classes.imageSectionWrapper}>
            <div className={classes.skeletonLoader}></div>
          </div>
        ) : image ? (
          <div className={classes.imageSectionWrapper}>
            <div className={classes.imageWrapper}>
              <img src={image} alt={alt || "image"} className={classes.image} />
            </div>
            <div className={classes.buttonsWrapper}>
              {!isOnDash &&
                <SimpleButton title="Regenerate" icon="reload" onClick={handleImageGeneration} />
              }
              <SimpleButton title="Download" icon="download" onClick={handleImageDownload} />
            </div>
          </div>
        ) : (
          !isOnDash &&
          <div className={classes.imageSectionWrapper}>
            <SimpleButton title="Generate Image" icon="zapSquare" onClick={handleImageGeneration} />
          </div>
        )}
      </div>
    </div>
  )
}

export default PostCard