import React from 'react'
import './css/CreatePost.css'
export default function CreatePost() {

    return (
        <div className='CreatePost'>
            <div className="header">
                <h1>Create Post</h1>
            </div>
            <div className="content">
                <form className="create-post-form">
                    <div className="form-group">
                        <label htmlFor="media">Media</label>
                        <input type="file" id="media" name="media" accept="image/*,video/*,audio/*" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="caption">Caption</label>
                        <textarea id="caption" name="caption" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="mediaType">Media Type</label>
                        <select id="mediaType" name="mediaType">
                            <option value="image">Image</option>
                            <option value="video">Video</option>
                            <option value="audio">Audio</option>
                        </select>
                    </div>
                    <button type="submit">Post</button>
                </form>
            </div >
        </div >
    )
}

