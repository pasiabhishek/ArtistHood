import React from 'react'
import './css/CreatePost.css'
export default function CreatePost() {
    
    let user = JSON.parse(localStorage.getItem("user"));
    let userId = user ? user.id : null;
    
    const [postData, setPostData] = React.useState({
        userId: userId,
        media: null,
        caption: "",
        mediaType: "image"
    });

    const postHandler = (e) => {
        e.preventDefault();
        // Handle post submission logic here
        alert(JSON.stringify(postData));
    }
    return (
        <div className='CreatePost'>
            <div className="header">
                <h1>Create Post</h1>
            </div>
            <div className="content">
                <form className="create-post-form" onSubmit={postHandler}>
                    <div className="form-group">
                        <label htmlFor="media">Media</label>
                        <input type="file" id="media" name="media" accept="image/*,video/*,audio/*" 
                        onChange={(e) => setPostData({ ...postData, media: e.target.files[0] })}
                        required/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="caption">Caption</label>
                        <textarea id="caption" name="caption" 
                        onChange={(e) => setPostData({ ...postData, caption: e.target.value })}
                            required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="mediaType">Media Type</label>
                        <select id="mediaType" name="mediaType" 
                        onChange={(e) => setPostData({ ...postData, mediaType: e.target.value })}
                        required>
                            <option value="image">Image</option>
                            <option value="video">Video</option>
                            <option value="audio">Audio</option>
                        </select>
                    </div>
                    <button type="submit" onClick={postHandler}>Post</button>
                </form>
            </div >
        </div >
    )
}

