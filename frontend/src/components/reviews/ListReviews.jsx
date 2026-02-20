import React from 'react'
import ReactStars from "react-rating-stars-component";
const ListReviews = ({reviews}) => {
    

  return (
    <div>
     <div className="reviews w-75">
      <h3>Other's Reviews:</h3>
      <hr />
      {reviews?.map((review)=>(
        <div key={review?._id} className="review-card my-3">
        <div className="row">
          <div className="col-1">
            <img
              src={review?.user?.avatar ?review?.user?.avatar?.url: "/images/default_avatar.jpg"}
              alt="User Name"
              width="50"
              height="50"
              className="rounded-circle"
            />
          </div>
          <div className="col-11">
            <ReactStars
  key={review?._id + review?.rating}  // 🔥 add this
  count={5}
  value={review?.rating}
  size={22}
  edit={false}
  activeColor="#ffb829"
/>
            <p className="review_user">by {review.user?.name}</p>
            <p className="review_comment">{review?.comment}</p>
          </div>
        </div>
        <hr />
      </div>

      ))}
            
    </div>
    </div>

  )
}

export default ListReviews